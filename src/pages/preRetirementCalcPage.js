import logger from '../utils/logger.js';
import utils from '../utils/commonUtility.js';
import helperApp from '../utils/helperFunction.js';
import env from '../../src/config/appConfig.js';


class RetirementDetailsPage {

    get acceptCookiesBtn() {
        return $("//button[contains(text(), 'Accept all cookies')]");
    }
    get currentAge() { return $("//input[@id='current-age']"); }
    get retirementAge() { return $("//input[@id='retirement-age']"); }
    get currentIncome() { return $("//input[@id='current-income']"); }
    get spouseIncome() { return $("//input[@id='spouse-income']"); }
    get retirementSavings() { return $("//input[@id='current-total-savings']"); }
    get retirementContribution() { return $("//input[@id='current-annual-savings']"); }
    get contributionIncrease() { return $("//input[@id='savings-increase-rate']"); }
    get ssYes() { return $("//label[contains(@for,'yes-social-benefits')]"); }
    get ssNo() { return $("//label[contains(@for,'no-social-benefits')]"); }
    get maritalStatusFields() { return $('//*[@class="row social-security-field"]') };
    get singleMaritalStatus() { return $("//label[contains(@for,'single')]"); }
    get marriedMaritalStatus() { return $("//label[contains(@for,'married')]"); }
    get ssOverride() { return $("//input[@id='social-security-override']"); }
    get calculateButton() { return $("//button[contains(text(),'Calculate')]"); }
    get clearFormButton() { return $('//*[@onclick="clearRetirementForm();"]') };

    // Result Page Elements

    get resultPage() { return $('//*[@id="calculator-results-section"]') };
    get resultMessage() { return $('//p[@role="presentation" and @id="result-message"]') };
    get resultChart() { return $('//*[@id="results-chart"]') };
    get resultTable() { return $('//table[@class="dsg-featured-data-stacked-table"]') };
    get emailMyResultBtn() { return $('//button[@data-bs-target="#calc-email-modal" and contains(text(), "Email my results")]') };
    get editInfoBtn() { return $('//button[@class="dsg-btn-secondary dsg-btn-block" and @onclick="navigateToRetirementForm();" and text()="Edit info"]') };
    get seeFullResultsBtn() { return $('//button[@onclick="showFullResults();" and text()="See full results"]') };


    //Negative Testing Elements

    get invalidCurrentAge() { return $('//*[@id="invalid-current-age-error"]') };
    get invalidRetirementAge() { return $('//*[@id="invalid-retirement-age-error"]') };
    get invalidCurrentIncome() { return $('//*[@id="invalid-current-income-error"]') };
    get invalidCurrentTotalSaving() { return $('//*[@id="invalid-current-total-savings-error"]') };
    get invalidCurrentAnnualSaving() { return $('//*[@id="invalid-current-annual-savings-error"]') };
    get invalidSavingIncRate() { return $('//*[@id="invalid-savings-increase-rate-error"]') };


    // Checks if the "Accept Cookies" button is displayed and clicks it if so.
    async acceptCookiesIfPresent() {
        try {
            logger.info("Checking if the 'Accept Cookies' button is displayed...");
            if (await this.acceptCookiesBtn.isDisplayed()) {
                await this.acceptCookiesBtn.click();
                logger.info("'Accept Cookies' button clicked successfully.");
                await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
            } else {
                logger.info("'Accept Cookies' button is not displayed.");
                await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
            }
        } catch (error) {
            logger.error("Error in acceptCookiesIfPresent:", error.message);
            throw error;
        }
    }

    /**
 * Opens the securian retirement calculator page using the appropriate URL and path from config,
 * maximizes the browser, and handles cookie prompt. */
    async openCalculator() {
        try {
            await browser.reloadSession();
            //await browser.url(config.BASE_URL);
            await browser.url(`${env.baseUrl}${env.paths.login}`);
            await this.currentAge.waitForDisplayed({ timeout: 5000 });
            await browser.maximizeWindow();
            await this.acceptCookiesIfPresent();
            logger.info("Retirement calculator page opened successfully.");
        } catch (error) {
            logger.error("Error while opening the retirement calculator page:", error.message);
            throw error;
        }
    }
    /**
  * Fills out the calculator form using test data loaded from a JSON file.
  * Handles conditional logic based on the social security and marital status selections.
  */

    async fillPageData(testCaseName) {
        try {
            const data = await helperApp.readDataFromJson(testCaseName);
            logger.info("Filling out the retirement calculator form...");
            await utils.performElementAction(this.currentAge, 'setValue', data.currentAge, 'Current Age');
            await utils.performElementAction(this.retirementAge, 'setValue', data.retirementAge, 'Retirement Age');
            await utils.performElementAction(this.currentIncome, 'setValue', data.currentAnnualIncome, 'Current Annual Income');
            await utils.performElementAction(this.spouseIncome, 'setValue', data.spouseIncome, 'Spouse Annual Income');
            await utils.performElementAction(this.retirementSavings, 'setValue', data.retirementSavings, 'Retirement Savings');
            await utils.performElementAction(this.retirementContribution, 'setValue', data.retirementContribution, 'Retirement Contribution');
            await utils.performElementAction(this.contributionIncrease, 'setValue', data.contributionIncrease, 'Increase Annual Rate Savings');

            if (data.socialSecurityIncome === 'No') {
                await utils.performElementAction(this.ssNo, 'click', null, 'Select Social Security Benefits as ' + data.socialSecurityIncome);
            } else if (data.socialSecurityIncome === 'Yes') {
                await utils.performElementAction(this.ssYes, 'click', null, `Social Security Benefits Selection as ` + data.socialSecurityIncome);
                if (data.relationshipStatus === 'Married') {
                    await utils.performElementAction(this.marriedMaritalStatus, 'click', null, 'Marital Status as ' + data.relationshipStatus);
                }
                else {
                    await utils.performElementAction(this.singleMaritalStatus, 'click', null, 'Marital Status as ' + data.relationshipStatus);
                }
                await utils.performElementAction(this.ssOverride, 'setValue', data.ssOverride, 'Social Security override amount');
            }
            await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
            logger.info("Retirement calculator form filled successfully.");
        } catch (error) {
            logger.error("Error in fillPageData:", error.message);
            await browser.saveScreenshot(`./screenshots/error-openCalculator-${Date.now()}.png`);
            throw error;
        }
    }



    /**
 * Clicks a button on the page based on the button name provided.
 * Supports "Calculate" and "Clear-Form" buttons.
 */
    async clickButton(button) {
        try {
            switch (button) {
                case 'Calculate':
                    await this.calculateButton.click();
                    logger.info('Clicked on Calculate Button');
                    await browser.pause(2000);
                    await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
                    break;
                case 'Clear-Form':
                    await this.clearFormButton.click();
                    logger.info('Clicked on Clear Form Button');
                    break;
                default:
                    throw new Error(`Button "${button}" not recognized`);
            }
        } catch (error) {
            logger.error("Error clicking button:", error);
            throw error;

        }
    }

    /**
 * Validates that the result section of the calculator is displayed and contains the expected elements.*/
    async validateResultPageInfo() {
        try {
            await this.resultPage.waitForDisplayed({ timeout: 10000 });
            const displayValue = await this.resultPage.getCSSProperty('display');
            if (displayValue.value === 'none') {
                await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
                logger.info('Result Section is not displayed');
                throw new Error('Result Section is not displayed');
            } else {
                await utils.performElementAction(this.resultPage, 'isDisplayed', null, 'Result Page');
                await utils.performElementAction(this.resultMessage, 'isDisplayed', null, 'Result Message');
                await utils.performElementAction(this.resultChart, 'isDisplayed', null, 'Result Chart');
                await utils.performElementAction(this.resultTable, 'isDisplayed', null, 'Result Table');
                await utils.performElementAction(this.emailMyResultBtn, 'isClickable', null, 'Email My Results Button');
                await utils.performElementAction(this.editInfoBtn, 'isClickable', null, 'Edit Info Button');
                await utils.performElementAction(this.seeFullResultsBtn, 'isClickable', null, 'See Full Results Button');
            }
        } catch (error) {
            logger.error("Error validating result section:", error);
            throw error;

        }
    }

    // Validates the error message displayed for each input field based on the test case name.

    async validateErrorDetailsInfo(testCaseName) {
        try {
            const normalizedName = testCaseName.replace(/^TC\d+_/, '');
            const testData = await helperApp.readDataFromJson(testCaseName);

            const errorSelectors = {
                noCurrentAge: [this.invalidCurrentAge, 'Current Age'],
                currentAgeMaxVal: [this.invalidCurrentAge, 'Current Age'],
                noRetirementAge: [this.invalidRetirementAge, 'Retirement Age'],
                retirementAgeMaxVal: [this.invalidRetirementAge, 'Retirement Age'],
                retirementAgeShouldNotBeLessThanCurrentAge: [this.invalidRetirementAge, 'Retirement Age'],
                noCurrentIncome: [this.invalidCurrentIncome, 'Current Income'],
                noCurrentTotalSavings: [this.invalidCurrentTotalSaving, 'Current Total Savings'],
                noCurrentAnnualSavings: [this.invalidCurrentAnnualSaving, 'Current Annual Savings'],
                noSavingsIncreaseRate: [this.invalidSavingIncRate, 'Savings Increase Rate'],
                currAgeGrtThanRetAge: [this.invalidRetirementAge, 'Retirement Age']
            };

            const selectorDetails = errorSelectors[normalizedName];

            if (!selectorDetails) {
                throw new Error(`Unrecognized test case name: ${testCaseName}`);
            }

            const [fieldSelector, fieldName] = selectorDetails;
            await helperApp.verifyErrorMessageText(fieldSelector, testData.errorMessage, fieldName);
        } catch (error) {
            logger.error("Error validating error messages:", error);
            throw error;
        }
    }


    // Validates the Social Security benefit selections and override fields based on input data.
    async validateSocialSecurityDetails(testCaseName) {
        try {

            const data = await helperApp.readDataFromJson(testCaseName);
            if (data.socialSecurityIncome === 'No') {
                await helperApp.assertSelectionStates([
                    { element: this.ssNo, expectedSelection: true, elementName: 'socialSecurityBenefits' }
                ]);
                logger.info('No Social Security Benefits');
            }
            else {
                await helperApp.assertSelectionStates([
                    { element: this.ssYes, expectedSelection: true, elementName: 'socialSecurityBenefits' }
                ]);
                logger.info('Social Security Benefits is added');
                await utils.performElementAction(this.maritalStatusFields, 'isDisplayed', null, 'Marital Status Fields');
                if (data.relationshipStatus === 'Married') {
                    await helperApp.assertSelectionStates([
                        { element: this.marriedMaritalStatus, expectedSelection: true, elementName: 'maritalStatus' }
                    ]);
                    logger.info('Marital Status: Married');
                }
                else {
                    await helperApp.assertSelectionStates([
                        { element: this.singleMaritalStatus, expectedSelection: true, elementName: 'maritalStatus' }
                    ]);
                    logger.info('Marital Status: Single');
                }
                await helperApp.expectElementsToHaveValues([
                    { element: this.ssOverride, expectedValue: data.ssOverride, elementName: 'socialSecurityOverrideAmt' }
                ]);
                logger.info('Social Security Override Amount:', data.socialSecurityOverrideAmt);
            }
        } catch (error) {
            logger.error("Error validating social security details:", error);
            throw error;
        }
    }

}

export default new RetirementDetailsPage();
