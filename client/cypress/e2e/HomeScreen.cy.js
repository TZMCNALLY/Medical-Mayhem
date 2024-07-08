const baseUrl = Cypress.config('baseUrl')

describe('Home Navigation', () => {

    describe('Guest', () => {
        it('should not be able to click Social as a guest', () => {
            cy.visit('/')
            cy.get('#continue-as-guest').should('be.visible').click()
            cy.get('#social-button').should('be.visible').should('be.disabled')
          })
      
        it('should not be able to click Profile as a guest', () => {
            cy.visit('/')
            cy.get('#continue-as-guest').should('be.visible').click()
            cy.get('#profile-button').should('be.visible').should('be.disabled')
        })
      
        it('should not be able to click Character Search as a guest', () => {
            cy.visit('/')
            cy.get('#continue-as-guest').should('be.visible').click()
            cy.get('#character-search-button').should('be.visible').should('be.disabled')
        })

        it('should display a queue modal successfully', () => {
            cy.visit('/')
            cy.get('#continue-as-guest').should('be.visible').click()
            cy.intercept('GET', '/socket.io/**', {}).as('socket.io')
            cy.intercept('POST', '/socket.io/**', {}).as('socket.io')
            cy.get('#play-button').should('be.visible').click()
            cy.get('#queue-modal').should('be.visible')
        })
    
        it('should navigate to the forums screen successfully', () => {
            cy.visit('/')
            cy.get('#continue-as-guest').should('be.visible').click()
            cy.get('#forums-button').should('be.visible').should('be.enabled')
            cy.get('#forums-button').should('be.visible').click()
            cy.url().should('eq', `${baseUrl}/forum`)
        })
    
        it('should navigate to the settings screen successfully', () => {
            cy.visit('/')
            cy.get('#continue-as-guest').should('be.visible').click()
            cy.get('#settings-button').should('be.visible').should('be.enabled')
            cy.get('#settings-button').should('be.visible').click()
            cy.url().should('eq', `${baseUrl}/settings`)
        })
    
        it('should navigate to the about screen successfully', () => {
            cy.visit('/')
            cy.get('#continue-as-guest').should('be.visible').click()
            cy.get('#about-button').should('be.visible').should('be.enabled')
            cy.get('#about-button').should('be.visible').click()
            cy.url().should('eq', `${baseUrl}/about`)
        })
    
        it('should navigate to the leaderboard screen successfully', () => {
            cy.visit('/')

            cy.get('#continue-as-guest').should('be.visible').click()
            cy.get('#leaderboard-button').should('be.visible').should('be.enabled')
            cy.get('#leaderboard-button').should('be.visible').click()
            cy.url().should('eq', `${baseUrl}/leaderboard`)
        })
    })

    describe('Registered User', () => {

        beforeEach(() => {
            cy.login('john.smith@gmail.com', 'password')
        })

        it('should navigate to the Social screen successfully', () => {
            cy.visit('/')
            cy.get('#social-button').should('be.visible').click()
            cy.url().should('eq', `${baseUrl}/social`)
        })
      
        it('should navigate to the Profile screen successfully', () => {
            cy.visit('/')
            cy.get('#profile-button').should('be.visible').click()
            cy.url().should('eq', `${baseUrl}/profile`)
        })
      
        it('should display a queue modal by clicking Play successfully', () => {
            cy.visit('/')

            cy.intercept('GET', '/socket.io/**', {}).as('socket.io')
            cy.intercept('POST', '/socket.io/**', {}).as('socket.io')


            cy.get('#play-button').should('be.visible').click()
            cy.url().should('eq', `${baseUrl}/`)
            cy.wait('@socket.io')
            cy.get('#queue-modal').should('be.visible')
        })
        
        it('should navigate to the character search screen successfully', () => {
            cy.visit('/')
            cy.get('#character-search-button').should('be.visible').click()
            cy.url().should('eq', `${baseUrl}/charactersearch`)
        })
    
        it('should navigate to the forums screen successfully', () => {
            cy.visit('/')
            cy.get('#forums-button').should('be.visible').click()
            cy.url().should('eq', `${baseUrl}/forum`)
        })
    
        it('should navigate to the settings screen successfully', () => {
            cy.visit('/')
            cy.get('#settings-button').should('be.visible').click()
            cy.url().should('eq', `${baseUrl}/settings`)
        })
    
        it('should navigate to the about screen successfully', () => {
            cy.visit('/')
            cy.get('#about-button').should('be.visible').click()
            cy.url().should('eq', `${baseUrl}/about`)
        })
    })
})