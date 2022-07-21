describe('アカウント更新', () => {
    before(() => {
        cy.appSignin()
    })

    it('画面確認', () => {
        cy.visit('/account')
        cy.get('.v-card__title').should('contain', 'アカウント情報更新')
        cy.get('[data-e2e-id="lastName"]')
        cy.get('[data-e2e-id="firstName"]')
        cy.get('[data-e2e-id="accountDelete"]').should('contain', 'アカウントを削除')
        cy.get('[data-e2e-id="accountUpdate"]').should('contain', '更新')
        cy.get('[data-e2e-id="accountClose"]').should('contain', '閉じる')
    });

    it('アカウント削除モーダル', () => {
        cy.appSignin()
        cy.get('[data-e2e-id="accountDelete"]').click()
        cy.confirmDeleteModal()
    });

    it('アカウント削除キャンセル', () => {
        cy.get('[data-e2e-id="modalcancel"]').click()
        cy.get('.v-card__title').should('contain', 'アカウント情報更新')
    });

    it('アカウント削除実行', () => {
        cy.get('[data-e2e-id="accountDelete"]').click()
        cy.confirmDeleteModal()
        cy.get('[data-e2e-id="modaldelete"]').click()
        cy.wait(2000)
        cy.get('.v-alert').should('contain', 'アカウントを削除しました。')
        cy.get('[data-e2e-id="finishApp"]').should('contain', 'アプリケーションの利用を終了する')
        cy.get('[data-e2e-id="finishApp"]').click()
        cy.url().should('eq', 'http://localhost:8080/auth/signin')
    });
})