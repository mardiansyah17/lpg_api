const express = require('express');
const {getPaymentChanel, requestTransaction, detailTransaction} = require("../controller/tripayController");
const router = express.Router();

router.get('/PaymentChanel', getPaymentChanel)
router.post('/requestTransaction', requestTransaction)
router.get('/detailTransaction', detailTransaction)

module.exports = router;
