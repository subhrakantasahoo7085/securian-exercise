import logger from '../utils/logger.js';
import utils from '../utils/commonUtility.js';
import helperApp from '../utils/helperFunction.js';

class AdjustDefaultCalcPage {

    get additionalIncome() { return $("//input[@id='additional-income']"); }
    get retirementDuration() { return $("//input[@id='retirement-duration']"); }
    get includeInflanation() { return $("//label[contains(@for,'include-inflation')]"); }
    get excludeInflanation() { return $("//label[contains(@for,'exclude-inflation')]"); }
    get expectedInflanationRate() { return $("//input[@id='expected-inflation-rate']"); }
    get retirementAnnualIncome() { return $("//input[@id='retirement-annual-income']"); }
    get preRetirementROI() { return $("//input[@id='pre-retirement-roi']"); }
    get postRetirementROI() { return $("//input[@id='post-retirement-roi']"); }
    get saveChangesButton() { return $("//button[@type='button' and contains(@class, 'dsg-btn-primary') and contains(@onclick, 'savePersonalizedValues')]"); }
    get cancelBtn() { return $("//button[contains(@class, 'dsg-btn-tertiary') and contains(@class, 'dsg-btn-block-mobile') and @onclick='clearDefaultValuesForm();' and @data-bs-dismiss='modal']"); }
    get adjustDefaultValuesLink() { return $("//a[@data-bs-target='#default-values-modal' and text()='Adjust default values']"); }
    get defaultValuesModal() { return $("//div[@id='default-values-modal']"); }

    // Fills out the "Adjust Default Values" modal form based on the test data for the given test case.
    async defaultFillForm(testCaseName) {
        try {
            await utils.performElementAction(this.adjustDefaultValuesLink, 'click', null, 'Adjust default values link');
            await this.defaultValuesModal.waitForDisplayed({ timeout: 10000 });

            const data = await helperApp.readDataFromJson(testCaseName);
            await utils.performElementAction(this.additionalIncome, 'setValue', data.additionalIncome, 'Additional Income');
            await utils.performElementAction(this.retirementDuration, 'setValue', data.retirementDuration, 'Retirement Duration');
            if (data.excludeInflation === 'yes') {
                await utils.performElementAction(this.excludeInflanation, 'click', null, 'Exclude Inflation');
            }
            else {
                await utils.performElementAction(this.includeInflanation, 'click', null, 'Include Inflation');
                await utils.performElementAction(this.expectedInflanationRate, 'setValue', data.expectedInflationRate, 'Expected Inflation Rate');
            }
            await utils.performElementAction(this.retirementAnnualIncome, 'setValue', data.retirementAnnualIncome, 'Retirement Annual Income');
            await utils.performElementAction(this.preRetirementROI, 'setValue', data.preRetirementReturn, 'Pre Retirement Return');
            await utils.performElementAction(this.postRetirementROI, 'setValue', data.postRetirementReturn, 'Post Retirement Return');
            await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
            await this.saveChangesButton.click();
        } catch (error) {
            logger.error(`Error filling the default values: ${error}`);
            throw error;
        }

    }

}

export default new AdjustDefaultCalcPage();