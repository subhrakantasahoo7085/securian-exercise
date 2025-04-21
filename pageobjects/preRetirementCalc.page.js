const { waitForText } = import('../features/support/waitUntil.js');
const { Given, When, Then } = import('@wdio/cucumber-framework');

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

    async open() {
        await browser.url('https://www.securian.com/insights-tools/retirement-calculator.html');
        await this.currentAge.waitForDisplayed({ timeout: 10000 });
        await browser.maximizeWindow();
    }

    async setInputValue(element, value) {
        await element.waitForDisplayed({ timeout: 10000 });
        await element.click();
        await element.clearValue();
        await element.setValue(value);
    }

    async fillForm(data) {
        await this.setInputValue(this.currentAge, data.currentAge);
        await this.setInputValue(this.retirementAge, data.retirementAge);
        await this.setInputValue(this.currentIncome, data.currentAnnualIncome);
        await this.setInputValue(this.spouseIncome, data.spouseIncome);
        await this.setInputValue(this.retirementSavings, data.retirementSavings);
        await this.setInputValue(this.retirementContribution, data.retirementContribution);
        await this.setInputValue(this.contributionIncrease, data.contributionIncrease);

        if (data.socialSecurityIncome === 'yes') await this.ssYes.click();
        if (data.relationshipStatus === 'Married') await this.marriedMaritalStatus.click();
        await this.setInputValue(this.ssOverride, data.ssOverride);
    }

    async defaultFillForm(data) {
        await this.setInputValue(this.additionalIncome, data.additionalIncome);
        await this.setInputValue(this.retirementDuration, data.retirementDuration);
        if (data.inflationAdjustment === 'yes') {
            await this.includeInflanation.click();
        }
        await this.setInputValue(this.expectedInflanationRate, data.inflationRate);
        await this.setInputValue(this.retirementAnnualIncome, data.incomePercent);
        await this.setInputValue(this.preRetirementROI, data.preReturn);
        await this.setInputValue(this.postRetirementROI, data.postReturn);
    }

    async clickSaveChanges() {
        await this.saveChangesButton.click();
    }
    async clickCancel() {
        await this.cancelBtn.click();
    }

    async clickCalculate() {
        await this.calculateButton.click();
    }

    async clickClearForm() {
        await this.clearFormBtn.click();
    }
}

export default new RetirementDetailsPage();
