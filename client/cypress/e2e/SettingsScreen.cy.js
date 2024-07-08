const baseUrl = Cypress.config('baseUrl')

Cypress.Commands.add('login', (email, password) => {

    cy.session([email, password], () => {
        cy.visit('/')
        cy.get('#login').should('be.visible').click()
        cy.get('#email').should('be.visible').type(email)
        cy.get('#password').should('be.visible').type(password)
        cy.get('#loginSubmit').should('be.visible').click()
        cy.url().should('eq', `${baseUrl}/`)
    })
})

Cypress.Commands.add('reenter', () => {
    cy.get('#back-button').click();
    cy.get('#settings-button').should('be.visible').click();
})

Cypress.Commands.add('moveSlider', (vol) => {
    cy.intercept('GET', '/api/settings/get').as('getSettings');
    const random = Math.floor(Math.random() * (Math.floor(101) - Math.ceil(0)) + Math.ceil(0));
    cy.get(`#${vol}-slider`).within(() => cy.get(`span[data-index=${random}]`).click({multiple: true, force: true}));
    cy.get('#confirm-audio').click();
    cy.reenter();

    cy.wait('@getSettings').then(() => {
        cy.get(`#${vol}-volume`).should('be.visible').contains(`${random}`);
    })
})

Cypress.Commands.add('testInput', (input, inputKey, inputStr) => {
    const upperCaseInput = input.toUpperCase();
    const capitalizedInput = `${upperCaseInput.charAt(0)}${input.substring(1)}`// First letter is capitalized
    cy.get(`#${capitalizedInput}-input`).should('not.exist');
    cy.get(`#${input}-button`).should('exist').click();
    cy.get(`#${capitalizedInput}-input`).should('exist').type(`{${inputKey}}`);
    cy.get(`#${input}-button`).contains(inputStr);
})

describe('Settings Screen', () => {
    // Continue as registered user before each test
    beforeEach(() => {
        cy.login('john.smith@gmail.com', 'password')
        cy.visit('/')
        cy.get('#settings-button').should('be.visible').should('be.enabled')
        cy.get('#settings-button').should('be.visible').click()
    })

    // Modify volume
    it('should be able to modify master volume', () => cy.moveSlider('master'));
    it('should be able to modify music volume', () => cy.moveSlider('music'));
    it('should be able to modify sfx volume', () => cy.moveSlider('sfx'));
    
    // Reset volume
    it('should be able to reset audio settings', () => {
        cy.get('#reset-audio').click();
        cy.get('#master-volume').should('be.visible').contains('100');
        cy.get('#music-volume').should('be.visible').contains('100');
        cy.get('#sfx-volume').should('be.visible').contains('100');
        cy.reenter();
        cy.get('#master-volume').should('be.visible').contains('100');
        cy.get('#music-volume').should('be.visible').contains('100');
        cy.get('#sfx-volume').should('be.visible').contains('100');
    })

    // Keybinds
    it('should be able to modify keybinds', () => {
        cy.testInput('up', 'upArrow', 'ARROWUP');
        cy.testInput('left', 'leftArrow', 'ARROWLEFT');
        cy.testInput('down', 'downArrow', 'ARROWDOWN');
        cy.testInput('right', 'rightArrow', 'ARROWRIGHT');
        cy.testInput('interact', 'E', 'E');
        cy.get('#confirm-keybinds').should('exist').click();
    })

    // Reset keybinds
    it('should be able to reset keybinds', () => {
        cy.get('#reset-keybinds').click();
        cy.get('#up-button').should('exist').contains('W');
        cy.get('#left-button').should('exist').contains('A');
        cy.get('#down-button').should('exist').contains('S');
        cy.get('#right-button').should('exist').contains('D');
        cy.get('#interact-button').should('exist').contains('E');
    })
})