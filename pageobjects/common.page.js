class CommonPage {
    get acceptCookiesBtn() {
        return $("//button[@class='onetrust-close-btn-handler onetrust-close-btn-ui banner-close-button ot-close-icon']"); // Adjust selector as needed
    }

    async acceptCookiesIfPresent() {
        if (await this.acceptCookiesBtn.isDisplayed()) {
            await this.acceptCookiesBtn.click();
        }
    }

    get adjustDefaultValuesLink() { return $("//a[@data-bs-target='#default-values-modal' and text()='Adjust default values']"); }

    async clickAdjustDefaultBtn() {
        if (await this.adjustDefaultValuesLink.isDisplayed()) {
        await this.adjustDefaultValuesLink.waitForClickable({ timeout: 5000 });
        await this.adjustDefaultValuesLink.click();

        
    }
}
     get defaultValuesModal() { return $("//div[@id='default-values-modal']"); }
     async gotoDefaultValuesModal() {
        if (await this.defaultValuesModal.isDisplayed()) {
            await this.defaultValuesModal.waitForClickable({ timeout: 5000 });
            await this.defaultValuesModal.click();
        }
     }
}

export default new CommonPage();
