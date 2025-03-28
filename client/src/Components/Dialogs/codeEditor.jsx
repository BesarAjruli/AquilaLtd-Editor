import { forwardRef, useRef, useState, useEffect } from "react";
import Editor from '@monaco-editor/react'

 const CodeEditor = forwardRef(({currentElement, dialogRef}, ref) => {
    const editorRef = useRef(null);
    const [defaultStyle, setDefaultStyle] = useState(null); 
    const [id, setId] = useState(null);
    const [elmId, setElmID] = useState('')
    const [prevStyle, setPrevStyle] = useState(null)

    function camelToKebab(str) {
        return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
      }
      
    // Set the id if currentElement has one
    useEffect(() => {
        if (currentElement?.id) {
            setId((currentElement.id).replace(/\./g, '\\2e'));
            setElmID(currentElement.id)
            setPrevStyle(
              Object.entries(currentElement.style)
                  .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
                  .join(';\n')
          );
         }
    }, [currentElement]);

    // Update defaultStyle when id changes
    useEffect(() => {
        if (id) {
            setDefaultStyle(`/*Only put hex code for colors (#fff)*/
#${id} {
${prevStyle}
}`);
        }
    }, [prevStyle, id]);
    

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
      }

      function showValue() {
      const style = String(editorRef.current.getValue()).split('{')[1]
      const completedStyle = style.replace('}', '').trim()

      const styleProperties = completedStyle.split(';').filter(Boolean);
      styleProperties.forEach(property => {
        const [key, value] = property.split(':').map(str => str.trim());
        
        if (key && value) {
            document.getElementById(elmId).children[0].style[key] = value;
        }
      });
      ref.current.close()
      dialogRef.current.close()
      }

  return (
    <>
      <dialog ref={ref} className="custom-dialog injectDialog">
      <i onClick={() => ref.current.close()} className="close-icon inj" title='close'>✖</i>
        <Editor
            width='600px'
            height='500px'
            defaultLanguage="css"
            value={defaultStyle}
            onMount={handleEditorDidMount}
            className="txtEditor"
        />
        <button onClick={showValue} className="submit-button inj">Submit</button>
      </dialog>
    </>
  );
})

export default CodeEditor