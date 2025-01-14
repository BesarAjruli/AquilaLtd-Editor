import { useState } from 'react'
import './style/style.css';

export default function App(){
  const [currentPage, setCurrentPage] = useState(1)
  const [pages, setPage] = useState(1)

  return (
    <>
    <div className='toolBar'>
      <span>Page: {currentPage}/{pages}</span>
      <button>New Page</button>
    </div>
    <div className='sideElementsBar'>
            <div className='text'>Text</div>
            <hr />
            <div className='button'><button>Button</button></div>
            <hr />
            <div className='input'><span>|</span></div>
            <hr />
            <div className='image'><img src="https://img.icons8.com/skeuomorphism/64/image.png" alt="image" /></div>
            <hr />
            <div className='video'><img src="https://img.icons8.com/skeuomorphism/64/video.png" alt="video" /></div>
            <hr />
            <div className='audio'><img src="https://img.icons8.com/skeuomorphism/64/circled-play.png" alt="audio" /></div>
            <hr />
            <div className='gallery'><img src="https://img.icons8.com/skeuomorphism/64/stack-of-photos.png" alt="gallery" /></div>
            <hr />
            <div className='section'></div>
            <hr />
            <div className='link'>https://link.com</div>
            <hr />
            <div className='list'>

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
        
        </div>
      </div>
    </>
  )
}