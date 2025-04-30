import React, { forwardRef, useState, useRef } from "react"
import Icon from '@mdi/react';
import { mdiContentCopy } from '@mdi/js';
import useShortcuts from "../../Shortcuts/shortcuts";

let imagesSet = 0

const EditorDialog = forwardRef(({
    mediaQuery,duplicate,closeDialog, handleImageChange,
    currentElement, chngStyle, extraEditor, elements, injectCssRef,
     imageSrc, currentPage, setImageSrc, setElements, saveHistory, setChangingStyle,
    setCurrentElement, iconsDialog, editorRef, limitations, unlockDialog, selectedElements, setSelectedElements
    }, ref) => {

      const [layer, setLayer]= useState(null)
      const imageRef = useRef(null)

      let clicksT = 0

  const setWidthMax = (e) => {
    e.preventDefault()
    if(mediaQuery.matches){
      ref.current.querySelector('#width').value = 300 
    } else {
      ref.current.querySelector('#width').value = 1280 
    }
  }
  const setAuto = (e, typ) => {
    e.preventDefault()
    if(typ === 'width'){
      console.log(ref.current.querySelector('#autoW').value )
      if(ref.current.querySelector('#autoW').value  === '0'){
      ref.current.querySelector('#width').setAttribute('disabled', 'true')
      ref.current.querySelector('#autoW').value = 1
    } else{
      ref.current.querySelector('#width').removeAttribute('disabled')
      ref.current.querySelector('#autoW').value = 0
    }
    }
    else{
      if(ref.current.querySelector('#autoH').value === '0'){
        ref.current.querySelector('#height').setAttribute('disabled', 'true')
        ref.current.querySelector('#autoH').value = 1
      } else{
        ref.current.querySelector('#height').removeAttribute('disabled')
        ref.current.querySelector('#autoH').value = 0
      }
    }
  }
  const setTransparent = (e) => {
    e.preventDefault()
    if(parseInt(ref.current.querySelector('#transparent').value) === 0){
      ref.current.querySelector('#bgColor').setAttribute('disabled', 'true')
      ref.current.querySelector('#transparent').value = 1
    } else{
      ref.current.querySelector('#bgColor').removeAttribute('disabled')
      ref.current.querySelector('#transparent').value = 0
    }
  }

  const bringForward = () => {
    let layers = layer ?? parseInt(currentElement.style.zIndex)
    if(layers !== elements.length){
      ref.current.querySelectorAll('.layers')[1].style.cursor = 'default'
      setLayer(layers + 1)
    }else {
      ref.current.querySelectorAll('.layers')[1].style.cursor = 'not-allowed'
    }
  }
  
  const sendBackward = () => {
    let layers = layer ?? parseInt(currentElement.style.zIndex)
    if(layers !== 0){
      ref.current.querySelectorAll('.layers')[0].style.cursor = 'default'
      setLayer(layers - 1);
    }else {
      ref.current.querySelectorAll('.layers')[0].style.cursor = 'not-allowed'
    }
  }  

  const deleteElement = () => {
    let newElements;
  
    if (selectedElements.length > 0) {
      const selectedIds = selectedElements.map(sel => sel.id);
      newElements = elements.filter(el => !selectedIds.includes(el.id));
      setSelectedElements([]); // Clear selection
    } else {
      newElements = elements.filter(el => el.id !== chngStyle.id);
    }
  
    setElements(newElements);
    saveHistory(newElements);
    setCurrentElement(null);
    setChangingStyle(false);

    ref.current.close();
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    const formattedStyle = {
      ...(currentElement && !currentElement.id.startsWith('editor') ? currentElement.style : {}),
        width: parseInt(data.autoW ) === 0 ? data.width + 'px' : 'auto',
        height: parseInt(data.autoH) === 0 ? data.height + 'px' : 'auto',
        color: data.fontColor,
        backgroundColor: parseInt(data.transparent) === 0 ? data.bgColor : 'transparent',
        fontSize: data.fontSize + 'px',
        borderWidth: data.borderWidth + 'px' || 0,
        borderRadius: data.borderRadius + 'px',
        borderColor: data.borderColor,
        borderStyle: 'solid',
        position: currentElement.id.startsWith('editor') ? 'relative' : 'absolute',
        zIndex: chngStyle.changing ? layer ?? currentElement.style.zIndex : elements.length ,
        opacity: parseInt(data.opacity) / 100,
        }
        
        if (currentElement && !currentElement.id.startsWith('editor')) {
          const compName = currentElement.component.type.name
          if( compName === 'ImageCmp'){
            if(data.content !== '') imageRef.current = data.content
            if(imagesSet !== (limitations || 3)){
              imagesSet++
            } else{
              closeDialog()
              unlockDialog.current.showModal()
              return
            }
          }
          const updatedElement = {
            ...currentElement,
            style: formattedStyle,
            component: React.cloneElement(currentElement.component, { style: formattedStyle, content: imageRef.current? imageRef.current : imageSrc ? imageSrc : data.content }),
            page: currentPage,
            x: currentElement.x,
            y: currentElement.y
          };
          const newElements = chngStyle.changing
          ? elements.map((el) =>
              el.id === currentElement.id ? updatedElement : el
            )
          : [...elements, updatedElement];

          if(chngStyle.changing){
            document.getElementById(currentElement.id).style.width = formattedStyle.width
            document.getElementById(currentElement.id).style.height = formattedStyle.height
          }
  
        setElements(newElements);
        saveHistory(newElements);
        setChangingStyle(false);
        setCurrentElement(null);
        imageRef.current = null
        } else if(currentElement){
          console.log(formattedStyle)
          Object.keys(formattedStyle).forEach(key => {
            editorRef.current.style[key] = formattedStyle[key];
        });
        setChangingStyle(false);
        setCurrentElement(null);
        setImageSrc(null)
        setLayer(null)
        imageRef.current = null
        }
    e.target.reset()
    closeDialog()
    iconsDialog.current.close()
  }

  useShortcuts({
    onDuplicate: duplicate,
    onDelete: deleteElement,
  });

    return (
        <>
        <dialog ref={ref} className="custom-dialog">
  <header className="dialog-header">
    <h3>Customize</h3>
    <svg xmlns="http://www.w3.org/2000/svg" className='inject' viewBox="0 0 24 24" onClick={() => injectCssRef.current.showModal()}> 
    <title>inject code</title>
    <path d="M11.15,15.18L9.73,13.77L11.15,12.35L12.56,13.77L13.97,12.35L12.56,10.94L13.97,9.53L15.39,10.94L16.8,9.53L13.97,6.7L6.9,13.77L9.73,16.6L11.15,15.18M3.08,19L6.2,15.89L4.08,13.77L13.97,3.87L16.1,6L17.5,4.58L16.1,3.16L17.5,1.75L21.75,6L20.34,7.4L18.92,6L17.5,7.4L19.63,9.53L9.73,19.42L7.61,17.3L3.08,21.84V19Z" />
    </svg>
    <span className="advSettings" onClick={() => extraEditor.current.showModal()}>+</span>
    <div className="layersCOntainer">
      <svg 
      className="layers"
      onClick={sendBackward}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24">
        <title>send-backward</title>
        <path d="M2,2H16V16H2V2M22,8V22H8V18H18V8H22M4,4V14H14V4H4Z" />
        </svg>
      <svg
       className='layers' xmlns="http://www.w3.org/2000/svg"
       onClick={bringForward}
        viewBox="0 0 24 24">
          <title>bring-forward</title>
          <path d="M2,2H16V16H2V2M22,8V22H8V18H10V20H20V10H18V8H22Z" />
          </svg>
    </div>
    <Icon path={mdiContentCopy} size={0.8} title='duplicate' className='close-icon duplicate' onClick={duplicate}/>
    
    <i onClick={closeDialog} className="close-icon" title='close'>✖</i>
  </header>
  <form onSubmit={handleSubmit} className="dialog-form" onKeyDown={(e) => {
  if(e.shiftKey && e.key === 'Delete') {
    e.preventDefault()
    deleteElement()
  }
}}>
    <label htmlFor="content">Content:</label>
    {currentElement?.component?.type?.displayName === 'Video' || currentElement?.component?.type?.displayName === 'ImageCmp'?
    <input type="text" name="content" id="content" /> :
    <textarea name="content" id="content" cols={40} rows={5}></textarea>}
    <input type="hidden" name="content" id="hiddenContent"/>
    
    <label htmlFor="imageContent">Select Image:</label>
    <input type="file" name="imageContent" id="imageContent" accept={currentElement?.component?.type?.displayName === 'Video' ? 'video/mp4,video/*' : 'image/*'} onChange={handleImageChange}/>
    
    <label htmlFor="width">Width:</label>
    <div>
      <input type="number" id="width" name="width" min={1} defaultValue={100} max={mediaQuery.matches ? 300: 1280} required/>
      <button type="button" className="maxWidth" onClick={(e) => setAuto(e, 'width')}>Auto</button>
      <button type="button" className='maxWidth' onClick={setWidthMax}>Max</button>
      <input type="hidden" name="autoW" id="autoW"/>
    </div>
    
    <label htmlFor="height">Height:</label>
    <div>
      <input type="number" name="height" id="height" min={1} defaultValue={100} required/>
      <button type="button" className="maxWidth" onClick={(e) => setAuto(e, 'height')}>Auto</button>
      <input type="hidden" name="autoH" id="autoH"/>
    </div>
    
    <label htmlFor="fontSize">Font Size:</label>
    <input type="number" name="fontSize" id="fontSize" min={1} defaultValue={14}/>
    
    <label htmlFor="fontColor">Font Color:</label>
    <input type="color" name="fontColor" id="fontColor" />
    
    <label htmlFor="bgColor">Background Color:</label>
    <div>
      <input type="color" name="bgColor" id="bgColor" defaultValue="#ffffff"/>
      <button type="button" className="maxWidth" onClick={(e) => setTransparent(e)}>Transparent</button>
      <input type="hidden" name="transparent" id="transparent"/>
    </div>
    
    <label htmlFor="borderWidth">Border Width:</label>
    <input type="number" name="borderWidth" id="borderWidth" min={0} defaultValue={0}/>
    
    <label htmlFor="borderColor">Border Color:</label>
    <input type="color" name="borderColor" id="borderColor" />
    
    <label htmlFor="borderRadius">Border Radius:</label>
    <input type="number" name="borderRadius" id="borderRadius" min={0} defaultValue={10} />
    <label htmlFor="opacity">Opacity</label>
    <input type="number" name="opacity" id="opacity"  min={0} defaultValue={100}/>
    
    <button className='deleteButton' type='button' onClick={deleteElement}>Delete</button>
    <button type="submit" className="submit-button">Submit</button>
  </form>
      </dialog>
      </>
    )
})

export default EditorDialog