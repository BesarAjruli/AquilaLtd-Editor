import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Toolbar = ({ 
    historyIndex, saveDesign, saveTempRef, templatesRef,
    currentPage,setCurrentPage, history, setHistoryIndex, 
    setElements, editorRef, userId
 }) => {
  
  const [pages, setPage] = useState([1])
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  const navigate = useNavigate()

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

      const addNewPage = () => {
        setPage((prevPages) => {
          const currentPages = prevPages || 0; // Ensure prevPages is treated as a number
          if (currentPages >= 3) {
            navigate('/payment')
            return currentPages; // Return currentPages without change if limit is reached
          }
          const nextPage = parseInt(prevPages) + 1;
          setCurrentPage(nextPage);
          return nextPage;
        });
      }
      
      const changeResponsivnes = (e) => {
        switch(e.target.id){
            case 'radio-1':
                editorRef.current.style.width = '1280px'
                break;
            case 'radio-2':
                editorRef.current.style.width = '1024px'
                break;
            case 'radio-3':
                editorRef.current.style.width = '300px'
                break;
        }
      }

      const logUser = async () => {
        if(userId){
          try{
            const response = await fetch(`${backendUrl}/api/logout`, {
              method: "GET",
              credentials: "include", // 🔥 Allows sending session cookies
            });
            if (!response.ok) {
              console.error('Network response was not ok', response.statusText);
              return;
            }
            const data = await response.json();
            location.reload()
          } catch(error){
            console.error(error)
          }
        }else {
          navigate('/login')
        }
      }
  return (
    <>
      <div className="toolBar">
        <div className="history">
          <button onClick={undoFunction} disabled={historyIndex === 0}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>undo</title>
              <path d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" />
            </svg>
          </button>
          <button
            onClick={redoFunction}
            disabled={historyIndex === history.length - 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>redo</title>
              <path d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z" />
            </svg>
          </button>
          <button onClick={() => saveDesign(pages, false)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>save</title>
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
            </svg>
          </button>
          <button onClick={logUser}>
              {!userId ?
               (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>login</title>
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>) :
              (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>logout</title>
                <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12M4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" /></svg>)}
          </button>
        </div>
              {!mediaQuery.matches && <div className="container">
          <div className="tabs">
            <input type="radio" id="radio-1" name="tabs" defaultChecked="" onChange={changeResponsivnes} />
            <label className="tab" htmlFor="radio-1">
              PC
            </label>
            <input type="radio" id="radio-2" name="tabs" onChange={changeResponsivnes}/>
            <label className="tab" htmlFor="radio-2">
              Tablet
            </label>
            <input type="radio" id="radio-3" name="tabs" onChange={changeResponsivnes}/>
            <label className="tab" htmlFor="radio-3">
              Mobile
            </label>
            <span className="glider"></span>
          </div>
        </div>}
        <div className="templatesButton">
          <button onClick={() => saveTempRef.current.showModal()}>
            Save template
          </button>
          <button onClick={() => templatesRef.current.showModal()}>
            Use templates
          </button>
        </div>
        <div className="pages">
          <div
            onClick={() => {
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>chevron-left</title>
              <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
            </svg>
          </div>
          <span>
            Page: {currentPage}/{pages}
          </span>
          <div
            onClick={() => {
              if (currentPage < pages) setCurrentPage(currentPage + 1);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>chevron-right</title>
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
            </svg>
          </div>
        </div>
        <button onClick={addNewPage}>New Page</button>
      </div>
    </>
  );
};

export default Toolbar;
