describe('アカウント更新', () => {
    before(() => {
        cy.appSignin('account/update')
    })

    it('画面確認', () => {
        cy.get('.v-card__title').should('contain', 'アカウント情報更新')
        cy.get('[data-test-id="lastName"]')
        cy.get('[data-test-id="firstName"]')
        cy.get('[data-test-id="accountDelete"]').should('contain', 'アカウントを削除')
        cy.get('[data-test-id="accountUpdate"]').should('contain', '更新')
        cy.get('[data-test-id="accountClose"]').should('contain', '閉じる')
    });

    it('入力空エラー', () => {
        cy.get('[data-test-id="lastName"]').clear()
        cy.get('.input-error-message').should('contain', '性は必須です')
        cy.get('[data-test-id="accountUpdate"]').should('have.attr', 'disabled', 'disabled')
        cy.get('[data-test-id="firstName"]').clear()
        cy.get('.input-error-message').should('contain', '名は必須です')
        cy.get('[data-test-id="accountUpdate"]').should('have.attr', 'disabled', 'disabled')
    });

    it('閉じるをクリック遷移確認', () => {
        cy.get('[data-test-id="accountClose"]').click()
        // 閉じた後の画面遷移: アカウント画面前の履歴に遷移するのでチェック要件はパスだけの確認にする
        cy.url().should('not.contain', 'account')
    })

    // 更新処理失敗はAPI要因のため除外
    it('更新処理', () => {
        cy.appSignin('account/update')
        cy.get('[data-test-id="lastName"]').clear().type('uhoge')
        cy.get('[data-test-id="firstName"]').clear().type('uchan')
        cy.get('[data-test-id="accountUpdate"]').should('not.have.attr', 'disabled', 'disabled')
        cy.get('[data-test-id="accountUpdate"]').click()
        cy.wait(500)
        cy.get('.v-alert').should('contain', ' アカウント情報を更新しました。')
        cy.get('[data-test-id="accountClose"]').click()
        cy.url().should('not.contain', 'account')
        cy.get('.header').within(() => {
            cy.get('[data-test-id="headerAccountName"]').should('contain', 'uhoge uchan')
        })
    });
})