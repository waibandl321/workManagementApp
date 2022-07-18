describe('アカウント登録', () => {
    before(() => {
        cy.appSignin()
        // cy.appSignin({ email: "e2etest@example.com", password: "e2eteste" })
    })
    it('画面遷移', () => {
        cy.get('.v-card__title').should('contain', 'アカウント情報登録')
        cy.get('[data-e2e-id="lastName"]')
        cy.get('[data-e2e-id="firstName"]')
        cy.get('[data-e2e-id="accountRegister"').should('have.attr', 'disabled', 'disabled')
    })
    
    it('入力エラー', () => {
        cy.get('[data-e2e-id="lastName"]').focus().clear().blur()
        cy.get('.input-error-message').should('contain', '性は必須です')
        cy.get('[data-e2e-id="accountRegister"').should('have.attr', 'disabled', 'disabled')
        cy.get('[data-e2e-id="firstName"]').focus().clear().blur()
        cy.get('.input-error-message').should('contain', '名は必須です')
        cy.get('[data-e2e-id="accountRegister"').should('have.attr', 'disabled', 'disabled')
    });

    it('登録成功', () => {
        cy.get('[data-e2e-id="lastName"]').clear().type('hoge')
        cy.get('[data-e2e-id="firstName"]').clear().type('chan')
        cy.get('[data-e2e-id="accountRegister"').should('not.have.attr', 'disabled', 'disabled')
        cy.get('[data-e2e-id="accountRegister"').click()
        cy.wait(1000)
        cy.get('.v-alert').should('contain', 'アカウント情報登録が完了しました。')
        cy.get('[data-e2e-id="startApp"]').should('contain', 'アプリケーションの利用を開始する')
        // 遷移テストはなし
        cy.get('[data-e2e-id="startApp"]').click()
        cy.wait(500)
        // 登録名確認
        cy.get('.header').within(() => {
            cy.get('[data-e2e-id="headerAccountName"]').should('contain', 'hoge chan')
        })
    });
})