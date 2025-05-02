import { Given, When, Then } from '@wdio/cucumber-framework';
import Calculate from '../../pageobjects/preRetirementCalcPage.js';
import defaultValues from '../../pageobjects/defaultPage.js';

Given(/^user navigates to the retirement calculator page$/, async () => {
    await Calculate.openCalculator();
});

Given(/^user fills the required details for ([^"]*)$/, async function (testCaseName) {        
    await Calculate.fillPageData(testCaseName);
});

Given(/^user modifies the default values ([^"]*)$/, async function (testCaseName) {
    await defaultValues.defaultFillForm(testCaseName);
});

When(/^user clicks on ([^"]*) button$/, async (button) => {
await Calculate.clickButton(button);
}); 

Then(/^user should see the retirement savings details$/, async () => {
    await Calculate.validateResultPageInfo();
});

Then(/^user should see the error messages for ([^"]*)$/, async (testCaseName) => {     
    await Calculate.validateErrorDetailsInfo(testCaseName);
});

Then(/^user should see the Social Security details for ([^"]*)$/, async (testCaseName) => {
    await Calculate.validateSocialSecurityDetails(testCaseName);
});