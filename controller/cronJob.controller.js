const cron = require('node-cron');
const { updateBalanace } = require('./upDateBalance.controller');

cron.schedule('59 23 28-31 * *', async () => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1,0).getDate();

    if(now.getDate() === lastDay){
        try {
            await updateBalanace();
        } catch (error) {
            console.error('Error updating balances:', error);
        }
    }
})