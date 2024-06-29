const express= require('express');
const notices= require ('../controller/notices.controller');
const events= require('../controller/events.controller');

const router= express.Router();

//Post Requests
router.post('/newNotice',notices.addNewNotice);
router.post('/newEvent', events.addNewEvent);

//Get Requests
router.get('/newNotice',notices.getAllNotices);
router.get('/newNotice/:id', notices.getANotice);
router.get('/newEvent',events.getAllEvents);
router.get('/newEvent/:id', events.getAnEvent);

// Put Requests
router.put('/newNotice/:id', notices.updateNotice);
router.put('/newEvent/:id', events.updateEvent);

// Delete Routes
router.delete('/newNotice/:id', notices.deleteNotice);
router.delete('/newEvent/:id', events.deleteEvent);

module.exports=router;






















// const express = require('express');
// const newFund = require('../controller/fundType.controller');
// const newExpense = require('../controller/expenses.controller');

// const router = express.Router();

// // Post Requests
//  router.post('/editFunds',newFund.addNewFund);
// router.post('/newExpense',newExpense.addNewExpense);

// // Get Requests
// router.get('/editFunds', newFund.getAllFunds);
// router.get('/newExpense',newExpense.getAllExpenses);

// // Put Requests
// router.put('/editFunds/:id', newFund.updateFund);

// // Delete Routes
// router.delete('/editFunds/:id', newFund.deleteFund);

// module.exports = router;