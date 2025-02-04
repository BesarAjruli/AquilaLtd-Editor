import { forwardRef } from "react";

const ExtraInput = forwardRef(({}, ref) =>{
    const handleSubmit = () => {
        
    }
    return (
        <>
            <dialog ref={ref}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="rows">Rows</label>
                    <input type="number" name="rows" id="rows" />
                    <label htmlFor="cols">Columns</label>
                    <input type="number" name="cols" id="cols" />
                    <label htmlFor="gap">Gap between cells</label>
                    <input type="number" name="gap" id="gap" />
                    <button>Submit</button>
                </form>
            </dialog>
        </>
    )
})

export default ExtraInput