const puppeteer = require("puppeteer");

exports.url2html = async (baseUrl) => {
    try{
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox", '--disable-dev-shm-usage', '--single-process',],
            timeout: 0
        });

    const page = await browser.newPage();

    await page.goto(baseUrl, { waitUntil: "networkidle0" });

    await page.evaluate(() => {
        document.querySelectorAll('img, link, script, a').forEach(el => {
            if (el.src) el.src = new URL(el.src, location.href).href;
            if (el.href) el.href = new URL(el.href, location.href).href;
        });
    });

    const pageHeight = await page.evaluate(() => {
        return Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );
    });
    

    await page.setViewport({
        width: 1280,
        height: pageHeight,
        deviceScaleFactor: 2
    });

    const elementsHTML = await page.evaluate(() => {
        function inlineCustomStyles(el) {
            const computedStyle = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();

            if (rect.width === 0 && rect.height === 0 || computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') return;

            const allElements = Array.from(document.querySelectorAll('*:not(script, style, meta, link)'));
            const domOrderIndex = allElements.indexOf(el);

            const ignoredValues = new Set([
                "normal", "unset", "initial", "inherit", "currentcolor", '0s', 'none'
            ]);

            const ignoredPrefixes = ["-webkit-", "-moz-", "-ms-", "-o-"];

            const ignoredProperties = new Set([
                // Default browser values
                "visibility", "clip", "clip-path",
                "overflow-x", "overflow-y", "unicode-bidi", "writing-mode",
                "direction", "white-space-collapse", "vertical-align",
                // Grid / Flex defaults
                "flex-direction", "flex-wrap", "flex-grow", "flex-shrink",
                "order", "grid-auto-flow",
                // Default typography
                "text-decoration", "text-decoration-style",
                "text-anchor", "text-emphasis-position",
                // Default layout
                "inline-size", "block-size",
                "margin-block-start", "margin-block-end",
                // Technical properties
                "perspective-origin", "shape-image-threshold", "math-depth",
                "offset-rotate", "caret-color", "ruby-align", "ruby-position",
                "view-timeline-axis", "scroll-timeline-axis", "zoom",
                // Unnecessary borders & backgrounds
                "border-collapse", "border-spacing", "border-block-end-color",
                "border-block-start-color", "border-inline-end-color",
                "border-inline-start-color", "border-left-color",
                "border-right-color", "border-top-color", "border-bottom-color",
                // SVG / Non-visual properties
                "fill-opacity", "fill-rule", "stroke",
                "stroke-opacity", "stroke-width", "stroke-linecap",
                "stroke-linejoin", "stroke-miterlimit", "stop-color",
                "stop-opacity", "lighting-color",
                //others
                "backface-visibility", "background-attachment", "mask-clip", "mask-composite", "mask-mode", "mask-origin",
                "mask-position", "mask-repeat", "mask-type", "object-fit", "right", "text-box-edge", "scroll-padding-inlin",
                "scroll-padding-block", "scroll-margin-inline", "scroll-margin-block", "animation-composition",
                "animation-iteration-count"
                ,"animation-play-state",
                "animation-timeline",
                "object-position", "hyphens", "image-orientation",
"interpolate-size", "list-style-position", "list-style-type",
"empty-cells", "field-sizing", "color-interpolation",
"color-interpolation-filters", "column-rule-color",
"background-clip", "background-origin", "background-position",
"background-repeat", "border-image-outset", "border-image-repeat",
"border-image-slice", "border-image-width", "box-decoration-break",
"box-sizing", "caption-side", "clip-rule", "orphans", "margin-inline", "marker", "mask-image", "mask-size",
"max-block-size", "max-height", "max-inline-size", "max-width",
"min-block-size", "min-height", "min-inline-size", "min-width",
"object-view-box", "offset-anchor", "offset-distance", "offset-path",
"hyphenate-character", "hyphenate-limit-chars", "image-rendering",
"inset", "inset-block", "inset-inline", "isolation", "line-break",
"list-style-image", "grid-area", "grid-auto-columns", "grid-auto-rows",
"font-size-adjust", "font-stretch", "font-synthesis", "font-kerning",
"font-optical-sizing", "filter", "flex-basis", "flood-color",
"flood-opacity", "dominant-baseline", "color-rendering",
"column-rule-style", "column-rule-width", "column-span", "columns",
"contain-intrinsic-block-size", "contain-intrinsic-inline-size",
"contain-intrinsic-size", "container-name", "cursor", "cx", "cy", "d",
"break-after", "break-before", "break-inside", "buffered-rendering",
"clear", "border-start-end-radius", "border-start-start-radius",
"baseline-shift", "baseline-source", "border-block-style",
"border-block-width", "border-end-end-radius", "border-end-start-radius",
"border-image-source", "border-inline-style", "border-inline-width",
"animation-timing-function", "app-region", "appearance",
"backdrop-filter", "background-attachment", "accent-color",
"alignment-baseline", "anchor-name", "anchor-scope","will-change", "transform-origin", "transform-style", "transition-property",
"transition-timing-function", "translate", "user-select", "vector-effect",
"view-timeline-inset", "view-timeline-name", "view-transition-class",
"view-transition-name", "widows", "text-size-adjust", "text-transform",
"text-underline-position", "text-wrap", "timeline-scope", "touch-action",
"text-decoration-skip-ink", "text-emphasis", "text-indent", "text-overflow",
"text-rendering", "text-align-last", "rx", "ry", "scroll-behavior",
"scroll-initial-target", "scroll-margin-block", "scroll-margin-inline",
"scroll-padding-block", "scroll-padding-inline", "scroll-timeline-name",
"scrollbar-color", "scrollbar-gutter", "scrollbar-width", "shape-margin",
"shape-outside", "shape-rendering", "stroke-dasharray", "stroke-dashoffset",
"tab-size", "table-layout", "position-anchor", "position-area",
"position-try-fallbacks", "position-visibility", "r", "resize",
"padding-block", "padding-inline", "perspective", "place-self",
"pointer-events", "overscroll-behavior-block", "overscroll-behavior-inline",
"outline-offset", "overflow-anchor", "overflow-clip-margin"
            ]);

            
            const customStyles = [
                ...Array.from(computedStyle)
                  .map(prop => {
                    const value = computedStyle.getPropertyValue(prop).trim();
                    if (!ignoredProperties.has(prop) && !ignoredValues.has(value) && !ignoredPrefixes.some(prefix => prop.startsWith(prefix))) {
                      return `${prop}: ${value};`;
                    }
                  })
                  .filter(style => style),
                  'position: relative;',
                `x: ${rect.left};`,
                `y: ${rect.top};`,
                `z-index: ${domOrderIndex};`,
            ]

            if (el.tagName === 'P' || el.tagName === 'SPAN' || el.tagName === 'A' || el.tagName === 'H2') {
                customStyles.push('z-index: 1000;'); // Higher priority for text
            }
            const preservedProperties = ['display', 'flex-direction', 'grid-template-columns'];
    preservedProperties.forEach(prop => {
        const value = computedStyle[prop];
        if (value && value !== 'none') customStyles.push(`${prop}: ${value};`);
    });
              
              el.setAttribute('style', customStyles.join(' '));

            Array.from(el.children).forEach(inlineCustomStyles);
        }

        function extractElements(el) {
            inlineCustomStyles(el);

            let elements = [];
            Array.from(el.children)
            .filter(child => {
                const tagName = child.tagName.toLowerCase();
                const skipTags = ['script', 'style', 'meta', 'link', 'noscript', 'svg', 'head'];
                
                // Skip invisible elements
                const style = window.getComputedStyle(child);
                return !skipTags.includes(tagName) && 
                       style.display !== 'none' && 
                       style.visibility !== 'hidden' &&
                       style.width !== '0' &&
                       style.height !== '0' &&
                       child.offsetWidth > 0 &&
                       child.offsetHeight > 0;
            })
            .forEach(child => {
                elements = elements.concat(extractElements(child));
            });

            const clonedEl = el.cloneNode(false);
            if (el.textContent.trim() && el.children.length === 0) {
                clonedEl.textContent = el.textContent.trim();
            }

            elements.push(clonedEl.outerHTML);
            return elements;
        }
        

        return extractElements(document.body);
    });

    await browser.close();
    return elementsHTML.join("\n");
}catch(error){
    console.log(error)
}
};
