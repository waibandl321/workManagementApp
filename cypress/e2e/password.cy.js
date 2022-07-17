describe('パスワード再設定画面', () => {
    it('画面遷移', () => {
        cy.visit('/auth/password_reset_email')
        cy.contains('.v-card__title', 'パスワード再設定')
        cy.contains('.v-card__text', 'パスワード再設定用のメールアドレスを入力してください。')
        cy.contains('a.v-btn', 'ログイン画面に戻る')
    })
})