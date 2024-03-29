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

import 'cypress-file-upload';

// サインイン
Cypress.Commands.add("appSignin", (path) => {
    cy.fixture("app.json").then(info => {
        cy.visit('/auth/signin')
        cy.get('[data-test-id="inputEmail"]').clear().type(info.email)
        cy.get('[data-test-id="inputPassword"]').clear().type(info.password)
        cy.get('[data-test-id="execSignin"]').should('not.have.attr', 'disabled')
        cy.get('[data-test-id="execSignin"]').click()
        cy.wait(3000)
        cy.visit( path ? path : '/' )
    })
})
// 削除モーダル要素確認
Cypress.Commands.add("confirmDeleteModal", () => {
    cy.get('.v-card__title').should('contain', 'を削除します。')
    cy.get('[data-test-id="modalcancel"]')
    cy.get('[data-test-id="modaldelete"]')
})

// ファイル管理：フォルダ作成
Cypress.Commands.add("createFolder", (index) => {
    cy.get('[data-test-id="addFile"]').click()
    cy.get('[data-test-id="createFolder"]').click()
    cy.get('[data-test-id="createFolderInput"]').clear().type('hoge folder' + index)
    cy.get('[data-test-id="createFolderSave"]').should('not.have.attr', 'disabled', 'disabled' + index)
    cy.get('[data-test-id="createFolderSave"]').click()
    cy.wait(1000)
    cy.get('.v-alert').should('contain', 'を作成しました。')
})
