import React, { useState, useRef } from 'react';
import './style/style.css';
import html2canvas from 'html2canvas'
import Thumbnails from './Templates/templatesThumbnail'
import Icon from '@mdi/react';
import { mdiContentCopy } from '@mdi/js';

const Text = ({style, content}) => <span className='edit' style={style}>{content}</span>;
const Button = ({style, content}) => <button className='edit' style={style}>{content}</button>;
const Input = ({style, content}) => <input className='edit' style={style} type="text" placeholder={content}/>;
const ImageCmp = ({style, content}) => <img className='edit' style={style} src={content || "https://img.icons8.com/skeuomorphism/64/image.png"} alt="Picture" />;
const Video = ({style}) => <img className='edit' style={style} src="https://img.icons8.com/skeuomorphism/64/video.png" alt="Video" />;
const Audio = ({style}) => <img className='edit' style={style} src="https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-sound-waves-equalizer-audio-radio-signal-music-recording-vector-png-image_6678910.png" alt="audio" />;
const Gallery = ({style}) => <img className='edit' style={style} src="https://t3.ftcdn.net/jpg/04/19/92/88/360_F_419928833_w7HrdbjTCl1zGIBY1YljW6feoWx90ETm.jpg" alt="Gallery" />;
const Section = ({style}) => <div className='edit' style={style}></div>;
const Link = ({style, content}) => <a className='edit' style={style}>{content}</a>;
const List = ({style}) => {return (
  <div className='edit' style={style}>
    <ul style={{pointerEvents: 'none'}}>
      <strong><em>List1</em></strong>
      <li>Item1</li>
      <li>Item2</li>
    </ul>
  </div>
);}
const Pie = ({style}) => <img className='edit' style={style} src='https://img.icons8.com/skeuomorphism/64/pie-chart.png'/>
const Charts = ({style}) => <img className='edit' style={style} src='https://img.icons8.com/skeuomorphism/64/bar-chart.png'/>
const Menu = ({style}) => <img className='edit' style={style} src='https://img.icons8.com/material-rounded/64/menu--v1.png'/>


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
  const [imageSrc, setImageSrc] = useState(null);
  const templatesRef = useRef(null)

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

  const addElement = (Component) => {
    const id = uniqueId();
    const newElement = {
      id,
      component: <Component key={id} style={{}} content='' />,
      style: {},
      page: currentPage,
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

    if( type === 'ImageCmp'){
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

    switch(type){
      
      case 'Button': 
      dialogRef.current.querySelector('#height').value = 30
      dialogRef.current.querySelector('#bgColor').value = '#94c3df'
      dialogRef.current.querySelector('#fontColor').value = '#ffffff'
      break;
      case 'Input': 
      dialogRef.current.querySelector('#width').value = 120
      dialogRef.current.querySelector('#height').value = 25
      dialogRef.current.querySelector('#bgColor').value = '#e9e0e9'
      dialogRef.current.querySelector('#borderWidth').value = 1
      dialogRef.current.querySelector('#borderRadius').value = 15
      dialogRef.current.querySelector('#borderColor').value = '#c2c2c2';
      break;
      case 'Link':
        dialogRef.current.querySelector('#fontColor').value = '#0000EE';
        break;
      case 'Menu':
        dialogRef.current.querySelector('#width').value = 30
        dialogRef.current.querySelector('#height').value = 30
        break;

      default:
        dialogRef.current.querySelector('#width').value = 100
        dialogRef.current.querySelector('#height').value = 50
    }

    dialogRef.current.querySelector('.duplicate').style.display = 'none'

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
        }
    e.target.reset()
    closeDialog()
  }

  const changeStyle = (id, e) => {
    e.preventDefault()
    e.stopPropagation();
    if(e.target.tagName === 'IMG'){
      dialogRef.current.querySelector('#content').style.display = 'none'
      dialogRef.current.querySelector('label[for="content"]').style.display = 'none'
      dialogRef.current.querySelector('label[for="imageContent"]').style.display = 'block'
      dialogRef.current.querySelector('#imageContent').style.display = 'block'
      setImageSrc(e.target.src)
    } else{
      dialogRef.current.querySelector('#imageContent').style.display = 'none'
      dialogRef.current.querySelector('label[for="imageContent"]').style.display = 'none'
      dialogRef.current.querySelector('#content').style.display = 'block'
      dialogRef.current.querySelector('label[for="content"]').style.display = 'block'
      dialogRef.current.querySelector('#content').value = e.target.textContent
    }
    if(e.target.tagName === 'INPUT'){
      dialogRef.current.querySelector('#content').value = e.target.placeholder
    }
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
      dialogRef.current.querySelector('.duplicate').style.display = 'block'
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

  const saveDesign = async (template = false) => {
    editorRef.current.style.boxShadow = '';
    
    const images = editorRef.current.querySelectorAll('img');
    const promises = Array.from(images).map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
        }
      });
    });
  
    await Promise.all(promises);
  
    const canvas = await html2canvas(editorRef.current, { useCORS: true });
    const base64Image = canvas.toDataURL('image/png');
  
    if (template) {
      const blob = await (await fetch(base64Image)).blob();
      const file = new File([blob], 'design-image.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('image', file);
  
      editorRef.current.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
  
      return formData;
    } else {
      const link = document.createElement('a');
      link.download = 'div-image.png';
      link.href = base64Image;
      link.click();
  
      editorRef.current.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
    }
  };
  
  const addNewPage = () => {
    setPage((prevPages) => {
      const nextPage = parseInt(prevPages) + 1;
      setCurrentPage(nextPage);
      return nextPage;
    });
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          dialogRef.current.querySelector('#width').value = img.naturalWidth;
          dialogRef.current.querySelector('#height').value = img.naturalHeight ;
          }; // Get original dimensions
        img.src = e.target.result
        setImageSrc(e.target.result); // Set the image source to the data URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const serializeTemplate = (elements) => {
    return elements.map(({ id, style, component }) => ({
      id,
      style,
      type: component.type.name,
      content: component.props.content,
    }));
  };

  const saveTemplate = async (elements) => {
    const serialized = serializeTemplate(elements);
    const formData = await saveDesign(true)

    formData.append('template', JSON.stringify(serialized));
    
    fetch("http://localhost:5000/api/saveTemplate", {
      method: 'POST',
      body: formData
    }).then((response) => {
      if(response.ok){
        alert('Success')
      }
    })
  };

  const deserializeTemplate = (serializedElements) => {
  return serializedElements.map(({ id, style, type, content }) => {
    let Component;

    // Dynamically select the component based on the type
    switch (type) {
      case 'Text':
        Component = Text;
        break;
      case 'Button':
        Component = Button;
        break;
      case 'Input':
        Component = Input;
        break;
      case 'ImageCmp':
        Component = ImageCmp;
        break;
      case 'Video':
        Component = Video;
        break;
      case 'Audio':
        Component = Audio;
        break;
      case 'Gallery':
        Component = Gallery;
        break;
      case 'Section':
        Component = Section;
        break;
      case 'Link':
        Component = Link;
        break;
      case 'List':
        Component = List;
        break;
      case 'Pie':
        Component = Pie;
        break;
      case 'Charts':
        Component = Charts;
        break;
      case 'Menu':
        Component = Menu;
        break;
      default:
        throw new Error(`Unknown component type: ${type}`);
    }

    return {
      id,
      style,
      component: (
        <Component key={id} style={style} content={content} />
      ),
    };
  });
};

 const loadTemplate = async (templateNr) => {
  let serialized = ''
  await fetch('http://localhost:5000/api/saveTemplate')
  .then((response) => response.json())
  .then((data => {
   serialized = JSON.parse(data[templateNr].template)
  }))
  const deserializedElements = deserializeTemplate(JSON.parse(serialized));
  
  const newElements = deserializedElements.map(element => {
    const updatedElement = {
      ...element,
      style: element.style,
      component: React.cloneElement(element.component, {
        style: element.style, 
        content: element.component.props.content,
      }),
      page: currentPage,
    };
    return updatedElement;
  });

  setElements(prevElements => {
    const allElements = [...prevElements, ...newElements];
    saveHistory(allElements); 
    return allElements;
  });

  templatesRef.current.close();
};

const duplicate = () => {
  const updatedElement = {
    ...currentElement,
    style: currentElement.style,
    component: React.cloneElement(currentElement.component, { style: currentElement.syle, content:  currentElement.component.props.content }),
    page: currentPage,
    id: uniqueId()
  };
  const newElements =  [...elements, updatedElement];
  setElements(newElements);
  saveHistory(newElements);
  setChangingStyle(false);
  setCurrentElement(null);

  closeDialog()
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
        <button onClick={() => saveDesign(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" /></svg>
        </button>
        </div>
        <button onClick={() => saveTemplate(elements)}>Save template</button>

        <button onClick={() => templatesRef.current.showModal()}>Use templates</button>
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
        <div className='text' title='Text' onClick={() => addElement(Text)}>Text</div>
        <hr />
        <div className='button' title='Button' onClick={() => addElement(Button)}><button>Button</button></div>
        <hr />
        <div className='input' title='Input' onClick={() => addElement(Input)}><span>|</span></div>
        <hr />
        <div className='image' title='Image' onClick={() => addElement(ImageCmp)}><img src="https://img.icons8.com/skeuomorphism/64/image.png" alt="image" /></div>
        <hr />
        <div className='video' title='Video' onClick={() => addElement(Video)}><img src="https://img.icons8.com/skeuomorphism/64/video.png" alt="video" /></div>
        <hr />
        <div className='audio' title='Audio' onClick={() => addElement(Audio)}><img src="https://img.icons8.com/skeuomorphism/64/circled-play.png" alt="audio" /></div>
        <hr />
        <div className='gallery' title='Gallery' onClick={() => addElement(Gallery)}><img src="https://img.icons8.com/skeuomorphism/64/stack-of-photos.png" alt="gallery" /></div>
        <hr />
        <div className='section' title='Section (Header,footer...)' onClick={() => addElement(Section)}></div>
        <hr />
        <div className='link' title='Link' onClick={() => addElement(Link)}>https://link.com</div>
        <hr />
        <div className='list' title='List' onClick={() => addElement(List)}>
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
        <div title='Pie Charts' onClick={() => addElement(Pie)}><img src="https://img.icons8.com/skeuomorphism/64/pie-chart.png" alt="pie chart" /></div>
        <div title='Charts' onClick={() => addElement(Charts)}><img src="https://img.icons8.com/skeuomorphism/64/bar-chart.png" alt="charts" /></div>
        <div title='Menu' onClick={() => addElement(Menu)}><img src="https://img.icons8.com/material-rounded/64/menu--v1.png" alt="more menu" /></div>

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
      <dialog ref={templatesRef} className='templateDialog'>
          <div className='tmeplateDiv'>
            <Thumbnails onThumbnailClick={(e) => loadTemplate(e)}/>
          </div>
      </dialog>
      <dialog ref={dialogRef} className="custom-dialog">
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
      <input type="number" id="width" name="width" min={1} defaultValue={100} max={1280} required/>
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
  );
}
