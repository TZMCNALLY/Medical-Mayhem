const baseUrl = Cypress.config('baseUrl')

describe('Authentication', () => {

  it('should register an account' , () => {
    cy.visit('/')
    cy.wait(2000)

    cy.intercept('POST', '/auth/register', {
      statusCode: 200,
      body: {
        success: true,
        username : 'JohnSmith123',
        email : 'john.smith@gmail.com',
      }
    }).as('registration')

    
    cy.get('#register').should('be.visible').click()

    cy.get('#username').should('be.visible').type('JohnSmith123')
    cy.get('#email').should('be.visible').type('john.smith@gmail.com')
    cy.get('#password').should('be.visible').type('password')
    cy.get('#passwordVerify').should('be.visible').type('password')

    cy.get('#signUp').click()

    cy.wait('@registration')

    cy.url().should('eq', `${baseUrl}/`)
  })

  it('should login an account' , () => {
    cy.visit('/')
    cy.wait(2000)
    cy.get('#login').should('be.visible').click()

    cy.intercept('POST', '/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        username : 'JohnSmith123',
        email : 'john.smith@gmail.com',
      }
    }).as('login')

    cy.get('#email').should('be.visible').type('john.smith@gmail.com')
    cy.get('#password').should('be.visible').type('password')
    cy.get('#loginSubmit').should('be.visible').click()
    cy.wait('@login')
    cy.url().should('eq', `${baseUrl}/`)
  })

  describe('Registered Accounts', () => {

    beforeEach(() => {
      cy.login('john.smith@gmail.com', 'password')
    })

    it('should log out using the Log Out button', () => {
      cy.visit('/')
      cy.get('#settings-button').should('be.visible').click()
      cy.get('#log-out').should('be.visible').click()
      cy.url().should('eq', `${baseUrl}/`)
    })

    it('should log out using the Delete Account button', () => {
      cy.visit('/')
      cy.get('#settings-button').should('be.visible').click()

      cy.intercept('POST', '/auth/deleteUser', {
        statusCode: 200
      }).as('delete-account')

      cy.get('#delete-account').should('be.visible').click()
      cy.wait('@delete-account')

      cy.url().should('eq', `${baseUrl}/`)
    })
  })

  describe('Guests', () => {

    beforeEach(() => {
      cy.visit('/')
      cy.get('#continue-as-guest').should('be.visible').click()
      cy.url().should('eq', `${baseUrl}/`)
    })

    it('should login from the Settings screen', () => {
      cy.get('#settings-button').should('be.visible').click()
      cy.url().should('eq', `${baseUrl}/settings`)
      cy.get('#login').should('be.visible').click()
      cy.url().should('eq', `${baseUrl}/login`)
      
      cy.intercept('POST', '/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          username : 'JohnSmith123',
          email : 'john.smith@gmail.com',
        }
      }).as('login')
  
      cy.get('#email').should('be.visible').type('john.smith@gmail.com')
      cy.get('#password').should('be.visible').type('password')
      cy.get('#loginSubmit').should('be.visible').click()
      cy.wait('@login')
      cy.url().should('eq', `${baseUrl}/`)
    })

    it('should register from the Settings screen', () => {
      cy.get('#settings-button').should('be.visible').click()
      cy.url().should('eq', `${baseUrl}/settings`)
      cy.get('#register').should('be.visible').click()
      cy.url().should('eq', `${baseUrl}/register`)
      
      cy.intercept('POST', '/auth/register', {
        statusCode: 200,
        body: {
          success: true,
          username : 'JohnSmith123',
          email : 'john.smith@gmail.com',
        }
      }).as('registration')
  
      cy.get('#username').should('be.visible').type('JohnSmith123')
      cy.get('#email').should('be.visible').type('john.smith@gmail.com')
      cy.get('#password').should('be.visible').type('password')
      cy.get('#passwordVerify').should('be.visible').type('password')
  
      cy.get('#signUp').should('be.visible').click()
  
      cy.wait('@registration')
  
      cy.url().should('eq', `${baseUrl}/`)
    })
  })
})