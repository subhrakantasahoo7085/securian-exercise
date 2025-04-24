import { setInputValue } from '../features/support/preRetirementHelper.js';
import logger from '../features/support/logger.js';


class RetirementDetailsPage {
    get currentAge() { return $("//input[@id='current-age']"); }
    get retirementAge() { return $("//input[@id='retirement-age']"); }
    get currentIncome() { return $("//input[@id='current-income']"); }
    get spouseIncome() { return $("//input[@id='spouse-income']"); }
    get retirementSavings() { return $("//input[@id='current-total-savings']"); }
    get retirementContribution() { return $("//input[@id='current-annual-savings']"); }
    get contributionIncrease() { return $("//input[@id='savings-increase-rate']"); }


    get ssYes() { return $("//label[contains(@for,'yes-social-benefits')]"); }
    get ssNo() { return $("//label[contains(@for,'no-social-benefits')]"); }
    get singleMaritalStatus() { return $("//label[contains(@for,'single')]"); }
    get marriedMaritalStatus() { return $("//label[contains(@for,'married')]"); }
    get ssOverride() { return $("//input[@id='social-security-override']"); }

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
    get calculateButton() { return $("//button[contains(text(),'Calculate')]"); }
    get clearFormBtn() { return $("//button[contains(text(),'Clear form')]"); }

    get resultMessage() { return $("//p[@id='result-message']"); }
    get errorMessage() { return $("//p[@id='calculator-input-alert-desc' and text()='Please fill out all required fields']"); }



    async open() {
        try {
            logger.info("Opening the retirement calculator page...");
            await browser.url('https://www.securian.com/insights-tools/retirement-calculator.html');
            await this.currentAge.waitForDisplayed({ timeout: 10000 });
            await browser.maximizeWindow();
            logger.info("Retirement calculator page opened successfully.");
        } catch (error) {
            logger.error("Error while opening the retirement calculator page:", error.message);
            throw error;
        }
    }

    async fillForm(data) {
        try {
            logger.info("Filling out the retirement calculator form...");
            await setInputValue(this.currentAge, data.currentAge);
            await setInputValue(this.retirementAge, data.retirementAge);
            await setInputValue(this.currentIncome, data.currentAnnualIncome);
            await setInputValue(this.spouseIncome, data.spouseIncome);
            await setInputValue(this.retirementSavings, data.retirementSavings);
            await setInputValue(this.retirementContribution, data.retirementContribution);
            await setInputValue(this.contributionIncrease, data.contributionIncrease);

            if (data.socialSecurityIncome === 'no') {
                logger.debug("Selecting 'No' for Social Security Income.");
                await this.ssNo.click();
            } else if (data.socialSecurityIncome === 'yes') {
                logger.debug("Selecting 'Yes' for Social Security Income.");
                await this.ssYes.click();
                if (data.relationshipStatus === 'Married') {
                    logger.debug("Selecting 'Married' for Relationship Status.");
                    await this.marriedMaritalStatus.click();
                }
                await setInputValue(this.ssOverride, data.ssOverride);
            }
            logger.info("Retirement calculator form filled successfully.");
        } catch (error) {
            logger.error("Error while filling out the retirement calculator form:", error.message);
            throw error;
        }
    }

    async defaultFillForm(data) {
        try {
            if (data.defaultValuesLink === 'Yes') {
                logger.info("Filling out the default values form...");
                await setInputValue(this.additionalIncome, data.additionalIncome);
                await setInputValue(this.retirementDuration, data.retirementDuration);

                if (data.inflationAdjustment === 'yes') {
                    logger.debug("Including inflation adjustment.");
                    await this.includeInflanation.click();
                    await setInputValue(this.expectedInflanationRate, data.inflationRate);
                }

                await setInputValue(this.retirementAnnualIncome, data.incomePercent);
                await setInputValue(this.preRetirementROI, data.preReturn);
                await setInputValue(this.postRetirementROI, data.postReturn);
                logger.info("Default values form filled successfully.");
            }
        } catch (error) {
            logger.error("Error while filling out the default values form:", error.message);
            throw error;
        }
    }

    async clickSaveChanges() {
        try {
            logger.info("Clicking the 'Save Changes' button...");
            await this.saveChangesButton.waitForClickable({ timeout: 10000 });
            await this.saveChangesButton.click();
            logger.info("'Save Changes' button clicked successfully.");
        } catch (error) {
            logger.error("Error while clicking the 'Save Changes' button:", error.message);
            throw error;
        }
    }
    
    async clickCancel() {
        await this.cancelBtn.waitForClickable({ timeout: 10000 });
        await this.cancelBtn.click();
    }

    async clickClearForm() {
        await this.clearFormBtn.waitForClickable({ timeout: 10000 });
        await this.clearFormBtn.click();
    }
}

export default new RetirementDetailsPage();
