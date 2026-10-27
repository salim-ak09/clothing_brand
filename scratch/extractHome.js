const fs = require('fs');
const cheerio = require('cheerio');
const htmlContent = fs.readFileSync('d:/work/mid-projects/brand website/modern_3d_hoodie_showcase (3).html', 'utf8');
const $ = cheerio.load(htmlContent);

function toJSX(html) {
    return html
        .replace(/class=/g, 'className=')
        .replace(/onclick="[^"]*"/g, '') // strip old vanilla js onclicks
        .replace(/<!--(.*?)-->/g, '{/* $1 */}');
}

const homeHtml = $.html($('#view-home'));
const jsxString = toJSX(homeHtml);

const pageTsx = `import { ArrowDown, Sliders } from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full">
      ${jsxString}
    </div>
  );
}
`;

fs.writeFileSync('d:/work/mid-projects/brand website/aether-monorepo/apps/storefront/app/page.tsx', pageTsx);
console.log("page.tsx updated with Home View JSX!");
