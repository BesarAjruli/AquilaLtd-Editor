import { forwardRef } from "react"

const PromptDialog = forwardRef(({handleGeneratePrompt}, ref) => {
    return(
        <>
            <dialog ref={ref} className="custom-dialog">
                <header>
                    <i onClick={() => ref.current.close()} style={{float:'right'}} className="close-icon" title='close'>✖</i>
                </header>
                <form className="dialog-form" style={{display:'block'}} onSubmit={(e) => handleGeneratePrompt(e)}>
                    <label htmlFor="prompt">Prompt</label> <br /><br />
                    <textarea name="prompt" id="prompt" rows='10' cols='40' placeholder="P.s: A modern portfolio website with a hero section, about me, projects, and contact info."></textarea><br /><br />
                    <button className="submit-button" style={{float:'right'}}>Submit</button>
                </form>
            </dialog>
        </>
    )
})

export default PromptDialog