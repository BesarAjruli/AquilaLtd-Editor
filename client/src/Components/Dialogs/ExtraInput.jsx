import { forwardRef, useEffect } from "react";

const ExtraInput = forwardRef(({currentElement, listItems, setListItems, dialogRef}, ref) =>{

    useEffect(() => {
        if (currentElement?.component.type.name === "List") {
        dialogRef.current.querySelector('#content').value = JSON.stringify(listItems)
        dialogRef.current.querySelector('#hiddenContent').removeAttribute('disabled')
        dialogRef.current.querySelector('#hiddenContent').value = JSON.stringify(listItems)
        dialogRef.current.querySelector('#content').setAttribute('disabled', 'true')
        }
    },[listItems])

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData.entries())

        const rows = Number(data.rows)

        if(currentElement.component.type.name === 'List'){
            setListItems(Array.from({ length: rows }, (_, i) => `Item${i + 1}`));
        }

        ref.current.close()
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