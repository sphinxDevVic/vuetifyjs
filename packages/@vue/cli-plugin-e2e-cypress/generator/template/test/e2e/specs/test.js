// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('Visits the Kitchen Sink', () => {
    cy.visit(Cypress.env('VUE_DEV_SERVER_URL'))
    cy.contains('h1', 'Welcome to Your Vue.js <%- hasTS ? '+ TypeScript ' : '' %>App')
  })
})
