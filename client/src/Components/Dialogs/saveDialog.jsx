import { forwardRef } from "react"

const SaveDesign = forwardRef(({saveDesign, totalPages, editorRef}, ref) => {
    const saveDesignSelection = (e) => {
        e.preventDefault()

        function downloadDivAsHTML(filename = 'elements.html') {
            const editor = editorRef.current;
            if (!editor) {
              console.error('Editor not found!');
              return;
            }
          
            const clonedEditor = editor.cloneNode(true);
            const elements = [];
          
            clonedEditor.querySelectorAll('.react-draggable').forEach(wrapper => {
              const mainElement = wrapper.querySelector('.edit');
              if (mainElement) {
                const top = wrapper.style.top || '0px';
                const left = wrapper.style.left || '0px';
                const transform = wrapper.style.transform;
          
                // Extract translateX and translateY from transform if available
                let x = left;
                let y = top;
          
                if (transform && transform.includes('translate')) {
                  const match = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
                  if (match) {
                    x = match[1] + 'px';
                    y = match[2] + 'px';
                  }
                }
          
                const clone = mainElement.cloneNode(true);
                clone.style.position = 'absolute';
                clone.style.left = x;
                clone.style.top = y;
          
                elements.push(clone);
              }
            });
          
            const innerHTML = elements.map(el => el.outerHTML).join('\n');
          
            const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Exported Elements</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                position: relative;
              }
            </style>
          </head>
          <body>
            ${innerHTML}
          </body>
          </html>
          `;
          
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
          
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
          
          
          
          

        const value = document.getElementById('saveOptions').value
        if(value === 'send'){
            //sends to professionals
            saveDesign(totalPages)
        } else if(value === 'saveAShtml'){
            //saves it as html
            downloadDivAsHTML()
        } else{
            //saves it as an image
            saveDesign(totalPages, false,true)
        }

        ref.current.close()
    }
    return(
        <>
            <dialog className="custom-dialog" ref={ref}>
                <header>
                    How do you want to save this design:
                    <i onClick={() => ref.current.close()} className="close-icon" title='close' style={{float: 'right', marginLeft: '30px'}}>✖</i>
                </header>
                <br /><br />
                    <form onSubmit={saveDesignSelection}>
                        <select name="saveOptions" id="saveOptions" className="saveSelect">
                            <option value="send">Send it to our professionals</option>
                            <option value="saveASimg">Save it as an image</option>
                            <option value="saveAShtml">Save it as HTML</option>
                        </select>
                        <br /><br />
                        <button type="submit" className="submit-button">Submit</button>
                    </form>
            </dialog>
        </>
    )
})

export default SaveDesign