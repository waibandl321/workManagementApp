describe('サインイン画面', () => {
  it('画面遷移', () => {
    cy.visit('/auth/signin')
    cy.get('.v-card__title').should('contain', 'サインイン')
    cy.get('[data-test-id="execSignin"]').should('have.attr', 'disabled', 'disabled')
    cy.get('[data-test-id="passwordReset"]').should('contain', 'パスワード再設定')
    cy.get('.v-card__title').should('contain', '外部サービスでサインイン')
    cy.get('[data-test-id="googleSignin"]')
    cy.get('[data-test-id="pageMoveSignup"]').contains('ユーザー登録がまだの方はこちら')
  })

  it('入力エラー', () => {
    // メールアドレス値なし
    cy.get('[data-test-id="inputEmail"]').focus().clear().blur()
    cy.get('.input-error-message')
        .should('contain', 'メールアドレスは必須です')
    cy.get('[data-test-id="execSignin"]').should('have.attr', 'disabled', 'disabled')
    // パスワード値なし
    cy.get('[data-test-id="inputPassword"]').focus().clear().blur()
    cy.get('.input-error-message').should('contain', 'パスワードは必須です')
    cy.get('[data-test-id="execSignin"]').should('have.attr', 'disabled', 'disabled')
    // メールアドレス形式不備
    cy.get('[data-test-id="inputEmail"]').clear().type("hoge")
    cy.get('.input-error-message')
        .should('contain', '有効なメールアドレスではありません')
    cy.get('[data-test-id="execSignin"]').should('have.attr', 'disabled', 'disabled')
  })

  it('認証エラー', () => {
    // メールアドレス不一致
    cy.get('[data-test-id="inputEmail"]').clear().type("e2etest@example.co")
    cy.get('[data-test-id="inputPassword"]').clear().type("e2eteste")
    cy.get('[data-test-id="execSignin"]').should('not.have.attr', 'disabled')
    cy.get('[data-test-id="execSignin"]').click()
    cy.wait(2000)
    cy.get('.v-alert').should('contain', '認証に失敗しました。正しいメールアドレス、パスワードを入力してください。')
    // パスワード不一致
    cy.get('[data-test-id="inputEmail"]').clear().type("e2etest@example.com")
    cy.get('[data-test-id="inputPassword"]').clear().type("e2etestx")
    cy.get('[data-test-id="execSignin"]').should('not.have.attr', 'disabled')
    cy.get('[data-test-id="execSignin"]').click()
    cy.wait(2000)
    cy.get('.v-alert').should('contain', '認証に失敗しました。正しいメールアドレス、パスワードを入力してください。')
  });

  // 遷移OKだけ確認
  it('パスワード再設定画面遷移', () => {
    cy.get('[data-test-id="passwordReset"]').click()
    cy.wait(500)
    cy.visit('/auth/password_reset')
    cy.get('.v-card__title').should('contain', 'パスワード再設定')
    cy.get('.v-card__text').should('contain', 'パスワード再設定用のメールアドレスを入力してください。')
  })

  it('サインイン成功', () => {
    cy.visit('/auth/signin')
    cy.get('[data-test-id="inputEmail"]').clear().type("e2etest@example.com")
    cy.get('[data-test-id="inputPassword"]').clear().type("e2eteste")
    cy.get('[data-test-id="execSignin"]').should('not.have.attr', 'disabled')
    cy.get('[data-test-id="execSignin"]').click()
    cy.wait(2000)
    // アカウント登録まだの想定で/account/registerに遷移
    cy.visit('/account/register')
    cy.get('.v-card__title').should('contain', 'アカウント情報登録')
  })

  

  it('サインアップ画面遷移 ', () => {
    cy.visit('/auth/signin')
    cy.get('[data-test-id="pageMoveSignup"]').click()
    cy.wait(500)
    cy.visit('/auth/signup')
    cy.get('.v-card__title').should('contain', 'ユーザー登録')
  })
})