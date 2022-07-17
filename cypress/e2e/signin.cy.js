describe('サインイン画面', () => {
  it('画面遷移', () => {
    cy.visit('/auth/signin')
    cy.get('.v-card__title').should('contain', 'サインイン')
    cy.get('a.v-btn').should('contain', 'パスワード再設定')
    cy.get('.v-card__title').should('contain', '外部サービスでサインイン')
    cy.get('[data-ut-id="googleSignin"]')
    cy.get('a.v-btn').contains('ユーザー登録はこちら')
  })
})