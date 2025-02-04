import React, { useEffect, useState } from 'react';
import '../style/approve.css'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import Loading from '../Components/Loading';


const Thumbnails = ({onThumbnailClick, category, deviceType}) => {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getThumbnails = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/saveTemplate/`);
        const data = await response.json();
        
        const paths = data.map((element) => {
          switch(category){
            case 'all':
              if(element.device_type === deviceType && element.verified === true) return element;
            case 'login':
            case 'signup':
            case 'homepage':
            case 'productpage':
              if (element.category === category && element.device_type === deviceType && element.verified === true) {
                return element;
              }
            return undefined; // Explicitly return undefined if condition isn't met
            default:
              return undefined;
          }
        });
        setThumbnails(paths);
        setLoading(false)
      } catch (error) {
        console.error('Error fetching thumbnails:', error);
        setLoading(false)
      }
    };
    getThumbnails();
  }, [category, deviceType]); 
  return (
    <>
          {loading && <Loading/>}
      {thumbnails.length > 0 ? (
        thumbnails.map((thumbnail, index) => (
          thumbnail &&
          <img key={index} src={thumbnail.path} alt={`Thumbnail ${index + 1}`} title={thumbnail.device_type} onClick={() => onThumbnailClick(index)} />

        ))
      ) : (
        <p>No thumbnails available</p>
      )}
      </>
  );
};

export default Thumbnails;
