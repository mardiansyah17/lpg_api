const axios = require('axios');
const crypto = require('crypto');
const supabase = require('../subase')
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

        const {method, amount, customer, order_items} = req.body;

        const signature = crypto.createHmac('sha256', privateKey)
            .update(merchant_code + merchant_ref + amount)
            .digest('hex');

        const payload = {
            method,
            merchant_ref,
            amount,
            customer_name: customer.name,
            customer_email: customer.email,
            order_items: order_items,
            signature

        }

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

exports.handleCallback = async (req, res) => {
    const privateKey = process.env.TRIPAY_PRIVATE_KEY;

    const callbackSignature = req.headers['x-callback-signature'];
    const json = JSON.stringify(req.body);
    const signature = crypto.createHmac('sha256', privateKey).update(json).digest('hex');

    if (signature !== callbackSignature) {
        return res.status(401).json({
            success: false,
            message: 'Invalid signature',
        });
    }

    const callbackEvent = req.headers['x-callback-event'];

    if (callbackEvent !== 'payment_status') {
        return res.status(400).json({
            success: false,
            message: 'Unrecognized callback event, no action was taken',
        });
    }

    const data = req.body;

    try {
        const invoiceId = data.merchant_ref;
        const tripayReference = data.reference;
        const status = data.status.toUpperCase();

        if (data.is_closed_payment === 1) {
            // Simulating Invoice model operation
            if (invoiceId && tripayReference && status === 'PAID') {
                await supabase.from('transactions').update({
                    status: "PAID"
                }).eq('reference', invoiceId);
                console.log(`Invoice ${invoiceId} has been marked as PAID.`);
                return res.json({success: true});
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'No invoice found or invalid payment status',
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Payment not closed',
            });
        }
    } catch (error) {
        console.error('Error processing Tripay callback:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}
