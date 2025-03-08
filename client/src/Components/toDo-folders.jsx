import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import Loading from '../Components/Loading';


const backendUrl = import.meta.env.VITE_BACKEND_URL;

const FoldersToDo = () => {
    const [thumbnails, setThumbnails] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    const Folders = ({ user }) => (
        <Link to={`/to-do/${user}`}>
            <div className="file-item">
              <div className="folder-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>folder</title>
                  <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
                </svg>
              </div>
              <div className="file-details">
                <div className="file-name">{user}</div>
              </div>
            </div>
        </Link>
      );

    useEffect(() => {
        async function getUser() {
          setLoading(true)

            try{
              const response = await fetch(`${backendUrl}/api`,{method: 'GET', credentials: 'include'});
              if (!response.ok) {
                console.error('Network response was not ok', response.statusText);
                return;
              }
                const data = await response.json();
                if(data.user.id !== 1){
                    navigate('/')
                }
                setLoading(false)
            } catch(error){
              setLoading(false)
              console.error(error)
            }}
        const getThumbnails = async () => {
          setLoading(true)
          try {
            const response = await fetch(`${backendUrl}/api/to-do-folders`);
            const data = await response.json();
            console.log(data)
            const paths = data.map((element) => {
              if(!element.finished){
                console.log(element)
                return {
                    user: element.authorId,
                };
              }
            });  
            setLoading(false)
            setThumbnails(paths);
          } catch (error) {
            setLoading(false)
            console.error('Error fetching thumbnails:', error);
          }
        };
        getUser()
        getThumbnails();
      }, []);
      
    const disapprove = async (thumbnail) => {
      setLoading(true)
        try {
            console.log("Deleting:", thumbnail); // Debugging log
    
            const response = await fetch(`${backendUrl}/api/delete/${thumbnail}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            const paths = data.map((element) => {
                if(!element.verified){
                  return {
                      thumbnail: element.path,
                      id: element.id
                  };
                }
              });  
              setLoading(false)
              setThumbnails(paths);
        } catch (error) {
          setLoading(false)
            console.error("Error deleting:", error);
        }
    };
    

      const done = async (thumbnail) => {
        setLoading(true)
        try {
            console.log("Updating:", thumbnail); // Debugging log
    
            const response = await fetch(`${backendUrl}/api/update/${thumbnail}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            const paths = data.map((element) => {
                if(!element.verified){
                  return {
                      thumbnail: element.path,
                      id: element.id
                  };
                }
              });  
              setLoading(false)
              setThumbnails(paths);
        } catch (error) {
          setLoading(false)
            console.error("Error deleting:", error);
        }
      }

      console.log(thumbnails)
    return (
        <>
              {loading && <Loading/>}
        <div className="verifyThumbnails">
        {thumbnails.length > 0 ? (
        thumbnails.map((thumbnail, index) => (
          thumbnail &&
            <div className="containerVerification" key={index}>
                <Folders key={thumbnail.authorId} user={thumbnail.authorId} />
                <div className="aproveButtonsCont">
                    <button className="disapprove" onClick={() => disapprove(thumbnail.id)}>Remove</button>
                    <button className="approve" onClick={() => done(thumbnail.id)}>Finished</button>
                </div>
            </div>
        ))
      ) : (
        <p>No thumbnails available</p>
      )}
        </div>
        </>
    )
}

export default FoldersToDo