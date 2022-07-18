describe('パスワード再設定画面', () => {
    it('画面遷移', () => {
        cy.visit('/auth/password_reset_email')
        cy.contains('.v-card__title', 'パスワード再設定')
        cy.contains('.v-card__text', 'パスワード再設定用のメールアドレスを入力してください。')
        cy.get('[data-e2e-id="passwordResetEmailSend"]').should('have.attr', 'disabled', 'disabled')
        cy.contains('[data-e2e-id="backSigninFromPasswordReset"]', 'サインイン画面に戻る')
    })

    it('入力エラー', () => {
        // メールアドレス値なし
        cy.get('[data-e2e-id="inputEmail"]').focus().clear().blur()
        cy.get('.input-error-messsage')
            .should('contain', 'メールアドレスは必須です')
        cy.get('[data-e2e-id="passwordResetEmailSend"]').should('have.attr', 'disabled', 'disabled')
        // メールアドレス形式不備
        cy.get('[data-e2e-id="inputEmail"]').clear().type("hoge")
        cy.get('.input-error-messsage')
            .should('contain', '有効なメールアドレスではありません')
        cy.get('[data-e2e-id="passwordResetEmailSend"]').should('have.attr', 'disabled', 'disabled')
    });

    // メール送信失敗テストはfirebase依存なので実施できない
    it('確認メール送信OK', () => {
        cy.get('[data-e2e-id="inputEmail"]').clear().type("e2etest@example.com")
        cy.get('[data-e2e-id="passwordResetEmailSend"]').should('not.have.attr', 'disabled')
        cy.get('[data-e2e-id="passwordResetEmailSend"]').click()
        cy.wait(2000)
        // successメッセージ
        cy.contains('.v-card__text', '入力されたメールアドレスに再設定用のリンクを送付しました。')
        cy.contains('[data-e2e-id="backSigninFromPasswordReset"]', 'サインイン画面に戻る')
    });
})