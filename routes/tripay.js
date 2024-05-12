const express = require('express');
const {
    getPaymentChanel,
    requestTransaction,
    detailTransaction,
    handleCallback
} = require("../controller/tripayController");
const router = express.Router();


router.get('/', async (req, res) => {
    return res.send("keren")
})
router.get('/payment-chanel', getPaymentChanel)
router.post('/request-transaction', requestTransaction)
router.get('/detail-transaction', detailTransaction)
router.post('/callback', handleCallback)

module.exports = router;
