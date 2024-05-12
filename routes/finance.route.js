const express = require('express');
const newFund = require('../controller/fundType.controller');
const newExpense = require('../controller/expenses.controller');
const newRevenue  = require('../controller/revenue.controller');
const newPayment  = require('../controller/payments.controller');
const { addNewUtility, getUtitlityDetails } = require('../controller/utilityDetails.controller');
const { addUtilityCharge } = require('../controller/utilityCharges.controller');




const router = express.Router();

// Post Requests
router.post('/editFunds',newFund.addNewFund);
router.post('/newExpense',newExpense.addNewExpense);
router.post('/revenue',newRevenue.addNewRevenue);
router.post('/payment',newPayment.addNewPayment);
router.post('/utilityDetails', addNewUtility)
router.post('/addUtilityUsage', addUtilityCharge)

// Get Requests
router.get('/editFunds', newFund.getAllFunds);
router.get('/newExpense',newExpense.getAllExpenses);
router.get('/revenue',newRevenue.getAllRevenues);
router.get('/payment',newPayment.getAllPayments);
router.get('/editFunds/:id', newFund.getAFund);
router.get('/utilityDetails', getUtitlityDetails)


// Put Requests
router.put('/editFunds/:id', newFund.updateFund);

// Delete Routes
router.delete('/editFunds/:id', newFund.deleteFund);

module.exports = router;