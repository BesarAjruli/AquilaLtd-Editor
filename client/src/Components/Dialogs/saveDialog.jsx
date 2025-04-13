import { forwardRef } from "react"

const SaveDesign = forwardRef(({saveDesign, totalPages}, ref) => {
    const saveDesignSelection = (e) => {
        e.preventDefault()

        const value = document.getElementById('saveOptions').value
        if(value === 'send'){
            //sends to professionals
            saveDesign(totalPages)
        } else if(value === 'saveAShtml'){
            //saves it as html
        } else{
            //saves it as an image
        }

        ref.current.close()
    }
    return(
        <>
            <dialog className="custom-dialog" ref={ref}>
                <header>
                    How do you want to save this design:
                    <i onClick={() => ref.current.close()} className="close-icon" title='close' style={{float: 'right', marginLeft: '30px'}}>✖</i>
                </header>
                <br /><br />
                    <form onSubmit={saveDesignSelection}>
                        <select name="saveOptions" id="saveOptions" className="saveSelect">
                            <option value="send">Send it to our professionals</option>
                            <option value="saveASimg">Save it as an image</option>
                            <option value="saveAShtml">Save it as HTML</option>
                        </select>
                        <br /><br />
                        <button type="submit" className="submit-button">Submit</button>
                    </form>
            </dialog>
        </>
    )
})

export default SaveDesign