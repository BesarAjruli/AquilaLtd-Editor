import { forwardRef } from "react"

const SaveTemplateDialog = forwardRef(({saveTemplate, elements}, ref) => {
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
            <option value='login'>Login</option>
            <option value="signup">SignUp</option>
            <option value="homepage">Home Page</option>
            <option value="productpage">Product Page</option>
            <option value="others">Others</option>
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