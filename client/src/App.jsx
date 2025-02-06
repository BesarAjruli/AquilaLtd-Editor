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
import Loading from './Components/Loading';
import ExtraInput from './Components/Dialogs/ExtraInput'

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
  const iconsDialog = useRef(null)
  const [iconConent, setIconName] = useState(null)
  const [userId, setUserId] = useState(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const extraInptRef = useRef(null)
  const SNAP_THRESHOLD = 10;
  const GRID_SIZE = 50;

  const uniqueId = () => `element-${Date.now()}-${Math.random()}`;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const mediaQuery = window.matchMedia('(max-width: 768px)');

  useEffect(() => {
    async function getUser() {
    try{
      const response = await fetch(`${backendUrl}/api`,{method: 'GET', credentials: 'include'});
      if (!response.ok) {
        console.error('Network response was not ok', response.statusText);
        setLoading(false)
        return;
      }
        setLoading(false)
        const data = await response.json();
        setUserId(data.user.id)
    } catch(error){
      setLoading(false)
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
      dialogRef.current.querySelector('#hiddenContent').setAttribute('disabled', 'true')
      dialogRef.current.querySelector('.advSettings').style.display = 'none'

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
        dialogRef.current.querySelector('#hiddenContent').removeAttribute('disabled')
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

      const parentCenterX = parentRect.width / 2;
      const parentCenterY = parentRect.height / 2;
  
      let newX = clientX - offsetX;
      let newY = clientY - offsetY;

      // Snapping to Grid
      const snapX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
      const snapY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

      if (Math.abs(newX - snapX) < SNAP_THRESHOLD) newX = snapX;
      if (Math.abs(newY - snapY) < SNAP_THRESHOLD) newY = snapY;
  
      // Ensure element stays within parent boundaries
      newX = Math.max(0, Math.min(newX, parentRect.width - rect.width));
      newY = Math.max(0, Math.min(newY, parentRect.height - rect.height));

      // Alignment Guides
    const guides = [];
    elements.forEach((el) => {
      const elLeft = parseInt(el.style.left) || 0;
      const elTop = parseInt(el.style.top) || 0;

      if (Math.abs(elLeft - newX) < SNAP_THRESHOLD) {
        newX = elLeft;
        guides.push({ type: 'vertical', position: elLeft });
      }
      if (Math.abs(elTop - newY) < SNAP_THRESHOLD) {
        newY = elTop;
        guides.push({ type: 'horizontal', position: elTop });
      }

    });

    // Algiment guides for middle of page
    if (Math.abs(newX + rect.width / 2 - parentCenterX) < SNAP_THRESHOLD) {
      newX = parentCenterX - rect.width / 2;
      guides.push({ type: 'vertical', position: parentCenterX });
    }
    if (Math.abs(newY + rect.height / 2 - parentCenterY) < SNAP_THRESHOLD) {
      newY = parentCenterY - rect.height / 2;
      guides.push({ type: 'horizontal', position: parentCenterY });
    }
    

    renderGuides(guides);
  
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

      clearGuides();
      saveHistory(elements);
      cancelPress()
    };
  
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', move);
    document.addEventListener('touchend', endDrag);

    document.addEventListener('touchmove', preventScroll, { passive: false });
  };

  // Helper functions to render and clear guides
const renderGuides = (guides) => {
  const guideContainer = document.getElementById('guide-container') || createGuideContainer();

  guideContainer.innerHTML = '';
  guides.forEach((guide) => {
    const line = document.createElement('div');
    line.className = `guide ${guide.type}`;
    line.style.position = 'absolute';
    line.style.backgroundColor = 'rgba(0, 123, 255, 0.5)';
    line.style.zIndex = '999';

    if (guide.type === 'vertical') {
      line.style.left = `${guide.position}px`;
      line.style.top = '0';
      line.style.height = '100%';
      line.style.width = '1px';
    } else {
      line.style.top = `${guide.position}px`;
      line.style.left = '0';
      line.style.width = '100%';
      line.style.height = '1px';
    }

    guideContainer.appendChild(line);
  });
};

const clearGuides = () => {
  const guideContainer = document.getElementById('guide-container');
  if (guideContainer) guideContainer.innerHTML = '';
};

const createGuideContainer = () => {
  const container = document.createElement('div');
  container.id = 'guide-container';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  editorRef.current.appendChild(container);
  return container;
};

  const changeStyle = (id, e) => {
    e.preventDefault()
    e.stopPropagation();
    dialogRef.current.querySelector('#hiddenContent').setAttribute('disabled', 'true')
    dialogRef.current.querySelector('#width').removeAttribute('disabled')
    dialogRef.current.querySelector('#height').removeAttribute('disabled')
    dialogRef.current.querySelector('#autoW').value = 0
    dialogRef.current.querySelector('#autoH').value = 0
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
    if(e.target.children[0] && e.target.children[0].tagName === 'UL'){
      dialogRef.current.querySelector('.advSettings').style.display = 'block'
      extraInptRef.current.querySelector('#cols').setAttribute('disabled', 'true')
    } else{
      dialogRef.current.querySelector('.advSettings').style.display = 'none'
      extraInptRef.current.querySelector('#cols').removeAttribute('disabled')
      extraInptRef.current.querySelector('#rows').value = 2
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
    setLoading(true)
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
      const formDataList = [];
      for (const base64Image of savedImages) {
        const blob = await (await fetch(base64Image)).blob();
        const file = new File([blob], `design-image-${formDataList.length}.png`, { type: 'image/png' });
        const formData = new FormData();
        formData.append('image', file);
        
        formDataList.push(formData);
        editorRef.current.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
      }
      setLoading(false)
      return formDataList[formDataList.length - 1]
    } else {
      for (const [index, image] of savedImages.entries()) { 
        const blob = await (await fetch(image)).blob();
        const file = new File([blob], `editor-${index + 1}.png`, { type: 'image/png'});

        const formData = new FormData()
        formData.append('userId', userId)
        formData.append('image', file);

        const result = await fetch(`${backendUrl}/api/to-do`, {
          method: 'POST',
          body: formData
        })
        if (!result.ok) {
          console.error(`Upload failed for page ${index + 1}`);
        }
        editorRef.current.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
      setLoading(false)
      };
      
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
    saveTempRef.current.close()
    setLoading(true)
    if(userId){
    const editorStyle = getStyleAsObject(editorRef.current)
    const serialized = serializeTemplate(elements, editorStyle);
    const formData = await saveDesign(currentPage, true)

    formData.append('userId', userId)

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
        setLoading(false)
      } else{
        alert('Failed')
        setLoading(false)
      }
      
    }).catch(error => {
      alert(`Failed ${error}`)
      setLoading(false)
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
          case 'Icons':
            Component = Icons;
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
    templatesRef.current.close();
    setLoading(true)
    let serialized = '';
    await fetch(`${backendUrl}/api/saveTemplate`)
      .then((response) => response.json())
      .then((data) => {
        serialized = JSON.parse(data[templateNr].template);
        setLoading(false)
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
  return (
    <>
      {loading && <Loading/>}
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
      duplicate={duplicate} closeDialog={closeDialog} handleImageChange={handleImageChange} 
      deleteElement={deleteElement} currentElement={currentElement} chngStyle={chngStyle}
      extraEditor={extraInptRef} elements={elements}
       imageSrc={imageSrc} currentPage={currentPage} setImageSrc={setImageSrc} setElements={setElements} saveHistory={saveHistory}
       setChangingStyle={setChangingStyle} setCurrentElement={setCurrentElement} iconsDialog={iconsDialog}/>

      <SaveTemplateDialog ref={saveTempRef} saveTemplate={(elements, e) => saveTemplate(elements, e)} elements={elements}/>

      <IconsSelector ref={iconsDialog} addElement={() => addElement(Icons)} 
        sendIconName={(value) => setIconName(value)}/>

      <ExtraInput ref={extraInptRef} currentElement={currentElement}/>
    </>
  );
}
