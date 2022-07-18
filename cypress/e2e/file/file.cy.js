describe('ファイル管理', () => {
    before(() => {
        cy.appSignin('/file')
    })

    it('初期表示チェック', () => {
        cy.get('[data-e2e-id="fileSearchInput"]')
        cy.get('[data-e2e-id="fileBreadcrumbs"]')
        cy.get('[data-e2e-id="fileListTable"]')
        cy.get('[data-e2e-id="addFile"]')
    });

    it('フォルダ作成モーダル', () => {
        cy.get('[data-e2e-id="addFile"]').click()
        cy.get('[data-e2e-id="createFolder"]')
        cy.get('[data-e2e-id="createFolder"]').click()
        cy.contains('.v-card', 'フォルダ作成')
    });

    it('フォルダ作成 入力エラー&キャンセル', () => {
        cy.get('[data-e2e-id="createFolderInput"]').focus().clear().blur()
        cy.get('.input-error-messsage').should('contain', 'フォルダ名は必須です')
        cy.get('[data-e2e-id="createFolderSave"]').should('have.attr', 'disabled', 'disabled')
        cy.get('[data-e2e-id="createFolderCancel"]').click()
        cy.get('[data-e2e-id="fileListTable"]').should('not.contain', 'hoge folder')
    });

    it('フォルダ作成 実行', () => {
        cy.get('[data-e2e-id="addFile"]').click()
        cy.get('[data-e2e-id="createFolder"]').click()
        cy.get('[data-e2e-id="createFolderInput"]').clear().type('hoge folder')
        cy.get('[data-e2e-id="createFolderSave"]').should('not.have.attr', 'disabled', 'disabled')
        cy.get('[data-e2e-id="createFolderSave"]').click()
        cy.get('.v-alert').should('contain', 'を作成しました。')
        cy.get('[data-e2e-id="fileListRecord"]').should('contain', 'hoge folder')
    });

})