import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import Loading from '../Components/Loading';


const backendUrl = import.meta.env.VITE_BACKEND_URL;

const FoldersToDo = () => {
    const [folders, setFolders] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    const Folders = ({ user }) => (
        <Link to={`/to-do/${user.id}`} style={{textDecoration: 'none'}}>
            <div className="file-item">
              <div className="folder-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>folder</title>
                  <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
                </svg>
              </div>
              <div className="file-details">
                <div className="file-name">{user.username}</div>
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
            setFolders(data)
          } catch (error) {
            setLoading(false)
            console.error('Error fetching thumbnails:', error);
          }
        };
        getUser()
        getThumbnails();
      }, []);
    return (
        <>
              {loading && <Loading/>}
        <div className="verifyThumbnails">
        {folders.length > 0 ? (
        folders.map((folders, index) => (
            folders &&
            <div className="containerFolder" key={index}>
                <Folders key={folders.author.id} user={folders.author} />
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