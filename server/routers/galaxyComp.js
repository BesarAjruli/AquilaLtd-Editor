const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const css = require("css");

const categories = ['Buttons'];
const basePath = path.join(__dirname, '../galaxy');
const components = [];

const IGNORED_PROPERTIES = new Set([
  'position',
  'top',
  'left',
  'right',
  'bottom',
  'transform',
  'line-height'
]);

function cssToInlineMap(cssString) {
  const ast = css.parse(cssString);
  const styleMap = {};

  if (!ast.stylesheet) return styleMap;

  for (const rule of ast.stylesheet.rules) {
    if (rule.type !== "rule") continue;
    for (const selector of rule.selectors) {
      if (selector.includes(':') || selector.includes('@')) continue;
      const declarations = rule.declarations
        .filter(decl => decl.type === 'declaration' && !IGNORED_PROPERTIES.has(decl.property));
      if (declarations.length === 0) continue;

      styleMap[selector] = {
        ...(styleMap[selector] || {}),
        ...Object.fromEntries(declarations.map(decl => [decl.property, decl.value])),
      };
    }
  }

  return styleMap;
}

function applyInlineStyles(dom, styleMap) {
  const document = dom.window.document;

  for (const selector in styleMap) {
    try {
      if (/[:@]/.test(selector)) continue;
      try {
        document.querySelectorAll(selector);
      } catch (e) {
        console.warn(`⚠️ Skipped invalid selector: "${selector}"`);
        continue;
      }

      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        if (el.textContent.toLowerCase().includes("hover")) continue;

        const styles = styleMap[selector];
        for (const prop in styles) {
          el.style.setProperty(prop, styles[prop]);
        }
      }
    } catch (e) {
      console.warn(`⚠️ Skipped invalid selector: "${selector}" →`, e.message);
    }
  }

  const allElements = document.querySelectorAll('*');
  for (const el of allElements) {
    el.removeAttribute('href');
    el.removeAttribute('src');

    const hasHoverText = el.textContent.toLowerCase().includes("hover");

    if (hasHoverText) {
      el.remove();
    }
  }

  return document.body.innerHTML.trim();
}

for (const category of categories) {
  const dir = path.join(basePath, category);
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    if (!file.endsWith(".html")) continue;

    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const styleMatch = raw.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      const cssRaw = styleMatch ? styleMatch[1].trim() : "";
      const htmlRaw = raw.replace(/<style[^>]*>[\s\S]*?<\/style>/i, "").trim();

      const dom = new JSDOM(htmlRaw);
      const styleMap = cssToInlineMap(cssRaw);
      const htmlWithInlineStyles = applyInlineStyles(dom, styleMap)
        .replace(/\n/g, '')       // remove newlines
        .replace(/\t/g, '')       // remove tabs
        .replace(/\s{2,}/g, ' '); // collapse multiple spaces

      if (!htmlWithInlineStyles || !htmlWithInlineStyles.trim()) {
        console.warn(`⚠️ Empty HTML after processing ${file}`);
        continue;
      }

      components.push({
        id: file.replace('.html', ''),
        category,
        html: htmlWithInlineStyles,
      });
    } catch (err) {
      console.warn(`⚠️ Skipped bad file: ${file}`, err.message);
    }
  }
}

const outputPath = path.join(__dirname, 'components.json');
fs.writeFileSync(outputPath, JSON.stringify(components, null, 2));
console.log(`✅ Saved ${components.length} components`);
