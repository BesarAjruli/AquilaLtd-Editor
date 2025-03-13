const axios = require('axios')

async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data:'grant_type=client_credentials',
        auth:{
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    })

    return response.data.access_token
}
exports.createOrder = async (productId) => {
    const accessToken = await generateAccessToken()
    let value

    switch(productId){
        case '001':
            value = '3.99'
            break
        case '002':
            value = '4.99'
            break
        case '004':
            value = '74.99'
            break
    }
    const response =  await axios({
        url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        data: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
                items: [{
                    name: 'Basic Bundle',
                    description: 'Basic Bundle',
                    quantity: 1,
                    unit_amount: {
                        currency_code: 'USD',
                        value: value
                    }
                }],
                amount: {
                    currency_code: 'USD',
                    value: value,
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: value
                        }
                    }
                }
            }],
            application_context: {
                return_url: process.env.BASE_URL + '/complete-order',
                cancel_url: process.env.BASE_URL + '/payment',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                brand_name: 'APLÓS.editor'
            }
        })
    })

    return response.data.links.find(link => link.rel === 'approve').href
}

exports.capturePayments = async (orderId) => {
    try {
        const accessToken = await generateAccessToken(); // Ensure this is generating correctly
        // Make the POST request to PayPal API
        const response = await axios({
            url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        });

        return response.data;  // Return the response data
    } catch (error) {
        // Catch any errors and log them
        console.error('Error during payment capture:', error.response ? error.response.data : error.message);
        throw error;  // Rethrow the error so it can be handled further up the stack if needed
    }
}