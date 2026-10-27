const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlContent = fs.readFileSync(path.join(__dirname, '../../modern_3d_hoodie_showcase (3).html'), 'utf8');
const $ = cheerio.load(htmlContent);

// 1. Extract Body HTML (excluding script tags)
$('script').remove();
const bodyHtml = $('body').html();

// 2. Generate page.tsx
const pageTsx = `
"use client";

import { useEffect, useRef } from 'react';
import './prototype.css';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run if the external scripts have loaded
    const timer = setInterval(() => {
      // @ts-ignore
      if (window.THREE && window.gsap && window.ScrollTrigger && window.Lenis) {
        clearInterval(timer);
        
        // Execute the prototype logic
        const script = document.createElement('script');
        script.src = '/prototype.js';
        script.async = true;
        document.body.appendChild(script);
        
        return () => {
          document.body.removeChild(script);
        };
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: \`${bodyHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} 
    />
  );
}
`;

fs.writeFileSync(path.join(__dirname, '../apps/storefront/app/page.tsx'), pageTsx);
console.log('Conversion complete!');
