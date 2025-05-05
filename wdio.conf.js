
import 'wdio-wait-for';
import { execSync } from 'child_process';
import path from 'path';

export const config = {
    specs: ['./test/features/**/*.feature'],

    exclude: [],

    waitforTimeout: 10000,
    waitforInterval: 500,

    services: ['chromedriver'],

    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }]
    ],

    capabilities: [{
        maxInstances: 1, // Number of instances of the browser to run
        browserName: 'chrome', // Browser to use (e.g., 'chrome', 'firefox')
        acceptInsecureCerts: true // Accept insecure SSL certificates
    }],

    logLevel: 'info',

    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    framework: 'cucumber',

    cucumberOpts: {
        import: ['./test/steps/preretirement.steps.js'],
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failAmbiguous: true,
        failWithNoAssertions: true,
        failFast: false,
        name: [],
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false
    },

    // ✨ Auto-generate and open Allure report after execution
    onComplete: function () {
        try {
            console.log('Generating Allure report...');
            execSync('npx allure generate allure-results --clean -o allure-report', { stdio: 'inherit' });

            console.log('Opening Allure report...');
            execSync('npx allure open allure-report', { stdio: 'inherit' });
        } catch (err) {
            console.error('Error while generating Allure report:', err);
        }
    }
};
