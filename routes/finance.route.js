const express = require("express");
const newFund = require("../controller/fundType.controller");
const newExpense = require("../controller/expenses.controller");
const newRevenue = require("../controller/revenue.controller");
const newPayment = require("../controller/payments.controller");
const {
  addNewUtility,
  getUtitlityDetails,
  getOneUtilityDetail,
  updateUtilityDetails,
} = require("../controller/utilityDetails.controller");
const {
  addUtilityCharge,
  getUtilityCharges,
} = require("../controller/utilityCharges.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");
const { getAUserCharge } = require("../controller/getAUserCharge.controller");
const { getAllBalance, searchBalance } = require('../controller/getAllBalance.controller');
const { sendPaymentWarning } = require('../controller/sendPaymentWarning.controller');
const { updateBalanace } = require("../controller/upDateBalance.controller");

const router = express.Router();

// Post Requests
router.get("/expenses", newExpense.getAllExpenses);
router.get("/expenses/updateExpenses/:id", newExpense.getAExpensesByID);
router.post("/editFunds", newFund.addNewFund);
router.post("/newExpense", newExpense.addNewExpense);
router.post("/revenue", newRevenue.addNewRevenue);
router.post("/payment", newPayment.addNewPayment);
router.post("/utilityDetails", addNewUtility);
router.post("/addUtilityUsage", addUtilityCharge);
router.post("/getUtilityCharges", getUtilityCharges);
router.post('/updateOtherBalances',updateBalanace);

router.post("/notify", (req, res) => {
  console.log("Payment Notification:", req.body);
  res.send("Payment notification received");
});

router.post('/sendPaymentWarning', sendPaymentWarning);

// Get Requests
router.get('/editFunds', verifyToken, checkRole(['finance_manager','admin']), newFund.getAllFunds);
router.get('/newExpense', verifyToken, checkRole(['finance_manager','admin']), newExpense.getAllExpenses);
router.get('/revenue',newRevenue.getAllRevenues);
// router.get('/payment',newPayment.getAllPayments);
router.get('/editFunds/:id', newFund.getAFund);
router.get('/utilityDetails', getUtitlityDetails);
router.get('/utilityDetails/:id', getOneUtilityDetail);
router.get('/getUtilityCharges', getUtilityCharges);
router.get('/getAUserCharge/:id', getAUserCharge);
router.get('/getAllPayments', verifyToken,newPayment.getAllPayments);
router.get('/getAllBalance',getAllBalance);
router.get('/revenue/search',newRevenue.searchRevenues);
router.get('/expenses/search', newExpense.searchExpenses );
router.get('/paymentSearch',verifyToken,newPayment.searchPayments);
router.get('/searchBalance',searchBalance);


// Put Requests
router.put("/editFunds/updateFund/:id", newFund.updateFund);
router.put("/expenses/updateExpenses/:id", newExpense.updateExpenses);
router.put("/updateutilityDetails", verifyToken, updateUtilityDetails);
// Delete Routes
router.delete("/editFunds/deleteFund/:fund_id", newFund.deleteFund);

module.exports = router;
