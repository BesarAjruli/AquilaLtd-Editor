import { forwardRef } from "react"
import Icon from '@mdi/react';
import { mdiContentCopy } from '@mdi/js';

const EditorDialog = forwardRef(({mediaQuery,duplicate,closeDialog,handleSubmit, handleImageChange, setWidthMax, deleteElement}, ref) => {
    return (
        <>
        <dialog ref={ref} className="custom-dialog">
  <header className="dialog-header">
    <h3>Customize</h3>
    <Icon path={mdiContentCopy} size={0.8} title='duplicate' className='close-icon duplicate' onClick={duplicate}/>
    <i onClick={closeDialog} className="close-icon" title='close'>✖</i>
  </header>
  <form onSubmit={handleSubmit} className="dialog-form">
    <label htmlFor="content">Content:</label>
    <input type="text" name="content" id="content" />
    
    <label htmlFor="imageContent">Select Image:</label>
    <input type="file" name="imageContent" id="imageContent" accept="image/*" onChange={handleImageChange}/>
    
    <label htmlFor="width">Width:</label>
    <div>
      <input type="number" id="width" name="width" min={1} defaultValue={100} max={mediaQuery.matches ? 300: 1280} required/>
      <button className='maxWidth' onClick={setWidthMax}>Max</button>
    </div>
    
    <label htmlFor="height">Height:</label>
    <input type="number" name="height" id="height" min={1} defaultValue={100} required/>
    
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
    
    <button className='deleteButton' type='button' onClick={deleteElement}>Delete</button>
    <button type="submit" className="submit-button">Submit</button>
  </form>
      </dialog>
      </>
    )
})

export default EditorDialog