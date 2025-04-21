import { Given, When, Then } from '@wdio/cucumber-framework';
import RetirementDetailsPage from '../../pageobjects/preRetirementCalc.page.js';
import CommonPage from '../../pageobjects/common.page.js';
import testData from '../../test-data/retirementData.json';

Given('I open the retirement calculator form', async () => {
    await RetirementDetailsPage.open();
    await CommonPage.acceptCookiesIfPresent();
    await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
});

When('I fill in the first page of the form with {string} data', async (testType) => {
    await RetirementDetailsPage.fillForm(testData[testType]);
    await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
});

When('I click on the Adjust Default Values link', async () => {
    await CommonPage.clickAdjustDefaultBtn();
    await CommonPage.gotoDefaultValuesModal();
});

When('I fill in the default values page with {string} data', async (testType) => {
    await RetirementDetailsPage.defaultFillForm(testData[testType]);
    await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
});

When('I click on the Save Changes button', async () => {
    await RetirementDetailsPage.clickSaveChanges();
    await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
});

When('I click on the Calculate button', async () => {
    await RetirementDetailsPage.clickCalculate();
    await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
    
});

Then('the form should be calculated successfully if data is valid', async () => {
    const error = await $('#calculator-input-alert-desc');
    const resultChart = await $('#result-message');

    if (await error.isDisplayed()) {
        // Negative case: validation error is shown
        const errorText = await error.getText();
        console.log(`Validation error displayed: ${errorText}`);
        await expect(error).toBeDisplayed();
        await expect(errorText).not.toBe('');
        await browser.pause(3000);
        await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
    } else {
        // Positive case: result chart is shown
        await expect(resultChart).toBeDisplayed();
        console.log('Calculation successful. Result chart is displayed.');
        await browser.pause(3000);
        await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
    }
});
