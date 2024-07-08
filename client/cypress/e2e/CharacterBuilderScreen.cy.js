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

describe('Character Builder Screen', () => {

    beforeEach(() => {
        cy.login('john.smith@gmail.com', 'password')
    })

  it('should be able to select all premade characters', () => {
        cy.visit('/')
        cy.get('#character-builder-button').should('be.visible').should('be.enabled')
        cy.get('#character-builder-button').should('be.visible').click()
        for(let i=0; i<6; i++) {
            cy.get('#character-'+(i)).should('be.visible').click()
        }
    })

    it('should be able to confirm changes', () => {
        cy.visit('/')
        cy.get('#character-builder-button').should('be.visible').should('be.enabled')
        cy.get('#character-builder-button').should('be.visible').click()
        cy.get('#confirm-changes').should('be.visible').click()
        cy.get('#confirm-changes').should('be.visible').should('be.enabled')
    })

    it('should be able to move sliders', () => {
        cy.visit('/')
        cy.get('#character-builder-button').should('be.visible').should('be.enabled')
        cy.get('#character-builder-button').should('be.visible').click()
        for(let i=0; i<3; i++) {
            cy.get('#slider-speed').should('be.visible').invoke('val', i).trigger('change')
            cy.get('#slider-strength').should('be.visible').invoke('val', i).trigger('change')
            cy.get('#slider-defense').should('be.visible').invoke('val', i).trigger('change')

            cy.get('#slider-speed').should('be.visible').should('have.value', i)
            cy.get('#slider-strength').should('be.visible').should('have.value', i)
            cy.get('#slider-defense').should('be.visible').should('have.value', i)
        }
    })
})

