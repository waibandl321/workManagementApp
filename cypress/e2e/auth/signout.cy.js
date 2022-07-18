describe('サインアウト', () => {
    before(() => {
        cy.appSignin()
        // cy.appSignin({ email: "e2etest@example.com", password: "e2eteste" })
    })

    it('ヘッダーボタンからサインアウト', () => {
        cy.get('.header').within(() => {
            cy.get('[data-e2e-id="appSignout"]').click()
        })
        cy.wait(1000)
        cy.url().should('eq', 'http://localhost:8080/auth/signin')
        cy.get('.v-card__title').should('contain', 'サインイン')
    })

    it('URLサインアウト', () => {
        cy.appSignin()
        cy.wait(2000)
        cy.visit('/auth/signout')
        cy.wait(1000)
        cy.url().should('eq', 'http://localhost:8080/auth/signin')
        cy.get('.v-card__title').should('contain', 'サインイン')
    })
})