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
    try {
    const accessToken = await generateAccessToken()
    let value

    switch(productId){
        case '001':
            value = '3.99'
            break
        case '002':
            value = '4.99'
            break
        case '003':
            value = '7.99'
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
                    name: productId === '001' ? 'Basic Bundle' :
                    productId === '002' ? 'Extra Bundle' :
                    'One time bundle',
                    description: 'Basic Bundle',
                    quantity: 1,
                    unit_amount: {
                        currency_code: 'EUR',
                        value: value
                    },
                    sku: productId,
                }],
                amount: {
                    currency_code: 'EUR',
                    value: value,
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
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
    } catch (error){
        console.error("PayPal createOrder Error:", error.response ? error.response.data : error.message);
        throw error;
    }
}

exports.createSubscription = async () => {
    try {
        const accessToken = await generateAccessToken()


        const planId = process.env.PAYPAL_SUBSCRIPTION_ID

        const subscriptionResponse = await axios({
            url: process.env.PAYPAL_BASE_URL + '/v1/billing/subscriptions',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            data: JSON.stringify({
                plan_id: planId,
                start_time: new Date(new Date().getTime() + 5 * 60 * 1000).toISOString(),
                quantity: 1,
                shipping_amount: {
                    currency_code: 'EUR',
                    value: '0'
                },
                application_context: {
                    brand_name: 'APLÓS.editor',
                    return_url: process.env.BASE_URL + '/complete-order',
                    cancel_url: process.env.BASE_URL + '/payment'
                }
            })
        })

        // Return subscription approval URL to redirect the user to PayPal for approval
        return subscriptionResponse.data.links.find(link => link.rel === 'approve').href
    } catch (error) {
        console.error("PayPal createSubscription Error:", error.response ? error.response.data : error.message)
        throw error
    }
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

        // Fetch full order details to get the items
        const orderDetailsResponse = await axios({
            url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`,
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const orderDetails = orderDetailsResponse.data;
        const purchaseUnit = orderDetails.purchase_units?.[0];
        const items = purchaseUnit?.items || [];

        const firstItemSku = items.length > 0 ? items[0].sku : null;

        return {
            captureResponse: response.data,  // The original response data
            firstItemSku: firstItemSku       // SKU of the first item, if it exists
        };
    } catch (error) {
        // Catch any errors and log them
        console.error('Error during payment capture:', error.response ? error.response.data : error.message);
        throw error;  // Rethrow the error so it can be handled further up the stack if needed
    }
}