import { forwardRef, useEffect, useState } from "react"

const SaveTemplateDialog = forwardRef(({saveTemplate, elements}, ref) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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


    return (
        <>
        <dialog className='saveTemp' ref={ref}>
      <i onClick={() => ref.current.close()} className="close-icon" title='close'>✖</i>
        <form onSubmit={(e) => {
            e.preventDefault()
            saveTemplate(elements, e)
            }}>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" placeholder="Your templates name" />
          <label htmlFor="category">Category</label>
          <select name='category' id='category'>
            {Categories && Categories.map((cat) => <option key={cat.id} value={cat.name?.toLowerCase().replace(/\s+/g, '')}>{cat.name}</option>)}
          </select>
          <label htmlFor="deviceType">Device Type</label>
          <select name="deviceType" id="deviceType">
            <option value="pc">PC</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>
          <button className="submit-button">Submit</button>
        </form>
      </dialog>
      </>
    )
})

export default SaveTemplateDialog