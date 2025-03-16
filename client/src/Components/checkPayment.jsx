import { useState, useEffect } from "react"

const CheckPayment = () => {
    const [bundeId, setBundleId] = useState(null)
    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token')
        const getResponse = async() => {
            const response = await fetch(`${backendUrl}/complete-order?token=${token}`)
            const data = await response.json()
            console.log(data)

            setBundleId(data.bundleId)
        }

        getResponse()
    }, [])

    useEffect(() => {
        if (!bundeId) return
        const getResponse = async () => {

        const response = await fetch(`${backendUrl}/update-bundle/${bundeId}`, {
            method: 'PUT',
            credentials: 'include', 
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await response.json()
        console.log(data)
        if(data.success){
            location.href = '/'
        }}

        getResponse()
    }, [bundeId])
}

export default CheckPayment