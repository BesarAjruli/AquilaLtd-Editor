const puppeteer = require('puppeteer');

// Shared browser config
const getBrowser = async () => {
    return puppeteer.launch({
      timeout: 0,
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", '--disable-dev-shm-usage'],
    });
  };

exports.generate = async (prompt, mobile) => {
    try {
        const request = await fetch(process.env.OPENROUTER_URL, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-chat:free",
                "messages": [{
                    "role": "user",
                    "content": `
                    Generate a complete, responsive HTML page with inline CSS that includes as per user request:
                    1. A modern, visually appealing design with harmonious color scheme
                    2. A proper document structure with semantic HTML5 elements
                    3. A header with navigation menu (include 4-5 example links)
                    4. A hero section with a heading, brief text, and call-to-action button
                    5. A main content section with at least 3 distinct components (features, testimonials, etc.)
                    6. High-quality images and videos sourced from free content platforms like:
                    - Unsplash (https://unsplash.com)
                    - Pexels (https://www.pexels.com)
                    - Pixabay (https://pixabay.com)
                    - Freepik (https://www.freepik.com)
                    - Videvo (https://www.videvo.net)
                    - Coverr (https://coverr.co)
                    - Life of Vids (https://www.lifeofvids.com)
                    7. A footer with contact information and social links

                    Use:
                    - A cohesive color palette (provide 3-4 main colors)
                    - Modern typography (Google Fonts)
                    - Proper spacing and visual hierarchy
                    - Optimized image/video URLs from the above sources that are free to use without attribution (though attribution is preferred when possible)
                    - Responsive media (images that scale properly, videos that use HTML5 video tag)

                    User Request:
                    ${prompt}

                    Ensure it contains base elements like headers, footers, images, videos and buttons if relevant.
                    Only return pure HTML with inline CSS. Do not include explanations or additional text.`
                }]
            })
        });

        const response = await request.json();
        if (!response.choices || response.choices.length === 0) {
            throw new Error("Invalid response from OpenRouter.");
        }

        const messageContent = response.choices[0].message.content;

        return {comp: await getStyledElementsHTML(messageContent, mobile), pageHeight: await pageHeight(messageContent, mobile)}
    } catch (error) {
        console.error("Error generating HTML:", error);
        return "";
    }
};

async function getStyledElementsHTML(htmlContent, mobile) {
     const browser = await getBrowser()
    
        const page = await browser.newPage();

        await page.setViewport({
            width: mobile ? 300 : 1280,
            height: 800,
            deviceScaleFactor: 2
        });
    
        await page.setContent(htmlContent,{
            waitUntil: 'networkidle0',
            timeout: 0
        })

        await page.waitForTimeout(100);

        await page.evaluate(() => {
            document.querySelectorAll('img, link, script, a').forEach(el => {
                try {
                    // Handle src attributes
                    if (el.src) {
                        try {
                            // Skip data URLs and empty src
                            if (!el.src.startsWith('data:') && el.src.trim() !== '') {
                                el.src = new URL(el.src, location.href).href;
                            }
                        } catch (e) {
                            console.warn(`Could not process src URL: ${el.src}`);
                            // Keep original src if URL construction fails
                        }
                    }
                    
                    // Handle href attributes
                    if (el.href) {
                        try {
                            // Skip javascript:, mailto:, tel:, etc. and empty href
                            if (!el.href.startsWith('javascript:') && 
                                !el.href.startsWith('mailto:') &&
                                !el.href.startsWith('tel:') &&
                                el.href.trim() !== '') {
                                el.href = new URL(el.href, location.href).href;
                            }
                        } catch (e) {
                            console.warn(`Could not process href URL: ${el.href}`);
                            // Keep original href if URL construction fails
                        }
                    }
                } catch (e) {
                    console.warn('Error processing element:', el, e);
                }
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
            width: mobile ? 300 : 1280,
            height: pageHeight,
            deviceScaleFactor: 2
        });

        const results = await page.evaluate(() => {
    function inlineBasicStyle(el) {
        const computedStyle = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0 || computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') return;

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
    }

    function extractElements(el) {
        inlineBasicStyle(el);

        let elements = [];
        Array.from(el.children)
            .filter(child => {
                const tagName = child.tagName.toLowerCase();
                return !['script', 'style', 'meta', 'link', 'noscript', 'svg', 'head', 'option', 'title', 'html'].includes(tagName);
            })
            .forEach((child, index) => {
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

})

    await browser.close()
    return results.join('\n')
}

const pageHeight = async(htmlContent, mobile) => {
    const browser = await getBrowser()

const page = await browser.newPage();

await page.setContent(htmlContent,{
    waitUntil: 'networkidle0',
    timeout: 0
})

await page.evaluateHandle('document.fonts.ready'); // wait for fonts to load
await new Promise(resolve => setTimeout(resolve, 1000));

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

await browser.close()
return pageHeight

}