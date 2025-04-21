import React, { forwardRef, useRef, useState, useEffect } from "react";
import Editor from '@monaco-editor/react'

 const CodeEditor = forwardRef(({currentElement, dialogRef, elements, setElements,
  saveHistory,setChangingStyle,setCurrentElement, chngStyle, currentPage}, ref) => {
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

      const toCamelCase = (str) =>
        str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

      function showValue() {
      const style = String(editorRef.current.getValue()).split('{')[1]
      const completedStyle = style.replace('}', '').trim()

      const styleProperties = completedStyle.split(';').filter(Boolean);

      const blacklist = ['x', 'y', 'border']; // remove invalid or conflicting keys
      const formattedStyle = {};

      styleProperties.forEach(property => {
        const [key, value] = property.split(':').map(str => str.trim());
        
        if (key && value && !blacklist.includes(key)) {
          formattedStyle[toCamelCase(key)] = value;
            // document.getElementById(elmId).children[0].style[key] = value;
        }
      });
      const updatedElement = {
        ...currentElement,
        style: formattedStyle,
        component: React.cloneElement(currentElement.component, {
          ...currentElement.component.props,
          style: formattedStyle
        }),
        page: currentPage
      };
      
      const newElements = chngStyle.changing
      ? elements.map((el) => el.id === currentElement.id ? updatedElement : el)
      : [...elements, updatedElement];

      console.log(newElements)

        setElements(newElements);
        saveHistory(newElements);
        setChangingStyle(false);
        setCurrentElement(null);

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