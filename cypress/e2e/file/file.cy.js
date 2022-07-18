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
        cy.wait(1000)
        cy.get('.v-alert').should('contain', 'を作成しました。')
        cy.get('[data-e2e-id="fileListRecord"]').should('contain', 'hoge folder')
    });

    it('ファイルアップロード実行', () => {
        cy.get('[data-e2e-id="addFile"]').click()
        cy.get('[data-e2e-id="selectFile"]').click()
        cy.get('[data-e2e-id="pseudoInputFile"]').attachFile('git.png');
        cy.wait(1000)
        cy.get('.v-alert').should('contain', 'ファイルをアップロードしました。')
        cy.get('[data-e2e-id="fileListRecord"]').should('contain', 'git.png')
        cy.get('[data-e2e-id="fileListRecord"]').should('have.length', 2)
    });

    it('同名ファイル上書き', () => {
        cy.get('[data-e2e-id="addFile"]').click()
        cy.get('[data-e2e-id="selectFile"]').click()
        cy.get('[data-e2e-id="pseudoInputFile"]').attachFile('git.png');
        cy.wait(1000)
        cy.get('.v-alert').should('contain', 'ファイルをアップロードしました。')
        cy.get('[data-e2e-id="fileListRecord"]').should('contain', 'git.png')
        cy.get('[data-e2e-id="fileListRecord"]').should('have.length', 2)
    });

    it('ファイルアップロード 拡張子エラー', () => {
        cy.get('[data-e2e-id="addFile"]').click()
        cy.get('[data-e2e-id="selectFile"]').click()
        cy.get('[data-e2e-id="pseudoInputFile"]').attachFile('app.json');
        cy.get('.v-alert')
            .should('contain', '許可されていないファイル形式または、ファイルの元データが改ざんされています。')
        cy.get('[data-e2e-id="fileListTable"]').should('not.contain', 'app.json')
    });

    it('ファイル、フォルダ削除キャンセル',  () => {
        cy.get('[data-e2e-id="fileDelete"]').eq(0).click()
        cy.get('.font-weight-bold').should('contain', 'アイテム削除')
        cy.get('.v-card__text').should('contain', 'を削除します。本当によろしいですか？ ')
        cy.get('[data-e2e-id="fileDeleteCancel"]').click()
        cy.get('[data-e2e-id="fileListRecord"]').should('have.length', 2)
    })

    it('ファイル、フォルダ削除実行',  () => {
        cy.get('[data-e2e-id="fileDelete"]').eq(0).click()
        cy.get('.font-weight-bold').should('contain', 'アイテム削除')
        cy.get('.v-card__text').should('contain', 'を削除します。本当によろしいですか？ ')
        cy.get('[data-e2e-id="fileDeleteDone"]').click()
        cy.wait(1000)
        cy.get('.v-alert').should('contain', 'を削除しました。')
        cy.get('[data-e2e-id="fileListRecord"]').should('have.length', 1)
    })
    
    it('ファイル、フォルダ削除実行 レコード0',  () => {
        cy.get('[data-e2e-id="fileDelete"]').eq(0).click()
        cy.get('.font-weight-bold').should('contain', 'アイテム削除')
        cy.get('.v-card__text').should('contain', 'を削除します。本当によろしいですか？ ')
        cy.get('[data-e2e-id="fileDeleteDone"]').click()
        cy.wait(1000)
        cy.get('.v-alert').should('contain', 'を削除しました。')
        cy.get('[data-e2e-id="fileListTable"]').children('tbody').children('tr').should('not.be.visible')
    })

})