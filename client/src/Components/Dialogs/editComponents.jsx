import { forwardRef } from "react"
import Icon from '@mdi/react';
import { mdiContentCopy } from '@mdi/js';

const EditorDialog = forwardRef(({
    mediaQuery,duplicate,closeDialog,handleSubmit, handleImageChange,
    deleteElement, bringForward, sendBackward}, ref) => {

      let clicksW = 0, clicksH = 0

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

    return (
        <>
        <dialog ref={ref} className="custom-dialog">
  <header className="dialog-header">
    <h3>Customize</h3>
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
    <input type="color" name="bgColor" id="bgColor" defaultValue="#ffffff"/>
    
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