import { forwardRef,useEffect, useState } from "react"
import Thumbnails from '../../Templates/templatesThumbnail'

const SelectTemplate = forwardRef(({loadTemplate}, ref) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [templateCategory, setTemplateCat] = useState('all')
    const [tempDeviceType, setTempDeviceType] = useState('pc')
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

return(
    <>
    <dialog ref={ref} className='templateDialog'>
        <div className='templateCategory'>
          <div>
            <label htmlFor="category">Category:</label>
            <select 
            name='category' 
            id='category'
            onChange={(e) => {
              setTemplateCat(e.target.value)
            }}
            >
              <option value="all">All</option>
              {Categories && Categories.map((cat) => <option key={cat.id} value={cat.name?.toLowerCase().replace(/\s+/g, '')}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="deviceType">Device Type:</label>
            <select name="deviceType" id="deviceType" onChange={(e) => setTempDeviceType(e.target.value)}>
              <option value="pc">PC</option>
              <option value="tablet">Tablet</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
          <i onClick={() => ref.current.close()} className="close-icon" title='close'>✖</i>
        </div>
        <div className='tmeplateDiv'>
          <Thumbnails onThumbnailClick={(e) => loadTemplate(e)} category={templateCategory} deviceType={tempDeviceType}/>
        </div>
      </dialog>
      </>
)
})

export default SelectTemplate