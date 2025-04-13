import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";
import Loading from '../Components/Loading';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ToDo = () => {
    const [thumbnails, setThumbnails] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const { id } = useParams()

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
            const response = await fetch(`${backendUrl}/api/to-do/${id}`);
            const data = await response.json();
            console.log(data)
            const paths = data.map((element) => {
              if(!element.finished){
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
            console.error('Error fetching thumbnails:', error);
          }
        };
        getUser()
        getThumbnails();
      }, []);
      
    const disapprove = async (thumbnail) => {
      console.log(thumbnail)
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
    return (
        <>
              {loading && <Loading/>}
        <div className="verifyThumbnails">
        {thumbnails.length > 0 ? (
        thumbnails.map((thumbnail, index) => (
          thumbnail &&
            <div className="containerVerification" key={index}>
                <div className="imageContVer">
                    <img key={thumbnail.id} src={thumbnail.thumbnail} alt={`Thumbnail ${thumbnail.id}`} onClick={() => onThumbnailClick(index)} />
                </div><br />
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

export default ToDo