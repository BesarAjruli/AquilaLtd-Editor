import { forwardRef } from "react";

const ExtraInput = forwardRef(({currentElement}, ref) =>{
    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData.entries())

        console.log(currentElement)
    }
    return (
        <>
            <dialog ref={ref} className="custom-dialog">
                <header>
                <i onClick={() => ref.current.close()} className="close-icon" title='close'>✖</i>
                </header>
                <form onSubmit={handleSubmit} className="dialog-form">
                    <label htmlFor="rows">Rows</label>
                    <input type="number" name="rows" id="rows" defaultValue={1} min={1} />
                    <label htmlFor="cols">Columns</label>
                    <input type="number" name="cols" id="cols" defaultValue={1} min={1}/>
                    <label htmlFor="gap">Gap between cells</label>
                    <input type="number" name="gap" id="gap" defaultValue={5} min={0}/>
                    <button className="submit-button">Submit</button>
                </form>
            </dialog>
        </>
    )
})

export default ExtraInput