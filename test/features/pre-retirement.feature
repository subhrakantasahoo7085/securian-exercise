Feature: Calculating retirement savings using securian pre-retirement calculator

    Background: PreRetirementCalc page
        Given user navigates to the retirement calculator page

    Scenario Outline: Calculate retirement savings for <testCaseName>
        Given user fills valid details for <testCaseName>
        When user clicks the "Calculate" button
        Then the estimated retirement savings should be displayed
        Examples:
            | testCaseName                        |
            | TC01_verifywithSocialSecurityNo     |
            | TC02_verifyWithSocialSecurityYes    |
            | TC03_verifyWtihMaritalStatusMarried |


    Scenario Outline: Fill details and calculate retirement savings - of - <testCaseName>
        Given user fills valid details for <testCaseName>
        When user clicks the "Calculate" button
        Then user should see the error messages for <testCaseName>
        Examples:
            | testCaseName                                    |
            | TC04_noCurrentAge                               |
            | TC05_noRetirementAge                            |
            | TC06_noCurrentIncome                            |
            | TC07_noCurrentTotalSavings                      |
            | TC08_noCurrentAnnualSavings                     |
            | TC09_noSavingsIncreaseRate                      |
            | TC10_currAgeGrtThanRetAge                       |
            | TC11_currentAgeMaxVal                           |
            | TC12_retirementAgeMaxVal                        |
            | TC13_retirementAgeShouldNotBeLessThanCurrentAge |
    

    Scenario Outline: Fill details, modify default values and calculate retirement savings - of - <testCaseName>
        Given user fills valid details for <testCaseName>
        And user modifies the default values <testCaseName>
        When user clicks the "Calculate" button
        Then the estimated retirement savings should be displayed
        Examples:
            | testCaseName              |
            | TC14_withIncludeInflation |
            | TC15_withExcludeInflation |


    Scenario Outline: Validting Social Security Details - <testCaseName>
        Given user fills valid details for <testCaseName>
        Then the user should see the Social Security details for <testCaseName>
        Examples:
            | testCaseName                        |
            | TC16_verifywithSocialSecurityNo     |
            | TC17_verifyWithSocialSecurityYes    |
            | TC18_verifyWithMaritalStatusMarried |
