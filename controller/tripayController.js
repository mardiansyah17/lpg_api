const axios = require('axios');
const crypto = require('crypto');

exports.getPaymentChanel = async (req, res) => {


    try {
        const apiKey = process.env.TRIPAY_API_KEY;
        // console.log(apiKey)
        const tripayRes = await axios.get('https://tripay.co.id/api-sandbox/merchant/payment-channel', {

            headers: {'Authorization': 'Bearer ' + apiKey},
            validateStatus: function (status) {
                return status < 999; // ignore http error
            }
        });

        return res.status(200).json(tripayRes.data)
    } catch (e) {
        return res.send("Error: " + e.message)
    }
}


exports.requestTransaction = async (req, res) => {
    try {
        const apiKey = process.env.TRIPAY_API_KEY;
        const privateKey = process.env.TRIPAY_PRIVATE_KEY;
        const merchant_code = process.env.TRIPAY_MERCHANT_CODE;
        const merchant_ref = 'INV-' + Math.random().toString(36).substring(7);

        const {method, amount, customer, product, product_quantity, discount} = req.body;

        const signature = crypto.createHmac('sha256', privateKey)
            .update(merchant_code + merchant_ref + amount)
            .digest('hex');
        const productPrice = product.price;
        const payload = {
            method,
            merchant_ref,
            amount,
            customer_name: customer.name,
            customer_email: customer.email,
            order_items: [
                {

                    name: product.title,
                    price: productPrice - ((productPrice * discount) / 100),
                    quantity: product_quantity
                }
            ],
            signature

        }
        // console.log()

        const reqTransaction = await axios.post('https://tripay.co.id/api-sandbox/transaction/create', payload, {
            headers: {'Authorization': 'Bearer ' + apiKey},
            validateStatus: function (status) {
                return status < 999; // ignore http error
            }
        }).then(res => res.data)

        res.status(200).json(reqTransaction)

    } catch (e) {
        console.log(e)
        return res.send("Error: " + e.message)
    }

}


exports.detailTransaction = async (req, res) => {
    try {
        const apiKey = process.env.TRIPAY_API_KEY;
        const {reference} = req.query;

        const detail = await axios.get('https://tripay.co.id/api-sandbox/transaction/detail?reference=' + reference, {
            // add this line
            withCredentials: false,
            headers: {
                'Authorization': 'Bearer ' + apiKey,
                'Access-Control-Allow-Origin': '*',
            },
            validateStatus: function (status) {
                return status < 999; // ignore http error
            }
        }).then(res => res.data)
        console.log(detail)
        return res.status(200).json(detail)

    } catch (e) {
        console.log(e)
        return res.send("Error: " + e.message)

    }
}
