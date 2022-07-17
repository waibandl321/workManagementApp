describe('サインアップ画面', () => {
    it('画面遷移', () => {
        cy.visit('/auth/signup')
        cy.get('.v-card__title').should('contain', 'ユーザー登録')
        cy.get('.v-card__title').should('contain', '外部サービスでアカウント作成')
        // MEMO: Google認証は複雑なので要素存在のみチェック
        cy.get('[data-ut-id="googleSignup"]')
        cy.get('[data-ut-id="pageMoveSignin"]').should('contain', 'ログインはこちら')
    })

    it('入力エラーチェック', () => {
        // メールアドレス値なし
        cy.get('[data-ut-id="inputEmail"]').focus().clear().blur()
        cy.get('.input-error-messsage')
            .should('contain', 'メールアドレスは必須です')
        cy.get('[data-ut-id="execSignup"]').should('have.attr', 'disabled')
        // パスワード値なし
        cy.get('[data-ut-id="inputPassword"]').focus().clear().blur()
        cy.get('.input-error-messsage').should('contain', 'パスワードは必須です')
        cy.get('[data-ut-id="execSignup"]').should('have.attr', 'disabled')
        // メールアドレスバリデーションエラー
        cy.get('[data-ut-id="inputEmail"]').clear().type("hoge")
        cy.get('.input-error-messsage')
            .should('contain', '有効なメールアドレスではありません')
        cy.get('[data-ut-id="execSignup"]').should('have.attr', 'disabled')
        // パスワード7文字エラー
        cy.get('[data-ut-id="inputPassword"]').clear().type('e2etest')
        cy.get('[data-ut-id="execSignup"]').should('have.attr', 'disabled')
        cy.get('.input-error-messsage')
            .should('contain', 'パスワードは8文字以上でなければなりません')
        // パスワード全角エラー
        cy.get('[data-ut-id="inputPassword"]').clear().type('aaaaaaaあ')
        cy.get('[data-ut-id="execSignup"]').should('have.attr', 'disabled')
        cy.get('.input-error-messsage')
            .should('contain', 'パスワードは英数字のみ使用できます')
    })

    it('アカウント登録成功', () => {
        cy.get('[data-ut-id="inputEmail"]').clear().type("e2etest@example.com")
        // パスワード8文字：成功する
        cy.get('[data-ut-id="inputPassword"]').clear().type("e2eteste")
        cy.get('[data-ut-id="execSignup"]').should('not.have.attr', 'disabled')
        // ログイン処理待ち
        cy.get('[data-ut-id="execSignup"]').click()
        cy.wait(2000)
        // 登録完了→アカウント登録画面に遷移
        cy.visit('/account')
        cy.get('.v-card__title').should('contain', 'アカウント情報登録')
    })

    it('アカウント重複', () => {
        cy.visit('/auth/signup')
        cy.get('[data-ut-id="inputEmail"]').clear().type("e2etest@example.com")
        cy.get('[data-ut-id="inputPassword"]').clear().type("e2eteste2etest")
        cy.get('[data-ut-id="execSignup"]').should('not.have.attr', 'disabled')
        // ログイン処理待ち
        cy.get('[data-ut-id="execSignup"]').click()
        cy.wait(2000)
        cy.get('.v-alert')
            .should('contain', '入力された情報のユーザーはすでに登録されている可能性があります。')
    })

    it('サインイン画面遷移', () => {
        cy.get('[data-ut-id="pageMoveSignin"]').click()
        cy.wait(500)
        cy.visit('/auth/signin')
        cy.get('.v-card__title').should('contain', 'サインイン')
    })
})