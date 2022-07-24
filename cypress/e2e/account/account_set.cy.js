describe('アカウント登録', () => {
    before(() => {
        cy.appSignin('account/register')
        // cy.appSignin({ email: "e2etest@example.com", password: "e2eteste" })
    })
    it('画面遷移', () => {
        cy.get('.v-card__title').should('contain', 'アカウント情報登録')
        cy.get('[data-test-id="lastName"]')
        cy.get('[data-test-id="firstName"]')
        cy.get('[data-test-id="accountRegister"').should('have.attr', 'disabled', 'disabled')
    })
    
    it('入力エラー', () => {
        cy.get('[data-test-id="lastName"]').focus().clear().blur()
        cy.get('.input-error-message').should('contain', '性は必須です')
        cy.get('[data-test-id="accountRegister"').should('have.attr', 'disabled', 'disabled')
        cy.get('[data-test-id="firstName"]').focus().clear().blur()
        cy.get('.input-error-message').should('contain', '名は必須です')
        cy.get('[data-test-id="accountRegister"').should('have.attr', 'disabled', 'disabled')
    });

    it('登録成功', () => {
        cy.get('[data-test-id="lastName"]').clear().type('hoge')
        cy.get('[data-test-id="firstName"]').clear().type('chan')
        cy.get('[data-test-id="accountRegister"').should('not.have.attr', 'disabled', 'disabled')
        cy.get('[data-test-id="accountRegister"').click()
        cy.wait(1000)
        cy.get('.v-alert').should('contain', 'アカウント情報登録が完了しました。')
        cy.get('[data-test-id="startApp"]').should('contain', 'アプリケーションの利用を開始する')
        // 遷移テストはなし
        cy.get('[data-test-id="startApp"]').click()
        cy.wait(500)
        // 登録名確認
        cy.get('.header').within(() => {
            cy.get('[data-test-id="headerAccountName"]').should('contain', 'hoge chan')
        })
    });
})