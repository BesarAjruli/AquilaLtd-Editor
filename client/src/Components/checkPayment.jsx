import { useEffect } from "react"

const CheckPayment = () => {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token')
        const getResponse = async() => {
            const response = await fetch(`http://localhost:5000/complete-order?token=${token}`)
            const data = await response.json()

            console.log(data)
        }

        getResponse()
    }, [])
}

export default CheckPayment