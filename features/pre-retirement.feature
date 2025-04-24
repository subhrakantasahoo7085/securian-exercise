Feature: Pre-Retirement Calculator Saving

  Scenario Outline: Fill and submit pre-retirement calculator
    Given I open the retirement calculator form
    When I fill in the "<page>" page of the form with "<testCase>" data
    And I click on the "Save Changes" and "Calculate" buttons
    Then the result should be "<expectedResult>"

    Examples:
      | testCase  | page         | expectedResult     |
      | TC_01     | firstPage    | Success            |
      | TC_02     | firstPage    | Success            |
      | TC_03     | firstPage    | Success            |
      | TC_04     | firstPage    | Success            |
      | TC_05     | firstPage    | Success            |
      | TC_06     | firstPage    | Invalid input      |
      