const fs = require("fs");
const path = require("path");

const categories = ['Buttons'];
const basePath = path.join(__dirname, '../galaxy');

const components = [];

for (const category of categories) {
  const dir = path.join(basePath, category);
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    // Only read .html files or .txt if needed
    if (!file.endsWith(".html")) continue;

    try {
      const raw = fs.readFileSync(filePath, 'utf8');

      // Extract <style> content
      const styleMatch = raw.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      const css = styleMatch ? styleMatch[1].trim() : "";

      // Remove <style> block from HTML
      const html = raw.replace(/<style[^>]*>[\s\S]*?<\/style>/i, "").trim();

      components.push({
        id: file.replace('.html', ''),
        name: file.replace('.html', ''),
        category,
        html,
        css,
        tags: [],
        previewImage: null,
      });
    } catch (err) {
      console.warn(`⚠️ Skipped bad file: ${file}`, err.message);
    }
  }
}

const outputPath = path.join(__dirname, 'components.json');
fs.writeFileSync(outputPath, JSON.stringify(components, null, 2));
console.log(`✅ Saved ${components.length} raw HTML components to components.json`);
