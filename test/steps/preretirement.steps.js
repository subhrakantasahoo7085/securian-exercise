import { Given, When, Then } from '@wdio/cucumber-framework';
import Calc from '../../src/pages/preRetirementCalcPage.js';
import DefaultValues from '../../src/pages/modifyDefaultValues.js';

Given(/^the user navigates to the retirement calculator page$/, async () => {
    await Calc.openCalculator();
});

Given(/^the user has entered valid details for ([^"]*)$/, async function (testCaseName) {
    await Calc.fillPageData(testCaseName);
});

Given(/^the user modifies the default values ([^"]*)$/, async function (testCaseName) {
    await DefaultValues.defaultFillForm(testCaseName);
});

When(/^the user clicks the "([^"]*)" button$/, async (button) => {
    await Calc.clickButton(button);
});

Then(/^user should see the error messages for ([^"]*)$/, async (testCaseName) => {
    await Calc.validateErrorDetailsInfo(testCaseName);
});

Then(/^the user should see the Social Security details for ([^"]*)$/, async (testCaseName) => {
    await Calc.validateSocialSecurityDetails(testCaseName);
});

Then(/^the estimated retirement savings should be displayed$/, async () => {
    await Calc.validateResultPageInfo();
});
