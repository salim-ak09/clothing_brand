const fs = require('fs');

const path = 'apps/storefront/public/prototype.js';
let content = fs.readFileSync(path, 'utf8');

const fetchLogic = `
        async function initApp() {
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
            renderShopCatalog(appState.products);
            renderCart();
            renderAiChatMessages();
            if (window.lucide) lucide.createIcons();
        }
`;

content = content.replace(/function initApp\(\) \{[\s\S]*?if \(window\.lucide\) lucide\.createIcons\(\);\s*\}/, fetchLogic.trim());

const hoodieLogic = `
        function buildSculptedRealisticHoodie() {
            hoodieGroup = new THREE.Group();
            
            if (!window.THREE.GLTFLoader) {
                console.error("GLTFLoader not loaded!");
                return;
            }
            const loader = new THREE.GLTFLoader();
            loader.load('/t_shirt_hoodie_3d_model.glb', function(gltf) {
                const model = gltf.scene;
                
                model.scale.set(12.0, 12.0, 12.0); // Assuming typical model scale needs boosting
                model.position.y = -5.0;
                
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

            }, undefined, function(error) {
                console.error('Error loading hoodie GLB:', error);
            });

            scene.add(hoodieGroup);
        }
`;

content = content.replace(/function buildSculptedRealisticHoodie\(\) \{[\s\S]*?scene\.add\(hoodieGroup\);\s*\}/, hoodieLogic.trim());

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated prototype.js');
