import React, { useState, useRef } from 'react';
import './style/style.css';
import html2canvas from 'html2canvas'

const Text = ({style}) => <span className='edit' style={style}>Text</span>;
const Button = ({style}) => <button className='edit' style={style}>Button</button>;
const Input = ({style}) => <input className='edit' style={style} type="text"/>;
const Image = ({style}) => <img className='edit' style={style} src="https://img.icons8.com/skeuomorphism/64/image.png" alt="Picture" />;
const Video = ({style}) => <img className='edit' style={style} src="https://img.icons8.com/skeuomorphism/64/video.png" alt="Video" />;
const Audio = ({style}) => <audio className='edit' style={style} src=""></audio>;
const Gallery = ({style}) => <img className='edit' style={style} src="https://t3.ftcdn.net/jpg/04/19/92/88/360_F_419928833_w7HrdbjTCl1zGIBY1YljW6feoWx90ETm.jpg" alt="Gallery" />;
const Section = ({style}) => <div className='edit' style={style}></div>;
const Link = ({style}) => <a className='edit' style={style} href="" disabled>https://links.com</a>;
const List = ({style}) => {return (
  <div className='edit' style={style}>
    <ul >
      <strong><em>List1</em></strong>
      <li>Item1</li>
      <li>Item2</li>
    </ul>
  </div>
);}


export default function App() {
  const [elements, setElements] = useState([]);
  const dialogRef = useRef(null)
  const [currentElement, setCurrentElement] = useState(null)
  const [chngStyle, setChangingStyle] = useState(false)
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const editorRef = useRef(null)
  const [pages, setPage] = useState([1])
  const [currentPage, setCurrentPage] = useState(1)

  const uniqueId = () => `element-${Date.now()}-${Math.random()}`;

  const editorStyle = {
    width: '1280px',
    height: '520px',
    borderWidth: '0',
    borderColor: '#000',
    borderRadius: '10px',
    marginBottom: '30px',
    position: 'relative',
    overflow: 'hidden',
    color: '#000',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#fff'
}

  //History (undo/redo functions)
  const saveHistory = (newElements) => {
    const newHistory = history.slice(0, historyIndex + 1); // Truncate redo history
    setHistory([...newHistory, newElements]);
    setHistoryIndex(newHistory.length);
  };

  const undoFunction = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const redoFunction = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  // Adding new elements to the state and managing drag logic
  const addElement = (Component) => {
    const id = uniqueId();
    const newElement = {
      id,
      component: <Component key={id} style={{}} />,
      style: {},
      page: currentPage
    }
    setCurrentElement(newElement)

    if(currentElement){
      const type = currentElement.component.type.name
    const content = dialogRef.current.querySelector('#content')
    const contentLabel = dialogRef.current.querySelector('label[for="content"]')
    const imageContent = dialogRef.current.querySelector('#imageContent')
    const imgContLabel = dialogRef.current.querySelector('label[for="imageContent"]') 
    dialogRef.current.querySelector('.deleteButton').setAttribute('disabled', 'true')
    dialogRef.current.querySelector('#content').removeAttribute('disabled')
      dialogRef.current.querySelector('#width').removeAttribute('disabled')
      dialogRef.current.querySelector('#borderWidth').removeAttribute('disabled')
      dialogRef.current.querySelector('#borderRadius').removeAttribute('disabled')
      dialogRef.current.querySelector('#fontSize').removeAttribute('disabled')
      dialogRef.current.querySelector('#imageContent').removeAttribute('disabled')

    if( type === 'Image'){
      content.style.display = 'none'
      contentLabel.style.display = 'none'

      imageContent.style.display = 'block'
      imgContLabel.style.display = 'block'
    }else{
      imageContent.style.display = 'none'
      imgContLabel.style.display = 'none'

      content.style.display = 'block'
      contentLabel.style.display = 'block'
    }
    dialogRef.current.showModal()
    }
  };

  const handleDragStart = (id, e) => {
    e.preventDefault();

    const elementIndex = elements.findIndex((el) => el.id === id);
    const crntElement = elements[elementIndex];

    if (elementIndex === -1) return;

    const element = e.target
    const rect = element.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    let offsetY = e.clientY - rect.top;
    
    element.classList.add('dragging')
  
    const move = (moveEvent) => {
      const clientX = moveEvent.clientX;
      const clientY = moveEvent.clientY;
  
      const elementContainer = element.parentElement;
      const parent = elementContainer.parentElement;
      const parentRect = parent.getBoundingClientRect();
  
      let newX = clientX - offsetX;
      let newY = clientY - offsetY;
  
      // Ensure element stays within parent boundaries
      newX = Math.max(0, Math.min(newX, parentRect.width - rect.width));
      newY = Math.max(0, Math.min(newY, parentRect.height - rect.height));
  
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;

      const updatedStyle = {
        ...crntElement.style,
        left: `${newX}px`,
        top: `${newY}px`,
      };

      const updatedElement = {
        ...crntElement,
        style: updatedStyle,
        component: React.cloneElement(crntElement.component, { style: updatedStyle }),
      };

      const newElements =  elements.map((el) => el.id === crntElement.id ? updatedElement : el)

      setElements(newElements);
    };
  
    const endDrag = () => {
      element.classList.remove('dragging');

      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', endDrag);

      saveHistory(elements);
    };
  
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', move);
    document.addEventListener('touchend', endDrag);
  };
  //Handling style submit
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    const formattedStyle = {
        width: data.width + 'px',
        height: data.height + 'px',
        color: data.fontColor,
        backgroundColor: data.bgColor,
        fontSize: data.fontSize + 'px',
        borderWidth: data.borderWidth + 'px',
        borderRadius: data.borderRadius + 'px',
        borderColor: data.borderColor,
        position: currentElement.id.startsWith('editor') ? 'relative' : 'absolute',
        left: currentElement.id.startsWith('editor') && chngStyle.changing === true ? 0 : currentElement.style.left,
        top: currentElement.id.startsWith('editor') ? 0 : currentElement.style.top
        }
        if (currentElement && !currentElement.id.startsWith('editor')) {
          const updatedElement = {
            ...currentElement,
            style: formattedStyle,
            component: React.cloneElement(currentElement.component, { style: formattedStyle }),
            page: currentPage
          };
          const newElements = chngStyle.changing
          ? elements.map((el) =>
              el.id === currentElement.id ? updatedElement : el
            )
          : [...elements, updatedElement];
  
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
        }
    e.target.reset()
    dialogRef.current.close()
  }

  const changeStyle = (id, e) => {
    e.preventDefault()
    e.stopPropagation();
    dialogRef.current.querySelector('#width').value = parseInt(e.target.style.width)
    dialogRef.current.querySelector('#height').value = parseInt(e.target.style.height)
    dialogRef.current.querySelector('#fontSize').value = parseInt(e.target.style.fontSize)
    dialogRef.current.querySelector('#fontColor').value = rgbToHex(e.target.style.color)
    dialogRef.current.querySelector('#bgColor').value = rgbToHex(e.target.style.backgroundColor)
    dialogRef.current.querySelector('#borderWidth').value = parseInt(e.target.style.borderWidth)
    dialogRef.current.querySelector('#borderRadius').value = parseInt(e.target.style.borderRadius)
    dialogRef.current.querySelector('#borderColor').value = rgbToHex(e.target.style.borderColor)

    setChangingStyle({changing: true, id})

    if(!id.startsWith('editor')) {
      dialogRef.current.querySelector('#content').removeAttribute('disabled')
      dialogRef.current.querySelector('#width').removeAttribute('disabled')
      dialogRef.current.querySelector('#borderWidth').removeAttribute('disabled')
      dialogRef.current.querySelector('#borderRadius').removeAttribute('disabled')
      dialogRef.current.querySelector('#fontSize').removeAttribute('disabled')
      dialogRef.current.querySelector('#imageContent').removeAttribute('disabled')
      dialogRef.current.querySelector('.deleteButton').removeAttribute('disabled')
      const elementToUpdate = elements.find(element => element.id === id);

    if (elementToUpdate) {
      setCurrentElement({
         id,
         component: elementToUpdate.component,
         style: elementToUpdate.style
    });
  } 
} else if(id.startsWith( 'editor')){
  dialogRef.current.querySelector('#content').setAttribute('disabled', 'true')
  dialogRef.current.querySelector('#width').setAttribute('disabled', 'true')
  dialogRef.current.querySelector('#borderWidth').setAttribute('disabled', 'true')
  dialogRef.current.querySelector('#borderRadius').setAttribute('disabled', 'true')
  dialogRef.current.querySelector('#fontSize').setAttribute('disabled', 'true')
  dialogRef.current.querySelector('#imageContent').setAttribute('disabled', 'true')
  dialogRef.current.querySelector('.deleteButton').setAttribute('disabled', 'true')

  setCurrentElement({
      id,
      component: editorRef.current,
      style: editorRef.current.style
    })
  }
    
    dialogRef.current.showModal()
  }

  const closeDialog = () => {
    dialogRef.current.querySelector('form').reset()
    dialogRef.current.close()
  }

  const setWidthMax = (e) => {
    e.preventDefault()
    dialogRef.current.querySelector('#width').value = 1280 
  }

  function rgbToHex(rgb) {
    // Extract the individual RGB values using a more robust regular expression
    var match = rgb.match(/\d+/g);

    // Ensure that we have three RGB values
    if (match.length !== 3) {
        console.error("Invalid RGB color format");
        return null;
    }

    // Convert RGB values to hexadecimal format
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }

    // Construct the hexadecimal color string
    var hexColor = "#" + hex(match[0]) + hex(match[1]) + hex(match[2]);
    
    return hexColor;
}

  const deleteElement = () => {
    const newElements = elements.filter((el) => el.id !== chngStyle.id);
    setElements(newElements);
    saveHistory(newElements);
    dialogRef.current.close();
  }

  const saveDesign = () => {
    if (editorRef.current) {
      editorRef.current.style.boxShadow = ''
      html2canvas(editorRef.current).then(canvas => {
        const link = document.createElement('a');
        link.download = 'div-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
    editorRef.current.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)'
  };

  const addNewPage = () => {
    setPage((prevPages) => {
      const nextPage = parseInt(prevPages) + 1;
      setCurrentPage(nextPage);
      return nextPage;
    });
  }

  return (
    <>
      <div className='toolBar'>
        <div className='history'>
        <button onClick={undoFunction} disabled={historyIndex === 0}>
          <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>undo</title><path d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" /></svg>
        </button>
        <button onClick={redoFunction} disabled={historyIndex === history.length - 1}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>redo</title><path d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z" /></svg>
        </button>
        <button onClick={saveDesign}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" /></svg>
        </button>
        </div>
        <div className='pages'>
        <div onClick={() => {if(currentPage > 1) setCurrentPage(currentPage - 1)}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-left</title><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg>
        </div>
          <span>Page: {currentPage}/{pages}</span>
          <div onClick={() => {if(currentPage < pages) setCurrentPage(currentPage + 1)}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-right</title><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
          </div>
        </div>
        <button onClick={addNewPage}>New Page</button>
      </div>
      <div className='sideElementsBar left'>
        <div className='text' onClick={() => addElement(Text)}>Text</div>
        <hr />
        <div className='button' onClick={() => addElement(Button)}><button>Button</button></div>
        <hr />
        <div className='input' onClick={() => addElement(Input)}><span>|</span></div>
        <hr />
        <div className='image' onClick={() => addElement(Image)}><img src="https://img.icons8.com/skeuomorphism/64/image.png" alt="image" /></div>
        <hr />
        <div className='video' onClick={() => addElement(Video)}><img src="https://img.icons8.com/skeuomorphism/64/video.png" alt="video" /></div>
        <hr />
        <div className='audio' onClick={() => addElement(Audio)}><img src="https://img.icons8.com/skeuomorphism/64/circled-play.png" alt="audio" /></div>
        <hr />
        <div className='gallery' onClick={() => addElement(Gallery)}><img src="https://img.icons8.com/skeuomorphism/64/stack-of-photos.png" alt="gallery" /></div>
        <hr />
        <div className='section' onClick={() => addElement(Section)}></div>
        <hr />
        <div className='link' onClick={() => addElement(Link)}>https://link.com</div>
        <hr />
        <div className='list' onClick={() => addElement(List)}>
          <div className='dots'>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <ul>
            <strong><em>List1</em></strong>
            <li>Item1</li>
            <li>Item2</li>
          </ul>
        </div>
      </div>
      <div className='sideElementsBar right'>
        
        <div className='dots rightDots'>
            <div></div>
            <div></div>
            <div></div>
          </div>
      </div>
      <div className='editorContainer'>
        <div className='editor' style={editorStyle} id={`editor ${currentPage}`} ref={editorRef} onContextMenu={(e) => changeStyle(editorRef.current.id, e)}>
         {elements.map((el) => (
          el.page === currentPage &&
            (<div
              key={el.id}
              onMouseDown={(e) => handleDragStart(el.id, e)}
              onContextMenu={(e) => changeStyle(el.id, e)}
            >
              {el.component}
            </div>)
          ))}
        </div>
      </div>
      <dialog ref={dialogRef} className="custom-dialog">
  <header className="dialog-header">
    <h3>Customize</h3>
    <i onClick={closeDialog} className="close-icon">✖</i>
  </header>
  <form onSubmit={handleSubmit} className="dialog-form">
    <label htmlFor="content">Content:</label>
    <input type="text" name="content" id="content" />
    
    <label htmlFor="imageContent">Select Image:</label>
    <input type="file" name="imageContent" id="imageContent" />
    
    <label htmlFor="width">Width:</label>
    <div>
      <input type="number" id="width" name="width" min={1} defaultValue={100} max={1280} required/>
      <button className='maxWidth' onClick={setWidthMax}>Max</button>
    </div>
    
    <label htmlFor="height">Height:</label>
    <input type="number" name="height" id="height" min={1} defaultValue={100} required/>
    
    <label htmlFor="fontSize">Font Size:</label>
    <input type="number" name="fontSize" id="fontSize" min={1} defaultValue={14}/>
    
    <label htmlFor="fontColor">Font Color:</label>
    <input type="color" name="fontColor" id="fontColor" defaultValue="#ffffff" />
    
    <label htmlFor="bgColor">Background Color:</label>
    <input type="color" name="bgColor" id="bgColor" />
    
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
  );
}
