describe('アカウント更新', () => {
    before(() => {
        cy.appSignin('/account/update')
    })

    it('画面確認', () => {
        cy.get('.v-card__title').should('contain', 'アカウント情報更新')
        cy.get('[data-e2e-id="lastName"]')
        cy.get('[data-e2e-id="firstName"]')
        cy.get('[data-e2e-id="accountDelete"]').should('contain', 'アカウントを削除')
        cy.get('[data-e2e-id="accountUpdate"]').should('contain', '更新')
        cy.get('[data-e2e-id="accountClose"]').should('contain', '閉じる')
    });

    it('アカウント削除モーダル', () => {
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
        cy.on('window:alert', (str) => {
            expect(str).to.equal('アカウントを削除しました。アプリケーションの利用を終了します。')
        })
        cy.url().should('eq', 'http://localhost:8080/auth/signin')
    });
})