Feature: Pre-Retirement Calculator Saving

  Scenario Outline: Fill and submit pre-retirement calculator
    Given I open the retirement calculator form
    When I fill in the first page of the form with "<testType>" data
    And I click on the Adjust Default Values link
    And I fill in the default values page with "<testType>" data
    And I click on the Save Changes button
    And I click on the Calculate button
    Then the form should be calculated successfully if data is valid

    Examples:
      | testType  |
      | positive  |
      | negative  |
