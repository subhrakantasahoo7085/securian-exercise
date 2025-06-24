import { expect } from 'chai';
import sinon from 'sinon';
import commonUtility from '../src/utils/commonUtility.js';

describe('UtilsClass', () => {
  let mockElement;

  beforeEach(() => {
    mockElement = {
      waitForClickable: sinon.stub().resolves(),
      click: sinon.stub().resolves(),
      setValue: sinon.stub().resolves(),
      waitForDisplayed: sinon.stub().resolves(),
      getText: sinon.stub().resolves('mocked text'),
      isDisplayed: sinon.stub().resolves(true),
      isClickable: sinon.stub().resolves(true),
      getAttribute: sinon.stub().resolves('mocked-attr'),
      clearValue: sinon.stub().resolves(),
      getCSSProperty: sinon.stub().resolves('mocked-css'),
    };
  });

  it('should click an element', async () => {
    await commonUtility.clickElement(mockElement, 'TestElement');
    expect(mockElement.waitForClickable.calledOnce).to.be.true;
    expect(mockElement.click.calledOnce).to.be.true;
  });

  it('should set value to an element', async () => {
    await commonUtility.setValueToElement(mockElement, 'value', 'TestElement');
    expect(mockElement.setValue.calledWith('value')).to.be.true;
  });

  it('should get text from an element', async () => {
    const text = await commonUtility.getTextFromElement(mockElement, 'TestElement');
    expect(text).to.equal('mocked text');
  });

  it('should check if element is displayed', async () => {
    const result = await commonUtility.checkElementDisplayed(mockElement, 'TestElement');
    expect(result).to.be.true;
  });

  it('should check if element is clickable', async () => {
    const result = await commonUtility.checkElementClickable(mockElement, 'TestElement');
    expect(result).to.be.true;
  });

  it('should get attribute from an element', async () => {
    const attr = await commonUtility.getElementAttribute(mockElement, 'attr', 'TestElement');
    expect(attr).to.equal('mocked-attr');
  });

  it('should clear value of an element', async () => {
    await commonUtility.clearElementValue(mockElement, 'TestElement');
    expect(mockElement.clearValue.calledOnce).to.be.true;
  });

  it('should get CSS property from an element', async () => {
    const css = await commonUtility.getElementCSSProperty(mockElement, 'color', 'TestElement');
    expect(css).to.equal('mocked-css');
  });

  it('should throw error for unsupported action', async () => {
    try {
      await commonUtility.performElementAction(mockElement, 'invalidAction', null, 'TestElement');
      throw new Error('Should have thrown');
    } catch (err) {
      expect(err.message).to.include('Unsupported action');
    }
  });
});