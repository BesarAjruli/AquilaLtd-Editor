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
import { Rnd } from "react-rnd";
import CodeEditor from './Components/Dialogs/codeEditor';

const Text = ({style, content}) => <span className='edit' style={style}>{content}</span>;
Text.displayName = 'Text'
const Button = ({style, content}) => <button className='edit' style={style}>{content}</button>;
Button.displayName = 'Button'
const Input = ({style, content}) => <input className='edit' style={style} type="text" placeholder={content}/>;
Input.displayName = 'Input'
const ImageCmp = ({style, content}) => <img className='edit' style={style} src={content || "https://img.icons8.com/skeuomorphism/64/image.png"} alt="Picture" />;
ImageCmp.displayName = 'ImageCmp'
const Video = ({style}) => <img className='edit' style={style} src="https://play-lh.googleusercontent.com/lVNP5YVLH630fs0oQunDStVjtZBmV3ZGyjvH1MOj6xINVBmxJyNszQx2_ky6_5GBLkH5=w526-h296-rw" alt="Video" />;
Video.displayName = 'Video'
const Audio = ({style}) => <img className='edit' style={style} src="https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-sound-waves-equalizer-audio-radio-signal-music-recording-vector-png-image_6678910.png" alt="audio" />;
const Gallery = ({style}) => <img className='edit' style={style} src="https://t3.ftcdn.net/jpg/04/19/92/88/360_F_419928833_w7HrdbjTCl1zGIBY1YljW6feoWx90ETm.jpg" alt="Gallery" />;
const Section = ({style}) => <div className='edit' style={style}></div>;
const Link = ({style, content}) => <a className='edit' style={style}>{content}</a>;
Link.displayName = 'Link'
const List = ({style, content}) => { 
  const listItems = JSON.parse(content)
  return (
  <div className='edit' style={style}>
    <ul style={{pointerEvents: 'none'}}>
      <strong><em>List</em></strong>
      {listItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
    </ul>
  </div>
);}
List.displayName = 'List'
const Pie = ({style}) => <img className='edit' style={style} src='https://img.icons8.com/skeuomorphism/64/pie-chart.png'/>
const Charts = ({style}) => <img className='edit' style={style} src='https://img.icons8.com/skeuomorphism/64/bar-chart.png'/>
const Menu = ({style}) => <img className='edit' style={style} src='https://img.icons8.com/material-rounded/64/menu--v1.png'/>
const Icons = ({style, content}) => <Icon className='edit' icon={`mdi-light:${content}`} style={style}/>
Icons.displayName = 'Icons'
const Table = ({style, content}) => {
  const tableItems = JSON.parse(content)
  return(
    <div className='edit' style={style}>
      <table border={1} style={{pointerEvents: 'none'}}>
      <thead>
          <tr>
            {tableItems[0]?.map((header, colIndex) => (
              <th key={colIndex}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableItems.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((_, colIndex) => (
                <td key={colIndex}>&nbsp;</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
Table.displayName = 'Table'
const Calendar = ({style}) => <img className='edit' style={style} src="https://www.figma.com/community/resource/e155ded4-5d35-4474-93ef-a8c53f619ca3/thumbnail" alt="calendar" />
Calendar.displayName = 'Calendar'

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
  const [listItems, setListItems] = useState(["Item1", "Item2"]);
  const [tableItems, setTableData] = useState([
    ["Item1", "Item2"],
    ["", ""],
    ["", ""] 
  ]);
  const [shouldRunEffect, setShouldRunEffect] = useState(false);
  const injectCssRef = useRef(null)
  const [alignmentLines, setAlignmentLines] = useState([]);

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
        console.log(data)
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

  const handleDragStart = (elId, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const longClickThreshold = 500; // Set long click threshold to 500ms
    let pressTimer;
    let isLongClick = false;

    e.target.classList.add('dragging')
  
    const startPress = () => {
      pressTimer = setTimeout(() => {
        isLongClick = true;
        changeStyle(elId, e); // Call changeStyle only on long click
      }, longClickThreshold);
    };
  
    const cancelPress = () => {
      clearTimeout(pressTimer);
      if (isLongClick) {
        // If long click was detected, cancel it
        isLongClick = false;
      }
    };
  
    // Start detecting the press on mouse down or touch start
    e.preventDefault(); // Prevent default behavior to avoid conflicts with dragging
    startPress();
  
    // Cancel long press if mouse or touch moves
    const handleMove = (e) => {
      cancelPress();
    };
  
    // Listen for mouse/touch move and cancel long press
    const handleEnd = () => {
      cancelPress();
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  
    // Add move and end event listeners to detect dragging
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  
    // Clean up on drag end (mouse/touch)
    const cleanup = () => {
      cancelPress();
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  
    // Attach cleanup on drag end
    e.target.addEventListener('dragend', cleanup);
  };

  const hanldeDrag = (e, d, id) => {
    if(e.target.className !== 'edit dragging') return

    //const draggingElm = elements.find(e => e.id === id);

    setElements(prevElements => {
      const updatedElements = prevElements.map(el => {
        if (el.id === id) {
          return { ...el, x: d.x, y: d.y };
        }
        return el;
      });
  
      const draggingElm = updatedElements.find(e => e.id === id);
      if (!draggingElm) return prevElements;

      let newLines = [];
  
      updatedElements.forEach(el => {
        const elCenterX = el.x + parseFloat(el.style.width) / 2;
        const elCenterY = el.y + parseFloat(el.style.height) / 2;

        const editorRect = editorRef.current.getBoundingClientRect();
        const editorCenterX = editorRect.width / 2;
        const editorCenterY = editorRect.height / 2;

        if (Math.abs(elCenterX - editorCenterX) < 15) { // 5px tolerance
          newLines.push({ x: editorCenterX, y: 0, height: '100%', type: 'vertical' });
        }
    
        if (Math.abs(elCenterY - editorCenterY) < 15) {
          newLines.push({ x: 0, y: editorCenterY, width: '100%', type: 'horizontal' });
        }

        if (el.id === draggingElm.id) return;

        if (el.x === draggingElm.x) {
          newLines.push({ x: elCenterX, y: el.y, width: el.width, type: 'vertical' });
        }
        if (el.y === draggingElm.y) {
          newLines.push({ x: el.x, y: elCenterY, height: el.height, type: 'horizontal' });
        }
      });
  
      setAlignmentLines(newLines.length > 0 ? newLines : []);
            return updatedElements;
    });
  }

  const handleDragStop = (elId, e, data) => {
    // Update the element's position
    const updatedElements = elements.map((el) =>
      el.id === elId ? { ...el, x: data.x, y: data.y } : el
    );
    
    e.target.classList.remove('dragging')

    setAlignmentLines([])
    setElements(updatedElements);
    saveHistory(updatedElements); // Save the updated elements to history
  };
  
  const handleResizeStop = (elId, e, direction, ref, delta, position) => {
    // Update the element's size and position
    const updatedElements = elements.map((el) =>
      el.id === elId
        ? {
            ...el,
            style: {
              ...el.style,
              width: ref.style.width,
              height: ref.style.height,
              x: position.x,
              y: position.y,
            },
            component: React.cloneElement(el.component, {
              style: {
                ...el.style,
                width: ref.style.width,
                height: ref.style.height,
              },
              content: el.component.props.content,
            }),
            page: currentPage,
            id: el.id,
          }
        : el
    );
  
    setElements(updatedElements);
    saveHistory(updatedElements); // Save the updated elements to history
  };

  const addElement = (Component) => {
    const id = uniqueId();
    const newElement = {
        id,
        component: <Component key={id} style={{}} content='' />,
        style: {},
        page: currentPage,
        x: 0,
        y: 0
    };
    setCurrentElement(newElement);
    setShouldRunEffect(true);
};

  useEffect(() => {
    if (!currentElement || !shouldRunEffect) return;

    const dialog = dialogRef.current;
    const type = currentElement.component.type.displayName;

    // Store references to commonly used elements
    const content = dialog.querySelector('#content');
    const contentLabel = dialog.querySelector('label[for="content"]');
    const imageContent = dialog.querySelector('#imageContent');
    const imgContLabel = dialog.querySelector('label[for="imageContent"]');

    // Disable delete button and enable relevant input fields
    dialog.querySelector('.deleteButton').setAttribute('disabled', 'true');
    dialog.querySelectorAll('#content, #width, #height, #borderWidth, #borderRadius, #fontSize, #imageContent')
        .forEach(el => el.removeAttribute('disabled'));
    dialog.querySelector('#hiddenContent').setAttribute('disabled', 'true');
    dialog.querySelector('.advSettings').style.display = 'none';

    // Toggle content visibility based on element type
    const isImage = type === 'ImageCmp';
    content.style.display = 'block';
    contentLabel.style.display = 'block';
    contentLabel.textContent = isImage ? 'URL' : 'Content'
    imageContent.style.display = isImage ? 'block' : 'none';
    imgContLabel.style.display = isImage ? 'block' : 'none';

    // Helper function to set values in input fields
    const setValues = (values) => {
        Object.entries(values).forEach(([selector, value]) => {
            dialog.querySelector(selector).value = value;
        });
    };

    // Apply settings based on component type
    switch (type) {
        case 'Button':
            setValues({
                '#height': 30,
                '#bgColor': '#94c3df',
                '#fontColor': '#ffffff',
            });
            break;
        case 'Input':
            setValues({
                '#width': 120,
                '#height': 25,
                '#bgColor': '#e9e0e9',
                '#borderWidth': 1,
                '#borderRadius': 15,
                '#borderColor': '#c2c2c2',
            });
            break;
        case 'Link':
            dialog.querySelector('#fontColor').value = '#0000EE';
            break;
        case 'Icons':
            setValues({ '#content': iconConent, '#hiddenContent': iconConent, '#fontSize': 50 });
            dialog.querySelector('#hiddenContent').removeAttribute('disabled');
            dialog.querySelectorAll('#content, #width, #height').forEach(el => el.setAttribute('disabled', 'true'));
            break;
        case 'List':
            setValues({ '#content': JSON.stringify(listItems), '#hiddenContent': JSON.stringify(listItems) });
            dialog.querySelector('#hiddenContent').removeAttribute('disabled');
            dialog.querySelector('#content').setAttribute('disabled', 'true');
            break;
        case 'Table':
            setValues({ '#content': JSON.stringify(tableItems), '#hiddenContent': JSON.stringify(tableItems) });
            dialog.querySelector('#hiddenContent').removeAttribute('disabled');
            dialog.querySelector('#content').setAttribute('disabled', 'true');
            break;
        case "Video":
          setValues({
            '#width': 520,
            '#height': 250,
          })
          break;
        case "Calendar":
          setValues({
            '#width': 520,
            '#height': 250,
          })
          break;
        default:
          setValues({ '#width': 100, '#height': 50 });
    }

    // Hide duplication & layers container
    dialog.querySelector('.duplicate').style.display = 'none';
    dialog.querySelector('.layersCOntainer').style.display = 'none';

    // Show modal dialog
    dialog.showModal();
    setShouldRunEffect(false);
  }, [currentElement, shouldRunEffect])


const changeStyle = (id, e) => {
  e.preventDefault();
  e.stopPropagation();

  const dialog = dialogRef.current;
  const extraInputs = extraInptRef.current;
  const target = e.target;
  const isImage = target.tagName === 'IMG';
  const isInput = target.tagName === 'INPUT';
  const hasUL = target.children[0]?.tagName === 'UL';
  const hasTable = target.children[0]?.tagName === 'TABLE';
  const isIcon = target.tagName === 'ICONIFY-ICON';
  const isEditor = id.startsWith('editor');
  
  // Disable/enable appropriate fields
  dialog.querySelector('#hiddenContent').setAttribute('disabled', 'true');
  dialog.querySelector('#width').removeAttribute('disabled');
  dialog.querySelector('#height').removeAttribute('disabled');
  dialog.querySelector('#autoW').value = 0;
  dialog.querySelector('#autoH').value = 0;

  // Handle image-specific content toggling
  if (isImage) {
      dialog.querySelector('label[for="content"]').textContent = 'URL';
      dialog.querySelector('label[for="imageContent"]').style.display = 'block';
      dialog.querySelector('#imageContent').style.display = 'block';
      setImageSrc(target.src);
  } else {
      dialog.querySelector('#imageContent').style.display = 'none';
      dialog.querySelector('label[for="imageContent"]').style.display = 'none';
      dialog.querySelector('#content').style.display = 'block';
      dialog.querySelector('label[for="content"]').style.display = 'block';
      dialog.querySelector('#content').value = isInput ? target.placeholder : target.textContent;
      dialog.querySelector('#content').textContent = 'Content';
  }
  
  // Handle list and table elements
  if (hasUL || hasTable) {
      dialog.querySelector('.advSettings').style.display = 'block';
      const data = hasUL ? JSON.stringify(listItems) : JSON.stringify(tableItems);
      dialog.querySelector('#content').value = data;
      dialog.querySelector('#hiddenContent').value = data;
      extraInputs.querySelector('#cols').setAttribute('disabled', 'true');
      extraInputs.querySelector('#rows').value = 2;
      if (hasTable) extraInputs.querySelector('#cols').removeAttribute('disabled');
  } else {
      dialog.querySelector('.advSettings').style.display = 'none';
      extraInputs.querySelector('#cols').removeAttribute('disabled');
  }

  // Set style properties
  const setStyleValue = (selector, value) => {
      dialog.querySelector(selector).value = parseInt(value) || '';
  };
  
  setStyleValue('#width', target.style.width);
  setStyleValue('#height', target.style.height);
  setStyleValue('#fontSize', target.style.fontSize);
  setStyleValue('#borderWidth', target.style.borderWidth);
  setStyleValue('#borderRadius', target.style.borderRadius);
  setStyleValue('#opacity', target.style.opacity * 100)
  dialog.querySelector('#fontColor').value = rgbToHex(target.style.color);
  dialog.querySelector('#bgColor').value = rgbToHex(target.style.backgroundColor);
  dialog.querySelector('#borderColor').value = rgbToHex(target.style.borderColor);

  setChangingStyle({ changing: true, id });

  if (!isEditor) {
      if (isIcon) {
          dialog.querySelectorAll('#content, #width, #height').forEach(el => el.setAttribute('disabled', 'true'));
      } else if (hasUL || hasTable) {
          dialog.querySelector('#hiddenContent').removeAttribute('disabled');
          dialog.querySelector('#content').setAttribute('disabled', 'true');
      } else {
          dialog.querySelectorAll('#content, #width, #height').forEach(el => el.removeAttribute('disabled'));
      }
      dialog.querySelectorAll('#borderWidth, #borderRadius, #fontSize, #imageContent, .deleteButton, #opacity, #borderColor, .maxWidth ').forEach(el => el.removeAttribute('disabled'));

      const elementToUpdate = elements.find(element => element.id === id);
      dialog.querySelector('.duplicate').style.display = 'block';
      dialog.querySelector('.layersCOntainer').style.display = 'flex';
      
      if (elementToUpdate) {
          setCurrentElement({ id, component: elementToUpdate.component, style: elementToUpdate.style });
      }
  } else {
      // Disable fields for editor elements
      dialog.querySelectorAll('#content, #width, #borderWidth, #borderRadius, #fontSize, #imageContent, .deleteButton, #opacity, #borderColor, .maxWidth ').forEach(el => el.setAttribute('disabled', 'true'));
      setCurrentElement({ id, component: editorRef.current, style: editorRef.current.style });
  }

  dialog.showModal();
};

  const closeDialog = () => {
    dialogRef.current.querySelector('form').reset()
    dialogRef.current.close()
  }

  function rgbToHex(rgb) {
    // Extract the individual RGB values using a more robust regular expression
    if(!rgb || rgb === 'transparent'){
      return
    }
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
       setElements={setElements} editorRef={editorRef} userId={userId}/>
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
        <div title='Icons' onClick={() => iconsDialog.current.showModal()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
	          <path fill="currentColor" d="M5 13v-1h6V6h1v6h6v1h-6v6h-1v-6z" />
          </svg>
        </div>
        <div className='gallery' title='Gallery' onClick={() => addElement(Gallery)}><img src="https://img.icons8.com/skeuomorphism/64/stack-of-photos.png" alt="gallery" /></div>
        <div title='Table' onClick={() => addElement(Table)}><img src="https://img.icons8.com/officel/60/table-1.png" alt="table" /></div>
        <div title='Calendar' onClick={() => addElement(Calendar)}><img src='https://img.icons8.com/color/60/calendar--v1.png'/></div>

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
          {alignmentLines.map((line, index) => (
  <div
    key={index}
    style={{
      position: "absolute",
      background: 'rgba(0, 123, 255, 0.5)',
      zIndex: 1000,
      ...(line.type === "vertical"
        ? { left: line.x,  width: "1.5px", height: "100%" }
        : { top: line.y, width: "100%", height: "1.5px" }),
    }}
  />
))}
         {elements.map((el) => (
          el.page === currentPage &&
            (<Rnd
              default={{
                x: 0,
                y: 0,
                width: el.style.width,
                height: el.style.height,
              }}
              bounds="parent"
              onDragStart={(e) => handleDragStart(el.id, e)}
              onDrag={(e, d) => hanldeDrag(e, d, el.id)}
              onDragStop={(e, data) => handleDragStop(el.id, e, data)}
              onResize={(e, direction, ref, delta, position) =>
                handleResizeStop(el.id, e, direction, ref, delta, position)
              }
              onResizeStop={(e, direction, ref, delta, position) =>
                handleResizeStop(el.id, e, direction, ref, delta, position)
              }
              dragGrid={[10, 10]}
              onContextMenu={(e) => changeStyle(el.id, e)}
              key={el.id}
              id={el.id}
            >
              {el.component}
            </Rnd>
            )
          ))}
        </div>
      </div>
      <SelectTemplate ref={templatesRef} loadTemplate={(e) => loadTemplate(e)}/>

      <EditorDialog ref={dialogRef} mediaQuery={mediaQuery}
      duplicate={duplicate} closeDialog={closeDialog} handleImageChange={handleImageChange} 
      currentElement={currentElement} chngStyle={chngStyle}
      extraEditor={extraInptRef} elements={elements} injectCssRef={injectCssRef}
       imageSrc={imageSrc} currentPage={currentPage} setImageSrc={setImageSrc} setElements={setElements} saveHistory={saveHistory}
       setChangingStyle={setChangingStyle} setCurrentElement={setCurrentElement} iconsDialog={iconsDialog} editorRef={editorRef}/>
      <SaveTemplateDialog ref={saveTempRef} saveTemplate={(elements, e) => saveTemplate(elements, e)} elements={elements}/>
      <IconsSelector ref={iconsDialog} addElement={() => addElement(Icons)} 
        sendIconName={(value) => setIconName(value)}/>
      <ExtraInput ref={extraInptRef} currentElement={currentElement} listItems={listItems} setListItems={setListItems} dialogRef={dialogRef}
      setTableData={setTableData} tableItems={tableItems}/>
      <CodeEditor ref={injectCssRef} currentElement={currentElement} dialogRef={dialogRef}/>
    </>
  );
}
