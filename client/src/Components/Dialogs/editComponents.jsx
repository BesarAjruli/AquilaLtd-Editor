import React, { forwardRef, useState } from "react"
import Icon from '@mdi/react';
import { mdiContentCopy } from '@mdi/js';

let imagesSet = 0

const EditorDialog = forwardRef(({
    mediaQuery,duplicate,closeDialog, handleImageChange,
    currentElement, chngStyle, extraEditor, elements, injectCssRef,
     imageSrc, currentPage, setImageSrc, setElements, saveHistory, setChangingStyle,
    setCurrentElement, iconsDialog, editorRef, limitations, unlockDialog
    }, ref) => {

      const [layer, setLayer]= useState(null)

      let clicksW = 0, clicksH = 0, clicksT = 0

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
      if(clicksW === 0){
      ref.current.querySelector('#width').setAttribute('disabled', 'true')
      ref.current.querySelector('#autoW').value = 1
      clicksW+=2
    } else{
      ref.current.querySelector('#width').removeAttribute('disabled')
      ref.current.querySelector('#autoW').value = 0
      clicksW = 0
    }
    }
    else{
      if(clicksH === 0){
        ref.current.querySelector('#height').setAttribute('disabled', 'true')
        ref.current.querySelector('#autoH').value = 1
        clicksH+=2
      } else{
        ref.current.querySelector('#height').removeAttribute('disabled')
        ref.current.querySelector('#autoH').value = 0
        clicksH = 0
      }
    }
  }
  const setTransparent = (e) => {
    e.preventDefault()

    if(clicksT === 0){
      ref.current.querySelector('#bgColor').setAttribute('disabled', 'true')
      ref.current.querySelector('#transparent').value = 1
      clicksT+=2
    } else{
      ref.current.querySelector('#bgColor').removeAttribute('disabled')
      ref.current.querySelector('#transparent').value = 0
      clicksT = 0
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
    const newElements = elements.filter((el) => el.id !== chngStyle.id);
    setElements(newElements);
    saveHistory(newElements);
    ref.current.close();
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    const formattedStyle = {
        width: parseInt(data.autoW ) === 0 ? data.width + 'px' : 'auto',
        height: parseInt(data.autoH) === 0 ? data.height + 'px' : 'auto',
        color: data.fontColor,
        backgroundColor: parseInt(data.transparent) === 0 ? data.bgColor : 'transparent',
        fontSize: data.fontSize + 'px',
        borderWidth: data.borderWidth + 'px',
        borderRadius: data.borderRadius + 'px',
        borderColor: data.borderColor,
        borderStyle: 'solid',
        position: currentElement.id.startsWith('editor') ? 'relative' : 'absolute',
        left: currentElement.id.startsWith('editor') && chngStyle.changing === true ? 0 : currentElement.style.left || 0,
        top: currentElement.id.startsWith('editor') ? 0 : currentElement.style.top || 0,
        zIndex: chngStyle.changing ? layer ?? currentElement.style.zIndex : elements.length ,
        opacity: parseInt(data.opacity) / 100,
        }
        
        if (currentElement && !currentElement.id.startsWith('editor')) {
          const compName = currentElement.component.type.name
          if( compName === 'ImageCmp'){
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
            component: React.cloneElement(currentElement.component, { style: formattedStyle, content: imageSrc ? imageSrc : data.content }),
            page: currentPage,
          };
          const newElements = chngStyle.changing
          ? elements.map((el) =>
              el.id === currentElement.id ? updatedElement : el
            )
          : [...elements, updatedElement];
  
        setImageSrc(null)
        setElements(newElements);
        saveHistory(newElements);
        setChangingStyle(false);
        setCurrentElement(null);
        } else if(currentElement){
          Object.keys(formattedStyle).forEach(key => {
            editorRef.current.style[key] = formattedStyle[key];
        });
        setChangingStyle(false);
        setCurrentElement(null);
        setLayer(null)
        }
    e.target.reset()
    closeDialog()
    iconsDialog.current.close()
  }

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
  <form onSubmit={handleSubmit} className="dialog-form">
    <label htmlFor="content">Content:</label>
    <input type="text" name="content" id="content" />
    <input type="hidden" name="content" id="hiddenContent"/>
    
    <label htmlFor="imageContent">Select Image:</label>
    <input type="file" name="imageContent" id="imageContent" accept="image/*" onChange={handleImageChange}/>
    
    <label htmlFor="width">Width:</label>
    <div>
      <input type="number" id="width" name="width" min={1} defaultValue={100} max={mediaQuery.matches ? 300: 1280} required/>
      <button className="maxWidth" onClick={(e) => setAuto(e, 'width')}>Auto</button>
      <button className='maxWidth' onClick={setWidthMax}>Max</button>
      <input type="hidden" name="autoW" id="autoW" defaultValue={0}/>
    </div>
    
    <label htmlFor="height">Height:</label>
    <div>
      <input type="number" name="height" id="height" min={1} defaultValue={100} required/>
      <button className="maxWidth" onClick={(e) => setAuto(e, 'height')}>Auto</button>
      <input type="hidden" name="autoH" id="autoH" defaultValue={0}/>
    </div>
    
    <label htmlFor="fontSize">Font Size:</label>
    <input type="number" name="fontSize" id="fontSize" min={1} defaultValue={14}/>
    
    <label htmlFor="fontColor">Font Color:</label>
    <input type="color" name="fontColor" id="fontColor" />
    
    <label htmlFor="bgColor">Background Color:</label>
    <div>
      <input type="color" name="bgColor" id="bgColor" defaultValue="#ffffff"/>
      <button className="maxWidth" onClick={(e) => setTransparent(e)}>Transparent</button>
      <input type="hidden" name="transparent" id="transparent"  defaultValue={0}/>
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