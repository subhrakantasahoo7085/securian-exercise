import { Given, When, Then } from '@wdio/cucumber-framework';
import Calc from '../../src/pages/preRetirementCalcPage.js';
import DefaultValues from '../../src/pages/defaultPage.js';

Given(/^user navigates to the retirement calculator page$/, async () => {
    await Calc.openCalculator();
});

Given(/^user fills the required details for ([^"]*)$/, async function (testCaseName) {        
    await Calc.fillPageData(testCaseName);
});

Given(/^user modifies the default values ([^"]*)$/, async function (testCaseName) {
    await DefaultValues.defaultFillForm(testCaseName);
});

When(/^user clicks on ([^"]*) button$/, async (button) => {
await Calc.clickButton(button);
}); 

Then(/^user should see the retirement savings details$/, async () => {
    await Calc.validateResultPageInfo();
});

Then(/^user should see the error messages for ([^"]*)$/, async (testCaseName) => {     
    await Calc.validateErrorDetailsInfo(testCaseName);
});

Then(/^user should see the Social Security details for ([^"]*)$/, async (testCaseName) => {
    await Calc.validateSocialSecurityDetails(testCaseName);
});