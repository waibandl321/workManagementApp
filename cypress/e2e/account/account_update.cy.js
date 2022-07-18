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

    it('入力空エラー', () => {
        cy.get('[data-e2e-id="lastName"]').clear()
        cy.get('.input-error-message').should('contain', '性は必須です')
        cy.get('[data-e2e-id="accountUpdate"]').should('have.attr', 'disabled', 'disabled')
        cy.get('[data-e2e-id="firstName"]').clear()
        cy.get('.input-error-message').should('contain', '名は必須です')
        cy.get('[data-e2e-id="accountUpdate"]').should('have.attr', 'disabled', 'disabled')
    });

    it('閉じるをクリック遷移確認', () => {
        cy.get('[data-e2e-id="accountClose"]').click()
        // 閉じた後の画面遷移: アカウント画面前の履歴に遷移するのでチェック要件はパスだけの確認にする
        cy.url().should('not.contain', 'account')
    })

    // 更新処理失敗はAPI要因のため除外
    it('更新処理', () => {
        cy.appSignin()
        cy.get('[data-e2e-id="lastName"]').clear().type('uhoge')
        cy.get('[data-e2e-id="firstName"]').clear().type('uchan')
        cy.get('[data-e2e-id="accountUpdate"]').should('not.have.attr', 'disabled', 'disabled')
        cy.get('[data-e2e-id="accountUpdate"]').click()
        cy.wait(500)
        cy.get('.v-alert').should('contain', ' アカウント情報を更新しました。')
        cy.get('[data-e2e-id="accountClose"]').click()
        cy.url().should('not.contain', 'account')
        cy.get('.header').within(() => {
            cy.get('[data-e2e-id="headerAccountName"]').should('contain', 'uhoge uchan')
        })
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