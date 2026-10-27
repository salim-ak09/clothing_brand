const fs = require('fs');
const cheerio = require('cheerio');
const htmlContent = fs.readFileSync('d:/work/mid-projects/brand website/modern_3d_hoodie_showcase (3).html', 'utf8');
const $ = cheerio.load(htmlContent);

function toJSX(html) {
    return html
        .replace(/class=/g, 'className=')
        .replace(/onclick=/g, 'onClick=')
        .replace(/<!--(.*?)-->/g, '{/* $1 */}');
}

fs.writeFileSync('scratch/MobileMenu.txt', toJSX($.html($('#mobileMenu'))));
fs.writeFileSync('scratch/CartDrawer.txt', toJSX($.html($('#cartDrawer')).concat($.html($('#cartDrawerBackdrop')))));
fs.writeFileSync('scratch/AiStylist.txt', toJSX($.html($('#aiDrawer')).concat($.html($('#aiDrawerBackdrop')))));

console.log("Components extracted to scratch/*.txt");
