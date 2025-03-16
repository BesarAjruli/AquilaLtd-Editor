import { useState, useEffect } from "react"

const CheckPayment = () => {
    const [bundeId, setBundleId] = useState(null)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token')
        const getResponse = async() => {
            const response = await fetch(`http://localhost:5000/complete-order?token=${token}`)
            const data = await response.json()

            setBundleId(data.bundleId)
        }

        getResponse()
    }, [])

    useEffect(() => {
        const response = fetch(`http://localhost:5000/update-bundle/${bundeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        })
    }, [bundeId])
}

export default CheckPayment