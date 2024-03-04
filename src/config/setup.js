// Writes the service account file from environment variable
module.exports = {
    async setup() {
        // Load environment variables from .env file
        require('dotenv').config();

        const fs = require('fs');

        // Write the service account file if environment variable exists
        if (process.env.SERVICE_ACCOUNT) {
            try {
                // Write 'service_account.json'
                await fs.promises.writeFile('service_account.json', process.env.SERVICE_ACCOUNT);
            } catch (error) {
                // Log failure to write credentials
                console.error('Error writing service_account.json:', error);
            }
        }

        // Ensure 'service_account.json' exists, otherwise log instructions and exit
        if (!fs.existsSync('./service_account.json')) {
            console.error('Google service account file missing\nStart a project -> https://console.cloud.google.com/\nAdd "Firestore" to the project\nMake a keyfile\nAdd it to the project root\nRename it to service_account.json');
            process.exit(1); // Exit application with failure
        }
    }
};
