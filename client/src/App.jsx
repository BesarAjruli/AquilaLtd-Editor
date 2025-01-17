import { useState, useRef } from 'react';
import './style/style.css';

const Text = () => <span className='edit'>Text</span>;
const Button = () => <button className='edit'>Button</button>;
const Input = () => <input className='edit' type="text"/>;
const Image = () => <img className='edit' src="https://img.icons8.com/skeuomorphism/64/image.png" alt="Picture" />;
const Video = () => <img className='edit' src="https://img.icons8.com/skeuomorphism/64/video.png" alt="Video" />;
const Audio = () => <audio className='edit' src=""></audio>;
const Gallery = () => <img className='edit' src="https://t3.ftcdn.net/jpg/04/19/92/88/360_F_419928833_w7HrdbjTCl1zGIBY1YljW6feoWx90ETm.jpg" alt="Gallery" />;
const Section = () => <div className='edit'></div>;
const Link = () => <a className='edit' href="" disabled>https://links.com</a>;
const List = () => (
  <ul className='edit'>
    <strong><em>List1</em></strong>
    <li>Item1</li>
    <li>Item2</li>
  </ul>
);

export default function App() {
  const [elements, setElements] = useState([]);
  const elementRefs = useRef([]);
  const dialogRef = useRef(null)
  const [styling, setStyling] = useState({})
  const [element, setElement] = useState(null)

  // Adding new elements to the state and managing drag logic
  const addElement = (element) => {
    setElement(element)
    dialogRef.current.showModal()
  };

  const handleDragStart = (index, e) => {
    e.preventDefault();
    const element = e.target
    const rect = element.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    let offsetY = e.clientY - rect.top;
  
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
    };
  
    const endDrag = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', endDrag);
    };
  
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', move);
    document.addEventListener('touchend', endDrag);
  };
  //Handling color submit
  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    const key = element.key
    const style = {
       [key]:{
        width: data.width,
        height: data.height,
        color: data.fontColor,
        backgroundColor: data.bgColor,
        fontSize: data.fontSize,
        borderWidth: '',
        borderRadius: '',
        borderColor: '',
      }
        }
    setStyling(style)

    setElements([...elements, element]);
  }

  const closeDialog = () => {
    dialogRef.current.close()
  }

  return (
    <>
      <div className='toolBar'>
        <span>Page: 1/1</span>
        <button>New Page</button>
      </div>
      <div className='sideElementsBar'>
        <div className='text' onClick={() => addElement(<Text key={elements.length} />)}>Text</div>
        <hr />
        <div className='button' onClick={() => addElement(<Button key={elements.length} />)}><button>Button</button></div>
        <hr />
        <div className='input' onClick={() => addElement(<Input key={elements.length} />)}><span>|</span></div>
        <hr />
        <div className='image' onClick={() => addElement(<Image key={elements.length} />)}><img src="https://img.icons8.com/skeuomorphism/64/image.png" alt="image" /></div>
        <hr />
        <div className='video' onClick={() => addElement(<Video key={elements.length} />)}><img src="https://img.icons8.com/skeuomorphism/64/video.png" alt="video" /></div>
        <hr />
        <div className='audio' onClick={() => addElement(<Audio key={elements.length} />)}><img src="https://img.icons8.com/skeuomorphism/64/circled-play.png" alt="audio" /></div>
        <hr />
        <div className='gallery' onClick={() => addElement(<Gallery key={elements.length} />)}><img src="https://img.icons8.com/skeuomorphism/64/stack-of-photos.png" alt="gallery" /></div>
        <hr />
        <div className='section' onClick={() => addElement(<Section key={elements.length} />)}></div>
        <hr />
        <div className='link' onClick={() => addElement(<Link key={elements.length} />)}>https://link.com</div>
        <hr />
        <div className='list' onClick={() => addElement(<List key={elements.length} />)}>
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
      <div className='editorContainer'>
        <div className='editor'>
          {elements.map((element, index) => (
            <div
              ref={(el) => elementRefs.current[index] = el}
              className='edit'
              key={index}
              onMouseDown={(e) => handleDragStart(index, e)}
            >
              {element}
            </div>
          ))}
        </div>
      </div>
      <dialog ref={dialogRef}>
          <h3>Type</h3>
          <i onClick={closeDialog}>close</i>
          <form onSubmit={handleSubmit}>
            <label htmlFor="width">Width:</label>
            <input type="number" id='width' name='width'/>
            <label htmlFor="height">Height:</label>
            <input type="number" name="height" id="height" />
            <label htmlFor="fontSize">Font Size:</label>
            <input type="number" name="fontSize" id="fontSize" />
            <label htmlFor="fontColor">Font Color</label>
            <input type="color" name="fontColor" id="fontColor" />
            <label htmlFor="bgColor">Background Color:</label>
            <input type="color" name="bgColor" id="bgColor" />
            <button type='submit'>Submit</button>
          </form>
      </dialog>
    </>
  );
}
