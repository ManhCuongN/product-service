// cronJob.js
const cron = require('node-cron');
const ProductFactory = require('./product.service.xxx');

function setupCronJob() {
    // Schedule the cron job to run every minute
    cron.schedule('* * * * *', async () => {
        try {
            // Run the writeDataCSV2 function
            await ProductFactory.writeDataCSV2();
            console.log('writeDataCSV2 function executed successfully.');
        } catch (error) {
            console.error('Error executing writeDataCSV2 function:', error.message);
        }
    });

    // No need to call cron.start() here, as it's not a function of the cron instance
}

module.exports = setupCronJob;
