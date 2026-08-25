const fs = require('fs');
const path = require('path');

const root = __dirname;
const output = path.join(root, '..', 'zloon-github-pages-preview', 'index.html');
const dataUri = file => `data:image/${path.extname(file).slice(1).replace('jpg', 'jpeg')};base64,${fs.readFileSync(path.join(root, file)).toString('base64')}`;

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
let sliderCss = fs.readFileSync(path.join(root, 'slider.css'), 'utf8');
let footerCss = fs.readFileSync(path.join(root, 'footer-details.css'), 'utf8');
let footerLargeCss = fs.readFileSync(path.join(root, 'footer-large.css'), 'utf8');
let productDetailsCss = fs.readFileSync(path.join(root, 'product-details.css'), 'utf8');
let app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
let whatsappConfig = fs.readFileSync(path.join(root, 'whatsapp-config.js'), 'utf8');
let catalog = fs.readFileSync(path.join(root, 'catalog.js'), 'utf8');
let productLink = fs.readFileSync(path.join(root, 'product-link.js'), 'utf8');
let slider = fs.readFileSync(path.join(root, 'slider.js'), 'utf8');
let footer = fs.readFileSync(path.join(root, 'footer.js'), 'utf8');

const womenFiles = fs.readdirSync(path.join(root, 'assets', 'women'));
const images = ['assets/zloon-logo.jpg', ...womenFiles.map(name => `assets/women/${name}`)];
for (const image of images) {
  const escaped = image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const uri = dataUri(image);
  html = html.replace(new RegExp(escaped, 'g'), uri);
  app = app.replace(new RegExp(escaped, 'g'), uri);
  catalog = catalog.replace(new RegExp(escaped, 'g'), uri);
}

const embeddedWomen = womenFiles.map(name => dataUri(`assets/women/${name}`));
catalog = catalog
  .replace(/const localWomen=\[[^;]*\];/, `const localWomen=${JSON.stringify(embeddedWomen)};`)
  .replace('url:`assets/women/${file}`', 'url:file');

html = html
  .replace('<link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="slider.css"><link rel="stylesheet" href="footer-details.css"><link rel="stylesheet" href="footer-large.css">', `<style id="productDetailsCss">${css}\n${sliderCss}\n${footerCss}\n${footerLargeCss}\n${productDetailsCss}</style>`)
  .replace('<script src="app.js"></script><script src="whatsapp-config.js"></script><script src="catalog.js"></script><script src="product-link.js"></script><script src="slider.js"></script><script src="footer.js"></script>', `<script>${app}</script><script>${whatsappConfig}</script><script>${catalog}</script><script>${productLink}</script><script>${slider}</script><script>${footer}</script>`)
  .replaceAll('women.html', '#women')
  .replaceAll('men.html', '#men')
  .replaceAll('policies.html', '#about');

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html);
console.log(output);
