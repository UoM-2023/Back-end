const express = require('express');
const newFund = require('../controller/fundType.controller');
const newExpense = require('../controller/expenses.controller');
const newRevenue  = require('../controller/revenue.controller');
const newPayment  = require('../controller/payments.controller');




const router = express.Router();

// Post Requests
router.post('/editFunds',newFund.addNewFund);
router.post('/newExpense',newExpense.addNewExpense);
router.post('/revenue',newRevenue.addNewRevenue);
router.post('/payment',newPayment.addNewPayment);

// Get Requests
router.get('/editFunds', newFund.getAllFunds);
router.get('/newExpense',newExpense.getAllExpenses);
router.get('/revenue',newRevenue.getAllRevenues);
router.get('/payment',newPayment.getAllPayments);
router.get('/editFunds/:id', newFund.getAFund);

// Put Requests
router.put('/editFunds/:id', newFund.updateFund);

// Delete Routes
router.delete('/editFunds/:id', newFund.deleteFund);

module.exports = router;