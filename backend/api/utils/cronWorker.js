const cron = require("node-cron");
const User = require("../models/User");
const { syncEmails } = require("../services/gmailService");

/**
 * Initializes the background cron worker to sync Gmail emails.
 */
const initCronWorker = () => {
  // Run every hour: '0 * * * *'
  cron.schedule("0 * * * *", async () => {
    console.log("Background Cron: Starting Gmail Email Sync for connected users...");
    try {
      const connectedUsers = await User.findAll({ where: { gmailConnected: true } });
      console.log(`Background Cron: Found ${connectedUsers.length} users with connected Gmail accounts.`);
      
      for (const user of connectedUsers) {
        try {
          console.log(`Background Cron: Syncing emails for User ID: ${user.id}...`);
          const result = await syncEmails(user);
          console.log(`Background Cron: Sync complete for User ID: ${user.id}. Imported: ${result.imported} new transactions.`);
        } catch (err) {
          console.error(`Background Cron: Error syncing for User ID: ${user.id}:`, err);
        }
      }
    } catch (error) {
      console.error("Background Cron: Error listing connected users:", error);
    }
  });
  console.log("Background Cron Worker initialized. Sync running hourly.");
};

module.exports = { initCronWorker };
