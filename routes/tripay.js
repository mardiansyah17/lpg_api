const express = require('express');
const {
    getPaymentChanel,
    requestTransaction,
    detailTransaction,
    handleCallback
} = require("../controller/tripayController");
const router = express.Router();

router.get('/PaymentChanel', getPaymentChanel)
router.post('/requestTransaction', requestTransaction)
router.get('/detailTransaction', detailTransaction)
router.post('/callback', handleCallback)

module.exports = router;
