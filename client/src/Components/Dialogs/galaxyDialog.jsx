import { forwardRef, useEffect, useState } from "react";
import components from '../../../../server/routers/components.json';

const COMPONENTS_PER_PAGE = 10;

const GalaxyDialog = forwardRef(({parseElements, setElements}, ref) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [parsedElms, setParsedElms] = useState([]);

  const [componentCache, setComponentCache] = useState({});

  const parseGalaxyElements = (htmlString) => {
    const results = htmlString 
  
    return results;
  };

useEffect(() => {
  const start = currentPage * COMPONENTS_PER_PAGE;
  const end = start + COMPONENTS_PER_PAGE;
  
  const newParsed = components.slice(start, end).map(comp => {
    if (componentCache[comp.id]) return componentCache[comp.id];
    const parsed = parseGalaxyElements(comp.html);
    setComponentCache(prev => ({ ...prev, [comp.id]: parsed }));
    return parsed;
  });
  
  setParsedElms(newParsed);
}, [currentPage, componentCache]);

  const totalPages = Math.ceil(components.length / COMPONENTS_PER_PAGE);

  function extractNestedElements(htmlString) {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px'; // hide offscreen
    container.innerHTML = htmlString.trim();
    document.body.appendChild(container); // must be in DOM to measure
  
    const result = [];
  
    function traverse(element) {
        const x = element.offsetLeft;
        const y = element.offsetTop;

        const styleAttr = element.getAttribute('style') || '';

        element.setAttribute('style', `${styleAttr}; x: ${x}; y: ${y};`);

      result.push(element.outerHTML);

      for (const child of element.children) {
        traverse(child);
      }
    }
  
    const root = container.firstElementChild;
    if (root) {
      traverse(root);
    }
  
    document.body.removeChild(container); // clean up
    return result;
  }


  const galaxyElmCLicked = (clickedElm) => {
    const elmentsToParse = extractNestedElements(clickedElm)

    const parsedElements = parseElements(elmentsToParse, true)

    setElements(parsedElements)
    ref.current.close()
  }

  return (
    <>
      <dialog ref={ref} className="custom-dialog galaxyComp">
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <header>
            <i onClick={() => ref.current.close()} className="close-icon galaxyClose" title='close' style={{float: 'right', marginLeft: '30px'}}>✖</i>
            </header>
            <div className="galaxyElementsContainer">
                {parsedElms.map((elms, i) => (
                <div key={i}>
                    <div className="containerGalaxyComp" onClick={() => galaxyElmCLicked(elms)} key={i} dangerouslySetInnerHTML={{ __html: elms }} />
                </div>
                ))}
            </div>
            <div className="pagination-controls" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 0))} disabled={currentPage === 0}>
                Previous
              </button>
              <span><em>Page {currentPage + 1} of {totalPages}</em></span>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))} disabled={currentPage >= totalPages - 1}>
                Next
              </button>
            </div>
        </div>
      </dialog>
    </>
  );
});

export default GalaxyDialog;
