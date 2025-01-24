import React, { useEffect, useState } from 'react';

const Thumbnails = ({onThumbnailClick}) => {
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    const getThumbnails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/saveTemplate/');
        const data = await response.json();
        
        const paths = data.map((element) => `http://localhost:5000${element.path}`);        
        setThumbnails(paths);
      } catch (error) {
        console.error('Error fetching thumbnails:', error);
      }
    };

    getThumbnails();
  }, []); 
  return (
    <>
      {thumbnails.length > 0 ? (
        thumbnails.map((thumbnail, index) => (
          <img key={index} src={thumbnail} alt={`Thumbnail ${index + 1}`} onClick={() => onThumbnailClick(index)} />
        ))
      ) : (
        <p>No thumbnails available</p>
      )}
      </>
  );
};

export default Thumbnails;
