import React, { useEffect, useState } from 'react';
import '../style/approve.css'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import Loading from '../Components/Loading';


const Thumbnails = ({onThumbnailClick, category, searchedTemplate, deviceType}) => {
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
  
        const normalizedCategory = category?.toLowerCase().replace(/\s+/g, '') || '';
  
        const filtered = data.filter((element) => {
          const isVerified = element.verified === true;
  
          if (searchedTemplate) {
            return element.name.toLowerCase().includes(searchedTemplate.toLowerCase()) && isVerified;
          }
  
          if (normalizedCategory === 'all') {
            return element.device_type === deviceType && isVerified;
          }
  
          const validCategory = Categories?.some(
            (cat) => cat.name.toLowerCase().replace(/\s+/g, '') === normalizedCategory
          );
  
          return (
            validCategory &&
            element.category?.toLowerCase().replace(/\s+/g, '') === normalizedCategory &&
            element.device_type === deviceType &&
            isVerified
          );
        });
  
        setThumbnails(filtered);
      } catch (error) {
        console.error('Error fetching thumbnails:', error);
      } finally {
        setLoading(false);
      }
    };
  
    getThumbnails();
  }, [category, deviceType, searchedTemplate]);
  
  return (
    <>
          {loading && <Loading/>}
      {thumbnails.length > 0 ? (
        thumbnails.map((thumbnail, index) => (
          thumbnail &&
          <img key={index} src={thumbnail.path} alt={`Thumbnail ${thumbnail.id}`} title={thumbnail.name} onClick={() => onThumbnailClick(thumbnail.id)} />

        ))
      ) : (
        <p>No thumbnails available</p>
      )}
      </>
  );
};

export default Thumbnails;
