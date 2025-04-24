import { Given, When, Then } from '@wdio/cucumber-framework';
import { openCalculator, fillPageData, clickButtons, validateResult } from '../../features/support/preRetirementHelper.js';

Given('I open the retirement calculator form', async () => {
    try {
        await openCalculator();
    } catch (error) {
        console.error("Error in step: 'I open the retirement calculator form'", error.message);
        throw error; // Re-throw the error to fail the step
    }
});

When('I fill in the {string} page of the form with {string} data', async (page, testCase) => {
    try {
        await fillPageData(page, testCase);
    } catch (error) {
        console.error(`Error in step: 'I fill in the "${page}" page of the form with "${testCase}" data'`, error.message);
        throw error;
    }
});

When('I click on the "Save Changes" and "Calculate" buttons', async () => {
    try {
        await clickButtons();
    } catch (error) {
        console.error('Error in step: \'I click on the "Save Changes" and "Calculate" buttons\'', error.message);
        throw error;
    }
});

Then('the result should be {string}', async (expectedResult) => {
    try {
        await validateResult(expectedResult);
    } catch (error) {
        console.error(`Error in step: 'The result should be "${expectedResult}"'`, error.message);
        throw error;
    }
});