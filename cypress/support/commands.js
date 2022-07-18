// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// サインイン
Cypress.Commands.add("appSignin", (path) => {
    cy.fixture("app.json").then(info => {
        cy.visit('/auth/signin')
        cy.get('[data-e2e-id="inputEmail"]').clear().type(info.email)
        cy.get('[data-e2e-id="inputPassword"]').clear().type(info.password)
        cy.get('[data-e2e-id="execSignin"]').should('not.have.attr', 'disabled')
        cy.get('[data-e2e-id="execSignin"]').click()
        cy.wait(2000)
        cy.visit( path ? path : 'account' )
    })
})
// 削除モーダル要素確認
Cypress.Commands.add("confirmDeleteModal", () => {
    cy.get('.v-card__title').should('contain', 'を削除します。')
    cy.get('[data-e2e-id="modalcancel"]')
    cy.get('[data-e2e-id="modaldelete"]')
})