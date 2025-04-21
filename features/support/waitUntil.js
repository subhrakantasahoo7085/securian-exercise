export const waitForText = async (selector, expectedText) => {
    await browser.waitUntilTextExists(selector, expectedText, {
      timeout: browser.options.waitforTimeout,
      timeoutMsg: `Expected text "${expectedText}" not found in "${selector}"`
    });
  };