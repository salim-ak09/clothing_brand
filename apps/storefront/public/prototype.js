
/* Application State */
const appState = {
    currentPage: 'home',
    currentColor: '#6f1b31',
    currentSize: 'L',
    isStudioActive: false,
    activeSection: 'hero',
    discountApplied: false,
    discountRate: 0.10,
    cart: [
        {
            id: 'custom-hoodie-1',
            name: 'Burgundy Heavyweight 450GSM Hoodie',
            color: '#6f1b31',
            size: 'L',
            price: 145.00,
            qty: 1
        }
    ],
    products: [
        {
            id: 'prod-1',
            name: 'Burgundy Heavyweight 450GSM Hoodie',
            category: 'hoodies',
            price: 145.00,
            badge: 'LIMITED 450GSM',
            desc: 'Double-lined hood with tactile French terry texture and puff chest emblem.',
            colorName: 'Burgundy Red',
            hex: '#6f1b31'
        },
        {
            id: 'prod-2',
            name: 'Obsidian Washed Double-Zip Hoodie',
            category: 'hoodies',
            price: 160.00,
            badge: 'BEST SELLER',
            desc: 'Drop-shoulder brutalist fit with gunmetal oxidized two-way zippers.',
            colorName: 'Obsidian Black',
            hex: '#09080c'
        },
        {
            id: 'prod-3',
            name: 'Raw Crimson Oversized Crewneck',
            category: 'crews',
            price: 125.00,
            badge: 'NEW DROP',
            desc: 'Distressed ribbed trims with hand-sprayed fade gradient wash.',
            colorName: 'Crimson Wine',
            hex: '#520b1e'
        },
        {
            id: 'prod-4',
            name: 'Heavy French Terry Tactical Sweatpants',
            category: 'bottoms',
            price: 135.00,
            badge: 'REINFORCED',
            desc: 'Ergonomic knee darts, deep gusseted pockets, and ankle cord toggles.',
            colorName: 'Burgundy Red',
            hex: '#6f1b31'
        },
        {
            id: 'prod-5',
            name: 'Bone White Boxy Heavyweight Tee',
            category: 'crews',
            price: 65.00,
            badge: '300GSM',
            desc: 'Heavy single-jersey compact yarn with high-neck ribbed collar.',
            colorName: 'Bone Off-White',
            hex: '#e3e1da'
        },
        {
            id: 'prod-6',
            name: 'Cybernetic Monogram Knitted Beanie',
            category: 'accessories',
            price: 45.00,
            badge: 'MERINO BLEND',
            desc: 'Ribbed heavyweight yarn with metallic silver Æ insignia badge.',
            colorName: 'Obsidian Black',
            hex: '#09080c'
        },
        {
            id: 'prod-7',
            name: 'Atelier French Terry Zip Balaclava',
            category: 'accessories',
            price: 55.00,
            badge: 'RUNWAY EDITION',
            desc: 'Contoured face cover with breathable mesh lining in 450GSM cotton.',
            colorName: 'Burgundy Red',
            hex: '#6f1b31'
        },
        {
            id: 'prod-8',
            name: 'Forest Relaxed Cargo Pant',
            category: 'bottoms',
            price: 140.00,
            badge: 'RESTOCKED',
            desc: 'Magnetic storm pocket flaps and military-grade bartack anchors.',
            colorName: 'Forest Green',
            hex: '#233026'
        }
    ]
};

/* Three.js Scene Variables */
let scene, camera, renderer, controls, lenis;
let hoodieGroup, decalMeshFront, decalMeshBack;
let bumpTexture, decalTextureFront, decalTextureBack;
let toastTimeout = null;
let isTransitioning = false;

/* AI Assistant State */
const aiState = {
    isOpen: false,
    isLoading: false,
    messages: [
        {
            role: 'assistant',
            text: 'Welcome to the AETHER Atelier. I am your material engineer and personal styling concierge. Ask me anything regarding our 450GSM French Terry drape, boxy drop-shoulder sizing for your height/weight, or curated streetwear pairings.'
        }
    ],
    chatHistory: []
};

const pageLabels = {
    home: '3D SHOWCASE',
    shop: 'ATELIER CATALOG',
    about: 'BRAND PHILOSOPHY',
    profile: 'MEMBER PROFILE',
    checkout: 'ENCRYPTED CHECKOUT'
};

let target3DPoints = {};

async function initApp() {
    target3DPoints = {
        fabric: new THREE.Vector3(0, 0.23, 0.48),
        graphics: new THREE.Vector3(0, 0.17, -0.48),
        details: new THREE.Vector3(0.77, -0.25, 0.03)
    };
    try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success && json.data.length > 0) {
            appState.products = json.data;
        }
    } catch (e) {
        console.error("Failed to load products from DB", e);
    }

    initSmoothScroll();
    initThree();
    generateProceduralTextures();
    buildSculptedRealisticHoodie();
    setupGraphicTextures();
    setupResponsiveScrollTimeline();
    setupEventListeners();
    if (window.lucide) lucide.createIcons();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkDependenciesAndInit);
} else {
    // Give Next.js a tiny delay to ensure DOM is attached
    setTimeout(checkDependenciesAndInit, 100);
}

function checkDependenciesAndInit() {
    if (
        typeof THREE === 'undefined' ||
        typeof THREE.OrbitControls === 'undefined' ||
        typeof THREE.GLTFLoader === 'undefined' ||
        typeof gsap === 'undefined' ||
        typeof ScrollTrigger === 'undefined'
    ) {
        setTimeout(checkDependenciesAndInit, 100);
    } else {
        initApp();
    }
}

window.init3DScrollAnimations = setupResponsiveScrollTimeline;

function initSmoothScroll() {
    try {
        lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothTouch: false,
            touchMultiplier: 1.5
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    } catch (err) {
        console.warn('Smooth scroll initialization fallback enabled');
    }
}

function initThree() {
    const canvas = document.getElementById('hoodieCanvas');
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.065);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    updateCameraForViewport();

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enabled = false;
    controls.enableZoom = true;
    controls.maxDistance = 6.5;
    controls.minDistance = 2.0;

    // Cinematic Studio Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff6f0, 1.4);
    keyLight.position.set(4, 6, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const burgundyRim = new THREE.DirectionalLight(0xa81338, 3.2);
    burgundyRim.position.set(-5, 3.5, -4);
    scene.add(burgundyRim);

    const fillLight = new THREE.PointLight(0xe0b0b8, 0.65);
    fillLight.position.set(0, -2, 3);
    scene.add(fillLight);

    // Ground Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowMat = new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(shadowCanvas),
        transparent: true,
        opacity: 0.85
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.15;
    scene.add(shadowMesh);

    window.addEventListener('resize', onWindowResize);

    function animate(time) {
        requestAnimationFrame(animate);
        if (appState.currentPage === 'home') {
            if (controls.enabled) controls.update();
            if (!appState.isStudioActive && hoodieGroup) {
                hoodieGroup.position.y += Math.sin(time * 0.0016) * 0.0005;
            }
            updateCalloutOverlay();
            renderer.render(scene, camera);
        }
    }
    animate(0);
}

function updateCameraForViewport() {
    const aspect = window.innerWidth / window.innerHeight;
    if (aspect < 0.6) {
        camera.position.set(0, 0.2, 5.8);
    } else if (aspect < 1.0) {
        camera.position.set(0, 0.1, 4.8);
    } else {
        camera.position.set(0, 0, 4.1);
    }
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
}

function generateProceduralTextures() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);

    for (let x = 0; x < 256; x += 3) {
        for (let y = 0; y < 256; y += 3) {
            const noise = Math.floor(Math.random() * 45);
            ctx.fillStyle = `rgb(${128 + noise}, ${128 + noise}, ${128 + noise})`;
            ctx.fillRect(x, y, 2, 2);
        }
    }

    bumpTexture = new THREE.CanvasTexture(canvas);
    bumpTexture.wrapS = THREE.RepeatWrapping;
    bumpTexture.wrapT = THREE.RepeatWrapping;
    bumpTexture.repeat.set(10, 10);
}

function buildSculptedRealisticHoodie() {
    hoodieGroup = new THREE.Group();

    if (!window.THREE.GLTFLoader) {
        console.error("GLTFLoader not loaded!");
        return;
    }
    const loader = new THREE.GLTFLoader();
    const modelUrl = window.AETHER_MOCKUP_URL || '/t_shirt_hoodie_3d_model.glb';
    loader.load(modelUrl, function (gltf) {
        const model = gltf.scene;

        // Auto-center and auto-scale the model based on its bounding box
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Calculate the max dimension to normalize the scale
        const maxDim = Math.max(size.x, size.y, size.z);

        // We want the hoodie to be roughly 1.6 units tall/wide in world space to match the previous camera setup
        const targetSize = 2.2;
        const scale = targetSize / maxDim;
        model.scale.set(scale, scale, scale);

        // Recompute box after scaling to find the new center
        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

        // Center the model perfectly at (0, -0.2, 0)
        model.position.x = -scaledCenter.x;
        model.position.y = -scaledCenter.y - 0.2;
        model.position.z = -scaledCenter.z;

        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                if (child.material) {
                    child.material = child.material.clone();
                    child.material.color = new THREE.Color(appState.currentColor);

                    if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
                        child.material.roughness = 0.85;
                        child.material.metalness = 0.02;
                        if (bumpTexture && !child.material.bumpMap) {
                            child.material.bumpMap = bumpTexture;
                            child.material.bumpScale = 0.005;
                        }
                    }
                }
            }
        });

        hoodieGroup.add(model);

        setTimeout(() => {
            if (typeof applyDecalsToHoodie === 'function') {
                applyDecalsToHoodie();
            } else if (decalMeshFront && hoodieGroup) {
                decalMeshFront.position.set(0, 3.0, 1.5);
                hoodieGroup.add(decalMeshFront);
            }
        }, 200);

    }, undefined, function (error) {
        console.error('Error loading hoodie GLB:', error);
    });

    scene.add(hoodieGroup);
}

function setupGraphicTextures() {
    return; // Disabled by user request
    // Front Brand Emblem
    const canvasF = document.createElement('canvas');
    canvasF.width = 512;
    canvasF.height = 512;
    const ctxF = canvasF.getContext('2d');
    ctxF.clearRect(0, 0, 512, 512);

    ctxF.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctxF.shadowBlur = 8;
    ctxF.shadowOffsetY = 4;

    ctxF.fillStyle = '#f8f8f8';
    ctxF.font = 'bold 54px Cinzel';
    ctxF.textAlign = 'center';
    ctxF.fillText('ÆTHER', 256, 235);

    ctxF.fillStyle = '#a81338';
    ctxF.font = 'bold 19px JetBrains Mono';
    ctxF.fillText('HEAVYWEIGHT 450GSM', 256, 275);

    decalTextureFront = new THREE.CanvasTexture(canvasF);
    decalTextureFront.generateMipmaps = true;

    decalMeshFront = new THREE.Mesh(
        new THREE.PlaneGeometry(0.56, 0.56),
        new THREE.MeshStandardMaterial({
            map: decalTextureFront,
            transparent: true,
            opacity: 0.95,
            roughness: 0.4,
            polygonOffset: true,
            polygonOffsetFactor: -4
        })
    );
    decalMeshFront.position.set(0, 0.22, 0.72);
    // hoodieGroup.add(decalMeshFront);

    // Back Decal Graphic
    const canvasB = document.createElement('canvas');
    canvasB.width = 512;
    canvasB.height = 512;
    const ctxB = canvasB.getContext('2d');
    ctxB.clearRect(0, 0, 512, 512);

    ctxB.strokeStyle = '#a81338';
    ctxB.lineWidth = 8;
    ctxB.strokeRect(70, 70, 372, 372);

    ctxB.fillStyle = '#ffffff';
    ctxB.font = '900 60px Cinzel';
    ctxB.textAlign = 'center';
    ctxB.fillText('AETHER', 256, 230);

    ctxB.fillStyle = '#a81338';
    ctxB.font = 'bold 18px JetBrains Mono';
    ctxB.fillText('PARIS // TOKYO // NY', 256, 288);

    decalTextureBack = new THREE.CanvasTexture(canvasB);
    decalTextureBack.generateMipmaps = true;

    decalMeshBack = new THREE.Mesh(
        new THREE.PlaneGeometry(0.65, 0.65),
        new THREE.MeshStandardMaterial({
            map: decalTextureBack,
            transparent: true,
            roughness: 0.4,
            polygonOffset: true,
            polygonOffsetFactor: -4
        })
    );
    decalMeshBack.position.set(0, 0.2, -0.72);
    decalMeshBack.rotation.y = Math.PI;
    // hoodieGroup.add(decalMeshBack);
}

function setupResponsiveScrollTimeline() {
    if (!hoodieGroup) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.getAll().forEach(t => t.kill());

    gsap.to('#scrollProgress', {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true
        }
    });

    const isMobile = window.innerWidth < 768;
    const targetX = isMobile ? 0 : 1.05;
    const targetYMobile = 0.35;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#view-home',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.1
        }
    });

    // Section 1 -> 2: Fabric & Hood close-up (Drone dives at the chest)
    tl.to(hoodieGroup.position, {
        x: isMobile ? 0 : 1.05,
        y: isMobile ? targetYMobile : -0.15,
        z: isMobile ? 0.6 : 1.15,
        duration: 2,
        ease: "power2.inOut"
    })
    .to(hoodieGroup.rotation, { x: -0.2, y: 0.15, z: 0.05, duration: 2, ease: "power2.inOut" }, '<')

    // Section 2 -> 3: 180 spin to show back artwork (Drone swoops OVER the shoulder)
    .to(hoodieGroup.position, {
        x: isMobile ? 0 : -1.05,
        y: isMobile ? targetYMobile : -0.1,
        z: isMobile ? 0.5 : 0.95,
        duration: 2.5,
        ease: "power2.inOut"
    })
    .to(hoodieGroup.rotation, { x: 0.1, y: Math.PI + 0.3, z: -0.1, duration: 2.5, ease: "power2.inOut" }, '<')

    // Section 3 -> 4: Zoom to cuffs & rib stitching (Drone dives to the floor cuffs)
    .to(hoodieGroup.position, {
        x: isMobile ? 0 : 0.4,
        y: isMobile ? targetYMobile : 0.35,
        z: isMobile ? 1.4 : 2.2,
        duration: 2,
        ease: "power2.inOut"
    })
    .to(hoodieGroup.rotation, { x: -0.3, y: Math.PI * 1.8, z: 0.1, duration: 2, ease: "power2.inOut" }, '<')

    // Section 4 -> 5: Position hoodie perfectly centered in the Studio section
    .to(hoodieGroup.position, { x: 0, y: isMobile ? 0.2 : 0, z: 0, duration: 2, ease: "power3.inOut" })
    .to(hoodieGroup.rotation, { x: 0, y: Math.PI * 2, z: 0, duration: 2, ease: "power3.inOut" }, '<');

    // Scroll canvas up perfectly with the footer
    gsap.to('#webgl-container', {
        y: () => {
            const footer = document.querySelector('footer');
            return footer ? -footer.offsetHeight : -500;
        },
        scrollTrigger: {
            trigger: 'footer',
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true
        }
    });

    ['hero', 'fabric', 'graphics', 'details', 'studio'].forEach(sec => {
        ScrollTrigger.create({
            trigger: `#${sec}`,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => setSectionActive(sec),
            onEnterBack: () => setSectionActive(sec)
        });
    });

    // 3D Interactive Preview Mode
    window.addEventListener('toggle-preview-mode', (e) => {
        if (!hoodieGroup) return;
        const active = e.detail.active;
        const isMobile = window.innerWidth < 768;
        
        if (active) {
            // Lock scrolling and enable 3D OrbitControls
            if (typeof lenis !== 'undefined') lenis.stop();
            if (controls) controls.enabled = true;
            
            // Fade out UI for maximum immersion
            gsap.to(['header', '.nav-dots', '.story-indicator'], { opacity: 0, duration: 0.5, pointerEvents: 'none' });
            
            // Move hoodie to dead center for optimal inspection
            gsap.to(hoodieGroup.position, { x: 0, y: 0, z: 0, duration: 1.0, ease: "power2.inOut", overwrite: "auto" });
            // Ensure hoodie is not secretly rotated (since OrbitControls rotates camera)
            gsap.to(hoodieGroup.rotation, { x: 0, y: Math.PI * 2, z: 0, duration: 1.0, ease: "power2.inOut", overwrite: "auto" });
        } else {
            // Unlock scrolling and disable 3D OrbitControls
            if (typeof lenis !== 'undefined') lenis.start();
            if (controls) {
                controls.enabled = false;
                // We deliberately DO NOT reset the camera or target here, so the mockup "rests" 
                // exactly at the angle and zoom the user stopped at!
            }
            
            // Restore UI
            gsap.to(['header', '.nav-dots', '.story-indicator'], { opacity: 1, duration: 0.5, pointerEvents: 'auto' });
            
            // Return hoodie to the correct vertical offset for the studio layout, 
            // but preserve all camera angles and rotation!
            gsap.to(hoodieGroup.position, { x: 0, y: isMobile ? 0.2 : 0, z: 0, duration: 1.0, ease: "power2.inOut", overwrite: "auto" });
        }
    });
}

function setSectionActive(sec) {
    appState.activeSection = sec;
    const container = document.getElementById('webgl-container');
    if (sec === 'studio') {
        appState.isStudioActive = true;
        container.classList.add('interactive');
        // controls.enabled is intentionally false until Preview Mode is activated
    } else {
        appState.isStudioActive = false;
        container.classList.remove('interactive');
        if (controls) controls.enabled = false;
        
        // Fix camera reset bug when scrolling away from studio
        if (typeof updateCameraForViewport === 'function') {
            updateCameraForViewport();
        }
        if (controls) {
            controls.target.set(0, 0, 0);
            controls.update();
        }
    }
}

function updateCalloutOverlay() {
    const line = document.getElementById('calloutLine');
    const pin = document.getElementById('hotspotPin');

    if (appState.currentPage !== 'home' || ['hero', 'studio'].includes(appState.activeSection) || window.innerWidth < 768) {
        line.setAttribute('opacity', '0');
        pin.classList.add('opacity-0');
        return;
    }

    let cardEl, target3DPoint;
    if (appState.activeSection === 'fabric') {
        cardEl = document.getElementById('card-fabric');
        target3DPoint = target3DPoints.fabric;
    } else if (appState.activeSection === 'graphics') {
        cardEl = document.getElementById('card-graphics');
        target3DPoint = target3DPoints.graphics;
    } else if (appState.activeSection === 'details') {
        cardEl = document.getElementById('card-details');
        target3DPoint = target3DPoints.details;
    }

    if (!cardEl || !target3DPoint) return;

    const worldPos = target3DPoint.clone().applyMatrix4(hoodieGroup.matrixWorld);
    const projected = worldPos.clone().project(camera);

    const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(projected.y * 0.5) + 0.5) * window.innerHeight;

    pin.style.left = `${x}px`;
    pin.style.top = `${y}px`;
    pin.classList.remove('opacity-0');

    const rect = cardEl.getBoundingClientRect();
    let cardX = rect.left + rect.width / 2;
    let cardY = rect.top + rect.height / 2;

    if (x < rect.left) cardX = rect.left;
    else if (x > rect.right) cardX = rect.right;

    line.setAttribute('x1', cardX);
    line.setAttribute('y1', cardY);
    line.setAttribute('x2', x);
    line.setAttribute('y2', y);
    line.setAttribute('opacity', '1');
}

/* Cinematic Page Transition Handler */
function navigateTo(pageId) {
    if (isTransitioning) return;
    if (appState.currentPage === pageId && document.getElementById(`view-${pageId}`).classList.contains('active')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    isTransitioning = true;
    const veil = document.getElementById('pageTransitionVeil');
    const veilContent = document.getElementById('veilContent');
    const veilLabel = document.getElementById('veilPageLabel');
    const webglContainer = document.getElementById('webgl-container');
    const calloutOverlay = document.getElementById('callout-overlay');
    const hotspotPin = document.getElementById('hotspotPin');

    if (veilLabel && pageLabels[pageId]) {
        veilLabel.innerText = pageLabels[pageId];
    }

    const currentView = document.getElementById(`view-${appState.currentPage}`);
    const nextView = document.getElementById(`view-${pageId}`);

    const tl = gsap.timeline({
        onComplete: () => {
            isTransitioning = false;
        }
    });

    // 1. Shutter In & Fade Out Old View
    tl.set(veil, { visibility: 'visible', pointerEvents: 'auto' })
        .to(veil, { opacity: 1, duration: 0.24, ease: 'power2.inOut' })
        .to(veilContent, { opacity: 1, scale: 1, duration: 0.24, ease: 'back.out(1.4)' }, '-=0.15');

    if (currentView) {
        tl.to(currentView, { opacity: 0, y: -14, duration: 0.2, ease: 'power2.in' }, '-=0.25');
    }

    if (appState.currentPage === 'home' && pageId !== 'home') {
        tl.to(webglContainer, { opacity: 0, duration: 0.2 }, '-=0.2');
    }

    // 2. Perform DOM & Route State Swap in midpoint
    tl.add(() => {
        appState.currentPage = pageId;

        document.querySelectorAll('.spa-view').forEach(view => {
            view.classList.remove('active');
            view.style.opacity = '0';
            view.style.transform = 'translateY(16px)';
        });

        if (nextView) {
            nextView.classList.add('active');
        }

        if (pageId === 'home') {
            webglContainer.style.display = 'block';
            webglContainer.style.opacity = '1';
            calloutOverlay.style.display = 'block';
            setTimeout(() => ScrollTrigger.refresh(), 100);
        } else {
            webglContainer.style.display = 'none';
            calloutOverlay.style.display = 'none';
            hotspotPin.classList.add('opacity-0');
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.dataset.page === pageId) {
                link.classList.add('text-burgundy-bright', 'font-bold');
                link.classList.remove('text-gray-400');
            } else {
                link.classList.remove('text-burgundy-bright', 'font-bold');
                link.classList.add('text-gray-400');
            }
        });

        if (pageId === 'checkout') renderCheckoutLedger();

        window.scrollTo(0, 0);
        lucide.createIcons();
    });

    // 3. Shutter Out & Animate New View Entrance
    tl.to(veilContent, { opacity: 0, scale: 0.92, duration: 0.2, ease: 'power2.in', delay: 0.08 })
        .to(veil, { opacity: 0, duration: 0.28, ease: 'power2.out' }, '-=0.08')
        .set(veil, { visibility: 'hidden', pointerEvents: 'none' });

    if (nextView) {
        tl.to(nextView, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power3.out'
        }, '-=0.2');
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('translate-x-full');
}

function renderShopCatalog(items) {
    return;
    const grid = document.getElementById('productGrid');
    const badge = document.getElementById('productCountBadge');
    if (badge) badge.innerText = items.length;

    if (items.length === 0) {
        grid.innerHTML = `
                    <div class="col-span-full py-12 text-center text-gray-500 font-mono text-xs">
                        No archive garments match your criteria.
                    </div>
                `;
        return;
    }

    grid.innerHTML = items.map(p => `
                <div class="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-white/10 flex flex-col justify-between group">
                    <div>
                        <div class="relative aspect-square w-full rounded-xl sm:rounded-2xl bg-black/60 border border-white/10 overflow-hidden mb-3.5 flex items-center justify-center">
                            <span class="text-4xl sm:text-5xl font-display font-black text-burgundy-bright/40 group-hover:scale-110 group-hover:text-burgundy-bright transition-all duration-300">Æ</span>
                            <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono bg-black/70 border border-white/10 text-white font-semibold">${p.badge}</span>
                            <button onclick="openQuickView('${p.id}')" class="absolute bottom-2.5 right-2.5 glass-btn px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                QUICK VIEW
                            </button>
                        </div>
                        <div class="flex items-center space-x-1.5 mb-1">
                            <div class="w-2.5 h-2.5 rounded-full border border-white/20" style="background-color: ${p.hex}"></div>
                            <span class="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase">${p.colorName}</span>
                        </div>
                        <h3 class="font-bold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-burgundy-bright transition-colors">${p.name}</h3>
                        <p class="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">${p.desc}</p>
                    </div>
                    <div class="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                        <span class="font-mono font-bold text-sm sm:text-base text-white">$${p.price.toFixed(2)}</span>
                        <button onclick="addProductToCart('${p.id}')" class="glass-btn p-2 rounded-xl text-white hover:bg-burgundy-bright hover:border-burgundy-bright transition-all">
                            <i data-lucide="shopping-bag" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
                        </button>
                    </div>
                </div>
            `).join('');
    lucide.createIcons();
}

function filterCategory(cat, ev) {
    document.querySelectorAll('.cat-pill').forEach(btn => {
        btn.classList.remove('bg-burgundy-bright', 'text-white', 'font-semibold');
        btn.classList.add('glass-btn', 'text-gray-300');
    });
    const targetBtn = (ev && ev.currentTarget) ? ev.currentTarget : (window.event ? window.event.currentTarget : null);
    if (targetBtn) {
        targetBtn.classList.add('bg-burgundy-bright', 'text-white', 'font-semibold');
        targetBtn.classList.remove('glass-btn', 'text-gray-300');
    }

    if (cat === 'all') {
        renderShopCatalog(appState.products);
    } else {
        const filtered = appState.products.filter(p => p.category === cat);
        renderShopCatalog(filtered);
    }
}

function onSearchProducts(val) {
    const query = val.toLowerCase().trim();
    const filtered = appState.products.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));
    renderShopCatalog(filtered);
}

function onSortProducts(val) {
    let sorted = [...appState.products];
    if (val === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (val === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    renderShopCatalog(sorted);
}

function openQuickView(id) {
    const p = appState.products.find(item => item.id === id);
    if (!p) return;
    document.getElementById('quickViewTitle').innerText = p.name;
    document.getElementById('quickViewPrice').innerText = `$${p.price.toFixed(2)}`;
    document.getElementById('quickViewDesc').innerText = p.desc;
    document.getElementById('quickViewTag').innerText = p.badge;
    document.getElementById('quickViewAddBtn').onclick = () => {
        addProductToCart(p.id);
        closeQuickView();
    };

    const modal = document.getElementById('quickViewModal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    modal.classList.add('opacity-0', 'pointer-events-none');
}

function addProductToCart(productId) {
    const p = appState.products.find(i => i.id === productId);
    if (!p) return;

    const existing = appState.cart.find(item => item.id === productId);
    if (existing) {
        existing.qty++;
    } else {
        appState.cart.push({
            id: p.id,
            name: p.name,
            color: p.hex,
            size: 'L',
            price: p.price,
            qty: 1
        });
    }

    renderCart();
    showToast(`${p.name} added to cart`);
}

function addCustomHoodieToCart() {
    appState.cart.push({
        id: 'custom-hoodie-' + Date.now(),
        name: 'Custom 450GSM Heavyweight Hoodie',
        color: appState.currentColor,
        size: appState.currentSize,
        price: 145.00,
        qty: 1
    });
    renderCart();
    openCartDrawer();
    showToast('Configured 3D Hoodie added to bag');
}

function renderCart() {
    return;
    const container = document.getElementById('cartItemsContainer');
    const totalCountBadge = document.getElementById('headerCartCount');

    const totalItems = appState.cart.reduce((sum, item) => sum + item.qty, 0);
    totalCountBadge.innerText = totalItems;

    if (appState.cart.length === 0) {
        container.innerHTML = `
                    <div class="py-8 text-center text-gray-500 font-mono text-xs">
                        Your bag is empty.
                    </div>
                `;
        document.getElementById('cartDrawerSubtotal').innerText = '$0.00';
        return;
    }

    let subtotal = 0;
    container.innerHTML = appState.cart.map((item, idx) => {
        subtotal += item.price * item.qty;
        return `
                    <div class="glass-card p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-2.5">
                        <div class="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center font-display font-bold text-white text-xs" style="background-color: ${item.color}">Æ</div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-xs font-bold text-white truncate">${item.name}</h4>
                            <div class="text-[10px] font-mono text-gray-400">Size: ${item.size} • $${item.price.toFixed(2)}</div>
                        </div>
                        <div class="flex items-center space-x-1.5">
                            <button onclick="updateCartQty(${idx}, -1)" class="w-5 h-5 rounded glass-btn flex items-center justify-center text-[10px] text-white">-</button>
                            <span class="text-xs font-mono font-bold text-white px-1">${item.qty}</span>
                            <button onclick="updateCartQty(${idx}, 1)" class="w-5 h-5 rounded glass-btn flex items-center justify-center text-[10px] text-white">+</button>
                        </div>
                    </div>
                `;
    }).join('');

    document.getElementById('cartDrawerSubtotal').innerText = `$${subtotal.toFixed(2)}`;
    lucide.createIcons();
}

function updateCartQty(index, delta) {
    appState.cart[index].qty += delta;
    if (appState.cart[index].qty <= 0) {
        appState.cart.splice(index, 1);
    }
    renderCart();
    renderCheckoutLedger();
}

function openCartDrawer() {
    document.getElementById('cartDrawerBackdrop').classList.remove('opacity-0', 'pointer-events-none');
    document.getElementById('cartDrawer').classList.remove('translate-x-full');
}

function closeCartDrawer() {
    document.getElementById('cartDrawerBackdrop').classList.add('opacity-0', 'pointer-events-none');
    document.getElementById('cartDrawer').classList.add('translate-x-full');
}

function renderCheckoutLedger() {
    const list = document.getElementById('checkoutItemsList');
    if (!list) return;

    let subtotal = 0;
    list.innerHTML = appState.cart.map(item => {
        subtotal += item.price * item.qty;
        return `
                    <div class="flex items-center justify-between text-xs font-mono">
                        <div class="flex items-center space-x-2">
                            <span class="text-burgundy-bright font-bold">${item.qty}x</span>
                            <span class="text-white truncate max-w-[170px]">${item.name}</span>
                        </div>
                        <span class="text-gray-300">$${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                `;
    }).join('');

    const discount = appState.discountApplied ? subtotal * appState.discountRate : 0;
    const finalTotal = subtotal - discount;

    document.getElementById('checkoutSubtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkoutTotal').innerText = `$${finalTotal.toFixed(2)}`;

    if (appState.discountApplied) {
        document.getElementById('discountRow').classList.remove('hidden');
        document.getElementById('checkoutDiscount').innerText = `-$${discount.toFixed(2)}`;
    } else {
        document.getElementById('discountRow').classList.add('hidden');
    }
}

function applyPromoCode() {
    const code = document.getElementById('promoCodeInput').value.trim().toUpperCase();
    if (code === 'AETHER10') {
        appState.discountApplied = true;
        renderCheckoutLedger();
        showToast('Promo applied: 10% Member Discount');
    } else {
        showToast('Invalid code. Try AETHER10');
    }
}

function processOrderCheckout() {
    if (appState.cart.length === 0) {
        showToast('Your bag is empty.');
        return;
    }

    const btn = document.getElementById('confirmOrderBtn');
    const defaultContent = document.getElementById('btnContentDefault');
    const loadingContent = document.getElementById('btnContentLoading');
    const successContent = document.getElementById('btnContentSuccess');

    btn.disabled = true;
    defaultContent.classList.add('hidden');
    loadingContent.classList.remove('hidden');
    loadingContent.classList.add('flex');

    setTimeout(() => {
        loadingContent.classList.remove('flex');
        loadingContent.classList.add('hidden');
        successContent.classList.remove('hidden');
        successContent.classList.add('flex');
        btn.classList.remove('from-burgundy-accent', 'to-burgundy-bright');
        btn.classList.add('from-emerald-700', 'to-green-600');

        setTimeout(() => {
            const trackingNum = `#AE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
            document.getElementById('successOrderRef').innerText = `TRACKING ID: ${trackingNum}`;
            const modal = document.getElementById('orderSuccessModal');
            modal.classList.remove('opacity-0', 'pointer-events-none');
            appState.cart = [];
            renderCart();

            btn.disabled = false;
            btn.classList.add('from-burgundy-accent', 'to-burgundy-bright');
            btn.classList.remove('from-emerald-700', 'to-green-600');
            successContent.classList.remove('flex');
            successContent.classList.add('hidden');
            defaultContent.classList.remove('hidden');
        }, 900);
    }, 1200);
}

function closeOrderSuccessModal() {
    const modal = document.getElementById('orderSuccessModal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    navigateTo('profile');
}

/* ==================== AI ASSISTANT CONCIERGE LOGIC ==================== */
function toggleAiAssistant() {
    const drawer = document.getElementById('aiDrawer');
    const backdrop = document.getElementById('aiDrawerBackdrop');
    if (!drawer || !backdrop) return;

    aiState.isOpen = !aiState.isOpen;
    if (aiState.isOpen) {
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        drawer.classList.remove('translate-x-full');
        setTimeout(() => {
            const input = document.getElementById('aiChatInput');
            if (input) input.focus();
        }, 300);
    } else {
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        drawer.classList.add('translate-x-full');
    }
}

function clearAiChat() {
    aiState.messages = [
        {
            role: 'assistant',
            text: 'Conversation reset. How can I assist with your 450GSM sizing, pairing recommendations, or garment specifications?'
        }
    ];
    aiState.chatHistory = [];
    renderAiChatMessages();
    showToast('Concierge chat reset.');
}

function renderAiChatMessages() {
    return;
    const feed = document.getElementById('aiChatFeed');
    if (!feed) return;

    feed.innerHTML = aiState.messages.map(msg => {
        const isUser = msg.role === 'user';
        return `
                    <div class="flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}">
                        <div class="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center font-display font-bold text-xs ${isUser ? 'bg-burgundy-bright text-white' : 'bg-black border border-burgundy-bright/40 text-burgundy-bright'}">
                            ${isUser ? 'YOU' : 'Æ'}
                        </div>
                        <div class="max-w-[85%] rounded-2xl p-3 sm:p-3.5 text-xs font-mono leading-relaxed ${isUser ? 'bg-burgundy-900/60 border border-burgundy-bright/40 text-white rounded-tr-none' : 'glass-panel border border-white/10 text-gray-200 rounded-tl-none'}">
                            ${formatAiMessageText(msg.text)}
                        </div>
                    </div>
                `;
    }).join('');

    feed.scrollTop = feed.scrollHeight;
    lucide.createIcons();
}

function formatAiMessageText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-burgundy-200">$1</em>')
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/\n- /g, '<br/>• ')
        .replace(/\n/g, '<br/>');
}

function sendQuickPrompt(promptText) {
    const input = document.getElementById('aiChatInput');
    if (input) input.value = promptText;
    submitAiUserMessage(promptText);
}

function handleAiFormSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('aiChatInput');
    const text = input ? input.value.trim() : '';
    if (!text || aiState.isLoading) return;
    input.value = '';
    submitAiUserMessage(text);
}

async function submitAiUserMessage(userQuery) {
    aiState.messages.push({ role: 'user', text: userQuery });
    aiState.chatHistory.push({ role: 'user', parts: [{ text: userQuery }] });
    renderAiChatMessages();

    const typingEl = document.getElementById('aiTypingIndicator');
    const sendBtn = document.getElementById('aiSendBtn');
    if (typingEl) typingEl.classList.remove('hidden');
    if (sendBtn) sendBtn.disabled = true;
    aiState.isLoading = true;

    const systemPrompt = `You are the lead styling director and textile architect at AETHER, a high-fashion architectural streetwear atelier based in Brooklyn, NY.
AETHER specializes in heavyweight 450GSM combed organic French terry cotton knitwear dyed in signature Burgundy, Obsidian Black, Bone Off-White, and Forest Green.
Key brand details:
- Fabric: 450GSM 100% French terry organic cotton, zero synthetic blends, structured double-layer cowl hood, 550GSM 2x2 ribbed cuffs with 5% elastane memory, gunmetal oxidized aglets.
- Fit: Boxy dropped-shoulder architectural silhouette. If customers ask for sizing: S (< 172cm / < 65kg), M (172-178cm / 65-75kg), L (178-185cm / 75-85kg), XL (> 185cm / > 85kg). Recommend TTS for boxy look, size down for traditional fit.
- Styling Pairings: Pair the Burgundy Heavyweight Hoodie with raw black relaxed denim, wide-leg heavy cargo trousers, distressed stone chinos, or minimalist chunky derbies/sneakers.
- Care: Cold wash (< 30°C) inside out, mild detergent, lay flat to dry to preserve heavy weave and avoid stretching. Never tumble dry.
Guidelines for replies:
- Be concise, refined, confident, and sophisticated.
- Use clear bullet points for sizes and styling tips.
- Keep responses under 130 words unless detailed specifications are requested.`;

    let botReply = '';
    try {
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

        const payload = {
            contents: aiState.chatHistory,
            systemInstruction: { parts: [{ text: systemPrompt }] }
        };

        let response;
        let attempts = 0;
        const maxAttempts = 3;
        let delay = 1000;

        while (attempts < maxAttempts) {
            try {
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) break;
            } catch (err) {
                // Retry with exponential backoff
            }
            attempts++;
            await new Promise(r => setTimeout(r, delay));
            delay *= 2;
        }

        if (response && response.ok) {
            const result = await response.json();
            const candidate = result.candidates?.[0];
            if (candidate && candidate.content?.parts?.[0]?.text) {
                botReply = candidate.content.parts[0].text;
            }
        }
    } catch (error) {
        console.warn('Gemini API fetch error, applying atelier concierge fallback:', error);
    }

    // Fallback intelligence if offline or credentials restricted
    if (!botReply) {
        botReply = generateOfflineAtelierResponse(userQuery);
    }

    aiState.messages.push({ role: 'assistant', text: botReply });
    aiState.chatHistory.push({ role: 'model', parts: [{ text: botReply }] });
    renderAiChatMessages();

    if (typingEl) typingEl.classList.add('hidden');
    if (sendBtn) sendBtn.disabled = false;
    aiState.isLoading = false;
}

function generateOfflineAtelierResponse(query) {
    const q = query.toLowerCase();
    if (q.includes('size') || q.includes('fit') || q.includes('height') || q.includes('weight')) {
        return `**Atelier Fit Sizing Guidance:**\n- **Size Small:** Under 172cm (5'8") • Under 65kg\n- **Size Medium:** 172cm – 178cm (5'8" – 5'10") • 65 – 75kg\n- **Size Large:** 178cm – 185cm (5'10" – 6'1") • 75 – 85kg\n- **Size XL:** Over 185cm (6'1"+) • 85kg+\n\nOur 450GSM silhouette features an **engineered dropped shoulder** with a slightly cropped boxy waistband. We recommend selecting your true size for the intended runway drape.`;
    } else if (q.includes('style') || q.includes('pair') || q.includes('wear with') || q.includes('outfit')) {
        return `**Curated Styling Recommendation for Burgundy 450GSM:**\n• **Bottoms:** Obsidian black wide-leg pleated cargos or raw indigo selvedge denim.\n• **Outerwear:** Layer under a washed charcoal cropped bomber or oversized wool overcoat.\n• **Footwear:** Minimalist chunky leather boots or bone/off-white low profile sneakers.\n• **Accent:** Pair with our Cybernetic Monogram Beanie to contrast the deep rich burgundy tone.`;
    } else if (q.includes('wash') || q.includes('care') || q.includes('shrink') || q.includes('clean')) {
        return `**450GSM French Terry Garment Care:**\n• **Cycle:** Cold wash at 30°C inside out with mild liquid detergent.\n• **Drying:** Strictly lay flat on a drying rack. Never hang wet (prevents shoulder stretch) and never tumble dry.\n• **Silicone Emblem:** Iron inside out on low heat with parchment paper protection.\n\nOur terry is pre-shrunk, ensuring dimensional stability through dozens of washes.`;
    } else {
        return `Our **450GSM French Terry** represents architectural knitwear at its peak: zero synthetic fillers, high-density looped back construction, solid gunmetal drawcord aglets, and a double-layer structured cowl hood. You can configure colorways in our 3D Studio or add pieces directly to your Atelier bag.`;
    }
}

function toggleAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.toggle('opacity-0');
    modal.classList.toggle('pointer-events-none');
}

function switchAuthTab(type) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLogin = document.getElementById('authTabLogin');
    const tabRegister = document.getElementById('authTabRegister');

    if (type === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabLogin.classList.add('border-b-2', 'border-burgundy-bright', 'text-white');
        tabLogin.classList.remove('text-gray-400');
        tabRegister.classList.remove('border-b-2', 'border-burgundy-bright', 'text-white');
        tabRegister.classList.add('text-gray-400');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabRegister.classList.add('border-b-2', 'border-burgundy-bright', 'text-white');
        tabRegister.classList.remove('text-gray-400');
        tabLogin.classList.remove('border-b-2', 'border-burgundy-bright', 'text-white');
        tabLogin.classList.add('text-gray-400');
    }
}

function handleAuthSubmit(e, mode) {
    e.preventDefault();
    if (mode === 'register') {
        const name = document.getElementById('regName').value || 'Elena Rostova';
        const email = document.getElementById('regEmail').value || 'elena@atelier.com';
        document.getElementById('profileUserName').innerText = name.toUpperCase();
        document.getElementById('profileUserEmail').innerText = email;
    }
    toggleAuthModal();
    showToast('Authenticated successfully.');
    navigateTo('profile');
}

function setupEventListeners() {
    // Color Swatches
    document.querySelectorAll('.color-swatch').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('active-swatch'));
            const target = e.currentTarget;
            target.classList.add('active-swatch');
            appState.currentColor = target.dataset.color;

            const labelEl = document.getElementById('activeColorLabel');
            if (labelEl && target.dataset.label) {
                labelEl.innerText = target.dataset.label;
            }

            hoodieGroup.traverse((child) => {
                if (child.isMesh && child.material && child !== decalMeshFront && child !== decalMeshBack) {
                    child.material.color.set(appState.currentColor);
                }
            });
        });
    });

    window.addEventListener('atelier-color-change', (e) => {
        appState.currentColor = e.detail.hex;
        if (typeof hoodieGroup !== 'undefined' && hoodieGroup) {
            hoodieGroup.traverse((child) => {
                if (child.isMesh && child.material && child !== decalMeshFront && child !== decalMeshBack) {
                    child.material.color.set(appState.currentColor);
                }
            });
        }
    });

    // Size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.size-btn').forEach(b => {
                b.classList.remove('border-burgundy-bright', 'text-burgundy-bright', 'font-bold');
                b.classList.add('text-gray-400');
            });
            e.currentTarget.classList.add('border-burgundy-bright', 'text-burgundy-bright', 'font-bold');
            e.currentTarget.classList.remove('text-gray-400');
            appState.currentSize = e.currentTarget.dataset.size;
        });
    });

    // Reset 3D angle
    const resetBtn = document.getElementById('resetViewBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            gsap.to(hoodieGroup.rotation, { x: 0, y: 0, z: 0, duration: 0.7 });
            gsap.to(hoodieGroup.position, { x: 0, y: window.innerWidth < 768 ? 0.2 : 0, z: 0, duration: 0.7 });
            updateCameraForViewport();
            controls.reset();
        });
    }
}

/* Toast messaging utility */
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;

    if (toastTimeout) clearTimeout(toastTimeout);

    toast.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');

    toastTimeout = setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
    }, 2600);
}

/* Responsive Window Resize Handler */
function onWindowResize() {
    updateCameraForViewport();
    renderer.setSize(window.innerWidth, window.innerHeight);
    ScrollTrigger.refresh();
}

