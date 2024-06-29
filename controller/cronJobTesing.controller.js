// cronJob.js
const cron = require('node-cron');
const { updateBalanace } = require('./upDateBalance.controller');

cron.schedule('* * * * *', async () => {
  try {
    console.log('Cron job triggered');
    await updateBalanace();
    console.log('Balances updated successfully');
  } catch (error) {
    console.error('Error updating balances:', error);
  }
});

console.log('Cron job scheduled to run every minute for testing purposes.');