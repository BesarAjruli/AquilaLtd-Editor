import { forwardRef, useEffect, useState } from "react"
import components from '../../../../server/routers/components.json'

const GalaxyDialog = forwardRef(({parseGalaxyElements}, ref) => {
    const [parsedElm, setParsedElm] = useState([])

    useEffect(() => {
        setParsedElm(parseGalaxyElements(components[0].html, components[0].css))
    }, [])    
      

return (
    <>
        <dialog ref={ref}>
           
        </dialog>
    </>
)
})

export default GalaxyDialog