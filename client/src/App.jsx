import React, { useState, useRef, useEffect } from 'react';
import './style/style.css';
import html2canvas from 'html2canvas'
import { useNavigate } from "react-router-dom";
import SaveTemplateDialog from './Components/Dialogs/saveTemplate'
import EditorDialog from './Components/Dialogs/editComponents';
import SelectTemplate from './Components/Dialogs/selectTemplate';
import IconsSelector from './Components/Dialogs/iconsSelector';
import { Icon } from '@iconify-icon/react';
import Toolbar from './Components/Toolbar';


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
const Icons = ({style, content}) => <Icon className='edit' icon={`mdi-light:${content}`} style={style}/>

export default function App() {
  const [elements, setElements] = useState([]);
  const dialogRef = useRef(null)
  const [currentElement, setCurrentElement] = useState(null)
  const [chngStyle, setChangingStyle] = useState(false)
  const [history, setHistory] = useState([[]]); 
  const [historyIndex, setHistoryIndex] = useState(0);
  const editorRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [imageSrc, setImageSrc] = useState(null);
  const templatesRef = useRef(null)
  const saveTempRef = useRef(null)
  const [layer, setLayer]= useState(null)
  const iconsDialog = useRef(null)
  const [iconConent, setIconName] = useState(null)
  const [userId, setUserId] = useState(null)
  const navigate = useNavigate()

  const uniqueId = () => `element-${Date.now()}-${Math.random()}`;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const mediaQuery = window.matchMedia('(max-width: 768px)');

  useEffect(() => {
    async function getUser() {
    try{
      const response = await fetch(`${backendUrl}/api`,{method: 'GET', credentials: 'include'});
      if (!response.ok) {
        console.error('Network response was not ok', response.statusText);
        return;
      }
        const data = await response.json();
        setUserId(data.user.id)
    } catch(error){
      console.error(error)
    }}
    getUser()
  },[])

  let editorStyle = {
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
if(mediaQuery.matches){
  editorStyle.width = '300px'
  editorStyle.height = '600px'
}

  //History (undo/redo functions)
  const saveHistory = (newElements) => {
    const newHistory = history.slice(0, historyIndex + 1); // Truncate redo history
    setHistory([...newHistory, newElements]);
    setHistoryIndex(newHistory.length);
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
      dialogRef.current.querySelector('#height').removeAttribute('disabled')
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
      case 'Icons':
        dialogRef.current.querySelector('#content').value = iconConent
        dialogRef.current.querySelector('#hiddenContent').value = iconConent
        dialogRef.current.querySelector('#content').setAttribute('disabled', 'true')
        dialogRef.current.querySelector('#width').setAttribute('disabled', 'true')
        dialogRef.current.querySelector('#height').setAttribute('disabled', 'true')
        dialogRef.current.querySelector('#fontSize').value = 50
        break;
      default:
        dialogRef.current.querySelector('#width').value = 100
        dialogRef.current.querySelector('#height').value = 50
    }

    dialogRef.current.querySelector('.duplicate').style.display = 'none'
    dialogRef.current.querySelector('.layersCOntainer').style.display = 'none'

    dialogRef.current.showModal()
    }
  };

  const handleDragStart = (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    const longClickThreshold = 500;
  let pressTimer;
  let isLongClick = false;

    const elementIndex = elements.findIndex((el) => el.id === id);
    const crntElement = elements[elementIndex];

    if (elementIndex === -1) return;

    const element = e.target
    const rect = element.getBoundingClientRect();

    const startPress = () => {
      pressTimer = setTimeout(() => {
        isLongClick = true;
        changeStyle(id, e)
      }, longClickThreshold);
    };
  
    const cancelPress = () => {
      clearTimeout(pressTimer);
    };

    if(mediaQuery.matches){
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
    const preventScroll = (scrollEvent) => {
      scrollEvent.preventDefault();
    };

    let offsetX = (e.clientX || e.touches[0].clientX) - rect.left;
    let offsetY = (e.clientY || e.touches[0].clientY) - rect.top;
    
    element.classList.add('dragging')

    startPress()
  
    const move = (moveEvent) => {
      moveEvent.preventDefault()
      cancelPress()
      const clientX = moveEvent.clientX || moveEvent.touches[0].clientX;
      const clientY = moveEvent.clientY || moveEvent.touches[0].clientY;
  
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

      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', endDrag);

      document.removeEventListener('touchmove', preventScroll);

      saveHistory(elements);
      cancelPress()
    };
  
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', move);
    document.addEventListener('touchend', endDrag);

    document.addEventListener('touchmove', preventScroll, { passive: false });
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
        left: currentElement.id.startsWith('editor') && chngStyle.changing === true ? 0 : currentElement.style.left || 0,
        top: currentElement.id.startsWith('editor') ? 0 : currentElement.style.top || 0,
        zIndex: chngStyle.changing ? layer ? layer : currentElement.style.zIndex : elements.length ,
        opacity: data.opacity / 100
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
        setLayer(null)
        }
    e.target.reset()
    closeDialog()
    iconsDialog.current.close()
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
      if(e.target.tagName === 'ICONIFY-ICON'){
        dialogRef.current.querySelector('#content').setAttribute('disabled', 'true')
        dialogRef.current.querySelector('#width').setAttribute('disabled', 'true')
        dialogRef.current.querySelector('#height').setAttribute('disabled', 'true')
    } else {
      dialogRef.current.querySelector('#content').removeAttribute('disabled')
      dialogRef.current.querySelector('#width').removeAttribute('disabled')
      dialogRef.current.querySelector('#height').removeAttribute('disabled')
    }
      dialogRef.current.querySelector('#borderWidth').removeAttribute('disabled')
      dialogRef.current.querySelector('#borderRadius').removeAttribute('disabled')
      dialogRef.current.querySelector('#fontSize').removeAttribute('disabled')
      dialogRef.current.querySelector('#imageContent').removeAttribute('disabled')
      dialogRef.current.querySelector('.deleteButton').removeAttribute('disabled')
      const elementToUpdate = elements.find(element => element.id === id);
      dialogRef.current.querySelector('.duplicate').style.display = 'block'
      dialogRef.current.querySelector('.layersCOntainer').style.display = 'flex'
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
    if(mediaQuery.matches){
      dialogRef.current.querySelector('#width').value = 300 
    } else {
      dialogRef.current.querySelector('#width').value = 1280 
    }
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

  const saveDesign = async (totalPages, template = false) => {
    const savedImages = [];
    const originalPage = currentPage;
  
    for (let page = 1; page <= totalPages; page++) {
      setCurrentPage(page); 
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for React to render the page
  
      editorRef.current.style.boxShadow = ''; // Temporarily remove shadow cause it messes with the images
  
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
      savedImages.push(base64Image);
  
      editorRef.current.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
    }
  
    setCurrentPage(originalPage);
  
    if (template) {
      for (const base64Image of savedImages) {
        const blob = await (await fetch(base64Image)).blob();
        const file = new File([blob], 'design-image.png', { type: 'image/png' });
        const formData = new FormData();
        formData.append('image', file);
        
        editorRef.current.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';

        return formData
      }
    } else {
      savedImages.forEach((image, index) => {
        const link = document.createElement('a');
        link.download = `editor-${index + 1}.png`;
        link.href = image;
        link.click();
      });
    }
  };

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

  const serializeTemplate = (elements, editorStyle) => {
    return {
      editorStyle,
      elements: elements.map(({ id, style, component }) => ({
      id,
      style,
      type: component.type.name,
      content: component.props.content,
    }))
  }
  };

  const saveTemplate = async (elements, e) => {
    e.preventDefault()
    console.log(userId)
    if(userId){
      console.log(userId)
    const editorStyle = getStyleAsObject(editorRef.current)
    const serialized = serializeTemplate(elements, editorStyle);
    const formData = await saveDesign(1, true)
    const saveTempFormData = new FormData(e.target)
    const data = Object.fromEntries(saveTempFormData.entries())

    formData.append('template', JSON.stringify(serialized));

    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    
    fetch(`${backendUrl}/api/saveTemplate`, {
      method: 'POST',
      body: formData
    }).then((response) => {
      if(response.ok){
        alert('Success')
        saveTempRef.current.close()
      }
    })
  } else{
    navigate('/signup')
  }
  };

  const deserializeTemplate = (serializedData) => {
    const { editorStyle, elements } = JSON.parse(serializedData); 
  
    const deserializedElements = elements.map(({ id, style, type, content }) => {
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
  
    return { editorStyle, deserializedElements }; 
  };
  
  const loadTemplate = async (templateNr) => {
    let serialized = '';
    await fetch(`${backendUrl}/api/saveTemplate`)
      .then((response) => response.json())
      .then((data) => {
        serialized = JSON.parse(data[templateNr].template);
      });
  
    const { editorStyle, deserializedElements } = deserializeTemplate(serialized);
  
    const newElements = deserializedElements.map((element) => {
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
  
    setElements((prevElements) => {
      const allElements = [...prevElements, ...newElements];
      saveHistory(allElements);
      return allElements;
    });
  
      Object.keys(editorStyle).forEach(key => {
       editorRef.current.style[key] = editorStyle[key];
      });
  
    templatesRef.current.close();
  };
  
  const getStyleAsObject = (element) => {
    const computedStyle = window.getComputedStyle(element);
    return Array.from(computedStyle).reduce((styleObj, property) => {
      styleObj[property] = computedStyle.getPropertyValue(property);
      return styleObj;
    }, {});
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
// editor only
const handleMobileContextMenu = (id, e) => {
  e.preventDefault()
  let pressTimer; 
  let isLongClick = false;

  const startPress = () => {
    pressTimer = setTimeout(() => {
      isLongClick = true;
      changeStyle(id, e);
    }, 500);
  };

  const cancelPress = () => {
    clearTimeout(pressTimer);
  };

  e.target.addEventListener('touchend', cancelPress);
  e.target.addEventListener('touchcancel', cancelPress);

  startPress();
}

const bringForward = () => {
  let layers = layer ? layer : currentElement.style.zIndex
  if(layers !== elements.length){
  dialogRef.current.querySelectorAll('.layers')[1].style.cursor = 'default'
    setLayer(layers+=1)
  }else {
    dialogRef.current.querySelectorAll('.layers')[1].style.cursor = 'not-allowed'
  }
}

const sendBackward = () => {
  let layers = layer? layer : currentElement.style.zIndex
  if(layers !== 0){
    dialogRef.current.querySelectorAll('.layers')[0].style.cursor = 'default'
    setLayer(layers-=1)
  }else {
    dialogRef.current.querySelectorAll('.layers')[0].style.cursor = 'not-allowed'
  }
}

  return (
    <>
      <Toolbar 
       historyIndex={historyIndex} saveDesign={saveDesign}
       saveTempRef={saveTempRef} templatesRef={templatesRef}
       currentPage={currentPage} setCurrentPage={setCurrentPage}
       history={history} setHistoryIndex={setHistoryIndex} 
       setElements={setElements} editorRef={editorRef}/>
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
        <div title='Icons' onClick={() => iconsDialog.current.showModal()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
	          <path fill="currentColor" d="M5 13v-1h6V6h1v6h6v1h-6v6h-1v-6z" />
          </svg>
        </div>

        <div className='dots rightDots'>
            <div></div>
            <div></div>
            <div></div>
          </div>
      </div>
      <div className='editorContainer'>
        <div 
        className='editor'
        style={editorStyle}
        id={`editor ${currentPage}`} 
        ref={editorRef}
        onContextMenu={(e) => changeStyle(editorRef.current.id, e)}
        onTouchStart={(e) => handleMobileContextMenu(editorRef.current.id, e)}
        >
         {elements.map((el) => (
          el.page === currentPage &&
            (<div
              key={el.id}
              onMouseDown={(e) => handleDragStart(el.id, e)} 
              onContextMenu={(e) => changeStyle(el.id, e)}
              onTouchStart={(e) => handleDragStart(el.id, e)} 
            >
              {el.component}
            </div>)
          ))}
        </div>
      </div>
      <SelectTemplate ref={templatesRef} loadTemplate={(e) => loadTemplate(e)}/>
      <EditorDialog ref={dialogRef} mediaQuery={mediaQuery}
      duplicate={duplicate} closeDialog={closeDialog} handleSubmit={handleSubmit}
       handleImageChange={handleImageChange} setWidthMax={setWidthMax} deleteElement={deleteElement}
       bringForward={bringForward} sendBackward={sendBackward}/>
      <SaveTemplateDialog ref={saveTempRef} saveTemplate={(elements, e) => saveTemplate(elements, e)} elements={elements}/>
      <IconsSelector ref={iconsDialog} addElement={() => addElement(Icons)} 
        sendIconName={(value) => setIconName(value)}/>
    </>
  );
}
