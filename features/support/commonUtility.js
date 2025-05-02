import logger from '../support/logger.js';

class UtilsClass {
    
    async resolveElement(element) {
        try {
            return await element;
        } catch (error) {
            throw new Error('Failed to resolve the element.');
        }
    }

    // Function to perform actions on elements
    async performElementAction(element, action, value = null, elementName = null) {
        try {
            const targetElement = await this.resolveElement(element);

            const actions = {
                click: () => this.clickElement(targetElement, elementName),
                setValue: () => this.setValueToElement(targetElement, value, elementName),
                getText: () => this.getTextFromElement(targetElement, elementName),
                isDisplayed: () => this.checkElementDisplayed(targetElement, elementName),
                isClickable: () => this.checkElementClickable(targetElement, elementName),
                getAttribute: () => this.getElementAttribute(targetElement, value, elementName),
                clearValue: () => this.clearElementValue(targetElement, elementName),
                getCSSProperty: () => this.getElementCSSProperty(targetElement, value, elementName),
                scrollIntoView: () => this.scrollElementIntoView(targetElement, elementName),
            };

            // Execute the corresponding action
            if (actions[action]) {
                return await actions[action]();
            }

            throw new Error(`Unsupported action: ${action}`);

        } catch (error) {
            logger.error(`Error performing action "${action}" on element "${elementName}":`, error);
            throw error;
        }
    }

    // Action methods
    async clickElement(element, elementName) {
        await element.waitForClickable({ timeout: 6000 });
        await element.click();
        logger.info(`Clicked on element: ${elementName}`);
    }

    async setValueToElement(element, value, elementName) {
        await element.waitForClickable({ timeout: 6000 });
        await element.click();
        await element.setValue(String(value));
        logger.info(`Set value "${value}" on element: ${elementName}`);
    }

    async getTextFromElement(element, elementName) {
        await element.waitForDisplayed({ timeout: 6000 });
        const text = await element.getText();
        logger.info(`Text of element "${elementName}" is: ${text}`);
        return text;
    }

    async checkElementDisplayed(element, elementName) {
        const isDisplayed = await element.isDisplayed();
        logger.info(`Element "${elementName}" is displayed: ${isDisplayed}`);
        return isDisplayed;
    }

    async checkElementClickable(element, elementName) {
        const isClickable = await element.isClickable();
        logger.info(`Element "${elementName}" is clickable: ${isClickable}`);
        return isClickable;
    }

    async getElementAttribute(element, attribute, elementName) {
        if (!attribute) throw new Error('Attribute name is required for getAttribute action.');
        const attributeValue = await element.getAttribute(attribute);
        logger.info(`Attribute "${attribute}" of element "${elementName}" is: ${attributeValue}`);
        return attributeValue;
    }

    async clearElementValue(element, elementName) {
        await element.waitForClickable({ timeout: 6000 });
        await element.clearValue();
        logger.info(`Cleared value of element: ${elementName}`);
    }

    async getElementCSSProperty(element, property, elementName) {
        if (!property) throw new Error('CSS property name is required for getCSSProperty action.');
        const cssProperty = await element.getCSSProperty(property);
        logger.info(`CSS Property "${property}" of element "${elementName}" is: ${cssProperty}`);
        return cssProperty;
    }

    async scrollElementIntoView(element, elementName) {
        await element.scrollIntoView();
        logger.info(`Scrolled element "${elementName}" into view.`);
    }
}

export default new UtilsClass();