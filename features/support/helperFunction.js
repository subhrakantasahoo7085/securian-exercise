import fs from 'fs';
import path from 'path';
import logger from '../support/logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class HelperFunctions {


    /* Read data from retirementData.json file */
    readDataFromJson(key = null) {
        const filePath = path.resolve(__dirname, '../../test-data/retirementData.json');

        try {
            // Ensure file exists
            if (!fs.existsSync(filePath)) {
                throw new Error(`JSON file not found at: ${filePath}`);
            }

            // Parse JSON content
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const jsonData = JSON.parse(fileContent);

            // If key is specified, validate and return its value
            if (key !== null) {
                const value = jsonData?.[key];
                if (value === undefined) {
                    throw new Error(`Key "${key}" not found in JSON at: ${filePath}`);
                }
                logger.info(`Successfully fetched key "${key}" from JSON.`);
                return value;
            }

            logger.info(`Successfully fetched entire JSON data from: ${filePath}`);
            return jsonData;

        } catch (error) {
            logger.error(`Error reading JSON file: ${error.message}`);
            throw error;
        }
    }


    /**
     * Verifies if an error message matches the expected text.
     * @param {WebdriverIO.Element} element - The element containing the error message.
     * @param {string} expectedMessage - The expected error message.
     * @param {string} elementName - The name of the element (for logging purposes).
     */


    async verifyErrorMessageText(element, expectedMessage, elementName) {
        try {
            await element.waitForDisplayed({ timeout: 6000 });

            const actualMessage = await element.getText();

            if (actualMessage !== expectedMessage) {
                const errorMsg = `[${elementName}] Validation failed. Expected: "${expectedMessage}", Actual: "${actualMessage}"`;
                logger.error(errorMsg);
                throw new Error(errorMsg);
            }

            logger.info(`[${elementName}] Error message validation passed.`);
        } catch (error) {
            logger.error(`Exception during error message validation for "${elementName}": ${error.message}`);
            throw error;
        }
    }



    /**
 * Validates that each element in the list has the expected value.
 * Supports input, textarea, select, and other readable elements.
 * @param {Array} elementsWithValues - List of objects with element, expectedValue, and elementName
 */
    async expectElementsToHaveValues(elementsWithValues) {
        for (const { element, expectedValue, elementName } of elementsWithValues) {
            try {
                if (!element) {
                    throw new Error(`Element is undefined for "${elementName}".`);
                }

                await element.waitForExist({ timeout: 5000 });
                const tagName = await element.getTagName();
                let actualValue;

                if (["input", "textarea", "select"].includes(tagName)) {
                    actualValue = (await element.getValue()).replace(/[$,]/g, "").trim();

                    // Convert to number if expectedValue is a number and actualValue is not empty
                    if (!isNaN(expectedValue) && actualValue !== "") {
                        actualValue = Number(actualValue);
                    }
                } else {
                    actualValue = (await element.getText()).trim();
                }

                await expect(actualValue).toEqual(expectedValue);
                logger.info(`"${elementName}" has expected value: "${expectedValue}"`);
            } catch (error) {
                logger.error(` Validation failed for "${elementName}": ${error.message}`);
                throw error;
            }
        }
    }

    /*
  * Validates that each element in the list has the expected value.
  * Supports input, textarea, select, and other readable elements.
  * @param {Array} elementsWithValues - List of objects with { element, expectedValue, elementName }
  */
    // async expectElementsToHaveValues(elementsWithValues) {
    //     for (const { element, expectedValue, elementName } of elementsWithValues) {
    //         try {
    //             if (!element) {
    //                 throw new Error(`Element is undefined for "${elementName}".`);
    //             }

    //             await element.waitForExist({ timeout: 5000 });

    //             const tagName = await element.getTagName();
    //             let actualValue;

    //             if (["input", "textarea", "select"].includes(tagName)) {
    //                 // Wait for the field to contain a value
    //                 await browser.waitUntil(
    //                     async () => {
    //                         const val = await element.getValue();
    //                         return val && val.trim() !== "";
    //                     },
    //                     {
    //                         timeout: 5000,
    //                         timeoutMsg: `"${elementName}" did not receive a value within timeout.`,
    //                     }
    //                 );

    //                 actualValue = (await element.getValue()).replace(/[$,]/g, "").trim();

    //                 if (!isNaN(expectedValue) && actualValue !== "") {
    //                     actualValue = Number(actualValue);
    //                 }
    //             } else {
    //                 // For non-input elements, get visible text
    //                 actualValue = (await element.getText()).trim();
    //             }

    //             logger.info(`[DEBUG] "${elementName}" → Expected: ${expectedValue}, Actual: ${actualValue}`);

    //             await expect(actualValue).toEqual(expectedValue);
    //             logger.info(`"${elementName}" has expected value: "${expectedValue}"`);
    //         } catch (error) {
    //             logger.error(`Validation failed for "${elementName}": ${error.message}`);
    //             throw error;
    //         }
    //     }
    // }



    /**
     * Asserts whether a list of form elements (e.g., checkboxes/radios) are selected or not as expected.
     * @param {Array} elementsWithSelection - Array of objects with { element, shouldBeSelected, elementName }
     */
    async assertSelectionStates(elementsWithSelection) {
        try {
            for (const { element, expectedSelection, elementName } of elementsWithSelection) {
                const inputElement = await this.resolveInputElement(element, elementName);

                if (!inputElement || !(await inputElement.isExisting())) {
                    throw new Error(`Input element for "${elementName}" does not exist or could not be resolved.`);
                }

                if (!(await inputElement.isDisplayed())) {
                    logger.info(`Triggering selection via label click for: ${elementName}`);
                    await element.click();
                }

                if (expectedSelection) {
                    await expect(inputElement).toBeSelected();
                    logger.info(`${elementName} is selected as expected.`);
                } else {
                    await expect(inputElement).not.toBeSelected();
                    logger.info(`${elementName} is NOT selected as expected.`);
                }
            }
        } catch (error) {
            logger.error(`Error in assertSelectionStates: ${error.message}`);
            throw error;
        }
    }

    /**
     * Resolves the actual <input> element associated with a label or directly uses the element if it's already an input.
     * @param {WebdriverIO.Element} element 
     * @param {string} elementName 
     * @returns {Promise<WebdriverIO.Element>}
     */
    async resolveInputElement(element, elementName) {
        if (!element) {
            throw new Error(`Provided element is undefined for "${elementName}"`);
        }

        const tagName = await element.getTagName();

        if (tagName === 'label') {
            const forAttribute = await element.getAttribute('for');
            if (forAttribute) {
                const associatedInput = await $(`#${forAttribute}`);
                if (await associatedInput.isExisting()) return associatedInput;
            } else {
                const nestedInput = await element.$('input');
                if (await nestedInput.isExisting()) return nestedInput;
            }

            throw new Error(`No <input> associated with label: ${elementName}`);
        }

        if (await element.isExisting()) {
            return element;
        }

        throw new Error(`Element "${elementName}" does not exist or could not be resolved.`);
    }

}

export default new HelperFunctions();
