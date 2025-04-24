
import logger from '../features/support/logger.js';

class CommonPage {
    get acceptCookiesBtn() {
        return $("//button[@class='onetrust-close-btn-handler onetrust-close-btn-ui banner-close-button ot-close-icon']"); // Adjust selector as needed
    }

    async acceptCookiesIfPresent() {
        try {
            logger.info("Checking if the 'Accept Cookies' button is displayed...");
            if (await this.acceptCookiesBtn.isDisplayed()) {
                await this.acceptCookiesBtn.click();
                logger.info("'Accept Cookies' button clicked successfully.");
            } else {
                logger.info("'Accept Cookies' button is not displayed.");
            }
        } catch (error) {
            logger.error("Error in acceptCookiesIfPresent:", error.message);
            throw error;
        }
    }

    get adjustDefaultValuesLink() { return $("//a[@data-bs-target='#default-values-modal' and text()='Adjust default values']"); }

    async clickAdjustDefaultBtn() {
        try {
            logger.info("Checking if the 'Adjust Default Values' link is displayed...");
            if (await this.adjustDefaultValuesLink.isDisplayed()) {
                await this.adjustDefaultValuesLink.waitForClickable({ timeout: 5000 });
                await this.adjustDefaultValuesLink.click();
                logger.info("'Adjust Default Values' link clicked successfully.");
            } else {
                logger.info("'Adjust Default Values' link is not displayed.");
            }
        } catch (error) {
            logger.error("Error in clickAdjustDefaultBtn:", error.message);
            throw error;
        }
    }
    get defaultValuesModal() { return $("//div[@id='default-values-modal']"); }
    async gotoDefaultValuesModal() {
        try {
            logger.info("Checking if the 'Default Values Modal' is displayed...");
            if (await this.defaultValuesModal.isDisplayed()) {
                await this.defaultValuesModal.waitForClickable({ timeout: 5000 });
                await this.defaultValuesModal.click();
                logger.info("'Default Values Modal' clicked successfully.");
            } else {
                logger.info("'Default Values Modal' is not displayed.");
            }
        } catch (error) {
            logger.error("Error in gotoDefaultValuesModal:", error.message);
            throw error;
        }
    }
}

export default new CommonPage();
