import RetirementDetailsPage from '../../pageobjects/preRetirementCalc.page.js';
import CommonPage from '../../pageobjects/common.page.js';
import testData from '../../test-data/retirementData.json';
import logger from '../support/logger.js';

/**
 * Opens the retirement calculator form and handles the cookie banner if present.
 * Captures a screenshot after successfully opening the form.
 */

export async function openCalculator() {
    try {
        await RetirementDetailsPage.open();
        await CommonPage.acceptCookiesIfPresent();
        logger.info("Retirement calculator form opened successfully.");
        await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
    } catch (error) {
        logger.error("Error in openCalculator:", error.message);
        await browser.saveScreenshot(`./screenshots/error-openCalculator-${Date.now()}.png`);
        throw error;
    }
}

/**
 * Sets the value of an input field.
 * Waits for the element to be displayed and enabled before interacting with it.
 * Logs the action and captures a screenshot in case of an error.
 * 
 * @param {WebdriverIO.Element} element - The input field element.
 * @param {string} value - The value to set in the input field.
 */

export async function setInputValue(element, value) {
    try {
        logger.debug(`Setting input value: ${value}`);
        await element.waitForDisplayed({ timeout: 10000 });
        await element.waitForEnabled({ timeout: 10000 });
        await element.click();
        await element.clearValue();
        await element.setValue(value);
    } catch (error) {
        logger.error("Error in setInputValue:", error.message);
        await browser.saveScreenshot(`./screenshots/error-setInputValue-${Date.now()}.png`);
        throw error;
    }
}

/**
 * Fills the form on the specified page with test data.
 * Handles navigation to the default values page if required.
 * Captures screenshots for debugging and logs the progress.
 * 
 * @param {string} page - The page to fill (e.g., 'firstPage').
 * @param {string} testCase - The test case identifier to fetch data from the test data file.
 */

export async function fillPageData(page, testCase) {
    try {
        logger.info(`Filling data for page: "${page}" with test case: "${testCase}"`);
        const data = testData[testCase]?.[page];
        if (!data) {
            throw new Error(`Test data for "${testCase}" on page "${page}" is not defined`);
        }

        if (page === 'firstPage') {
            await RetirementDetailsPage.fillForm(data);
            logger.info("Form data filled successfully.");
            await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);

            if (data.defaultValuesLink?.toLowerCase() === "yes") {
                logger.info("Navigating to default values page...");
                await CommonPage.clickAdjustDefaultBtn();
                await CommonPage.gotoDefaultValuesModal();
                await RetirementDetailsPage.defaultFillForm(data);
                await RetirementDetailsPage.clickSaveChanges();
                logger.info("Default values updated successfully.");
                await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
            } else {
                logger.info("Skipping DefaultPage navigation.");
            }
        } else {
            throw new Error(`Unknown page: ${page}`);
        }

        await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
    } catch (error) {
        logger.error("Error in fillPageData:", error.message);
        await browser.saveScreenshot(`./screenshots/error-fillPageData-${Date.now()}.png`);
        throw error;
    }
}

/**
 * Clicks the "Calculate" button and waits for the result or error message to be displayed.
 * Captures screenshots and logs the progress.
 */

export async function clickButtons() {
    try {
        logger.info("Clicking the 'Calculate' button...");
        const calculateButton = await RetirementDetailsPage.calculateButton;

        // Wait for the button to be clickable
        await calculateButton.waitForClickable({ timeout: 10000 });
        await calculateButton.click();
        logger.info("'Calculate' button clicked successfully.");
        console.log("Clicked the 'Calculate' button successfully.");
    } catch (error) {
        logger.error("Error while clicking the 'Calculate' button:", error.message);
        await browser.saveScreenshot(`./screenshots/error-clickCalculate-${Date.now()}.png`);
        throw new Error("Failed to click the 'Calculate' button.");
    }

    try {
        logger.info("Waiting for the result or error message to be displayed...");
        const resultMessageElement = await RetirementDetailsPage.resultMessage;
        const errorMessageElement = await RetirementDetailsPage.errorMessage;

        await browser.waitUntil(
            async () => await resultMessageElement.isDisplayed() || await errorMessageElement.isDisplayed(),
            {
                timeout: 10000,
                timeoutMsg: 'Neither result message nor error message was displayed within the timeout period'
            }
        );
        logger.info("Result or error message is displayed.");
    } catch (error) {
        logger.error("Error while waiting for result or error message:", error.message);
        //await browser.saveScreenshot(`./screenshots/error-waitForResult-${Date.now()}.png`);
        throw new Error("Failed to display result or error message.");
    }
    await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
}

/**
 * Validates the result displayed on the page against the expected value.
 * Logs the validation progress and captures screenshots for debugging.
 * 
 * @param {string} expectedResult - The expected result to validate against.
 */

export async function validateResult(expectedResult) {
    try {
        logger.info(`Validating result with expected value: "${expectedResult}"`);
        const resultMessageElement = await RetirementDetailsPage.resultMessage;
        const errorMessageElement = await RetirementDetailsPage.errorMessage;

        await browser.waitUntil(
            async () => await resultMessageElement.isDisplayed() || await errorMessageElement.isDisplayed(),
            {
                timeout: 10000,
                timeoutMsg: 'Neither result message nor error message was displayed within the timeout period'
            }
        );

        if (await errorMessageElement.isDisplayed()) {
            const errorText = await errorMessageElement.getText();
            logger.warn(`Validation error displayed: ${errorText}`);
            if (expectedResult !== 'Invalid input') {
                throw new Error(`Expected "${expectedResult}" but got validation error: "${errorText}"`);
            }
        } else if (await resultMessageElement.isDisplayed()) {
            const resultText = await resultMessageElement.getText();
            logger.info(`Calculation successful. Result message: ${resultText}`);
            if (expectedResult !== 'Success') {
                throw new Error(`Expected "${expectedResult}" but got success result: "${resultText}"`);
            }
        }
        else {
            // Neither result nor error message is displayed
            throw new Error('Neither result message nor error message is displayed.');
        }
    } catch (error) {
        logger.error("Error during result validation:", error.message);
        //await browser.saveScreenshot(`./screenshots/error-validateResult-${Date.now()}.png`);
        throw error;
    }
    await browser.saveScreenshot(`./screenshots/screenshot-${Date.now()}.png`);
}

