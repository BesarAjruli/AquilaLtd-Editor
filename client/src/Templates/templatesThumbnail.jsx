import React, { useEffect, useState } from 'react';
import '../style/approve.css'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import Loading from '../Components/Loading';


const Thumbnails = ({onThumbnailClick, category, deviceType}) => {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true)
  const [Categories, setCategories] = useState()
  useEffect( () => {
    const getCategories = async () =>  {
    try{
    const req = await fetch(`${backendUrl}/api/Categories`)
    const res = await req.json()

    setCategories(res)
  } catch(err){
    console.error(err)
  }
}
  getCategories()
  },[])

  useEffect(() => {
    const getThumbnails = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/saveTemplate/`);
        const data = await response.json();
        
        const paths = data.map((element) => {
          const normalizedCategory = category?.toLowerCase().replace(/\s+/g, '') || '';

          // Handle the 'all' case first
          if (normalizedCategory === 'all') {
            if (element.device_type === deviceType && element.verified === true) {
              return element;
            }
          }
        
          // Check if the category exists in Categories and matches the element
          if (Categories && Categories.some((cat) => cat.name.toLowerCase().replace(/\s+/g, '') === normalizedCategory)) {
            if (element.category?.toLowerCase().replace(/\s+/g, '') === normalizedCategory &&
                element.device_type === deviceType && 
                element.verified === true) {
              return element;
            }
          }
        
          return undefined;
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
