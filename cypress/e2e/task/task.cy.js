describe('タスク一覧', () => {
    before(() => {
        cy.appSignin('/task')
    })
    it('タスク一覧表示', () => {
        cy.get('[data-e2e-id="filterText"]')
        cy.get('[data-e2e-id="filterStatus"]')
        cy.get('[data-e2e-id="filterPriority"]')
        cy.get('[data-e2e-id="taskAddButton"]')
        cy.get('[data-e2e-id="taskList"]')
        // cy.get('[data-e2e-id="noItem"]').should('contain', 'アイテムがありません')
    });
    
    it('タスク作成入力エラー', () => {
        cy.get('[data-e2e-id="taskAddButton"]').click()
        cy.get('[data-e2e-id="taskAddInput"]').focus().clear().blur()
        cy.get('.input-error-message').should('contain', 'タスク名は必須です')
        cy.get('[data-e2e-id="taskAddSubmit"]').should('have.attr', 'disabled', 'disabled')
        cy.get('[data-e2e-id="taskAddButton"]').click()
        cy.get('[data-e2e-id="taskAddButtonWrap"]').next().should('not.have.attr', 'data-e2e-id="taskAddInputWrap"')
    });
    
    it('タスク作成実行', () => {
        cy.get('[data-e2e-id="taskAddButton"]').click()
        cy.get('[data-e2e-id="taskAddInput"]').clear().type('hoge task')
        cy.get('[data-e2e-id="taskAddSubmit"]').should('not.have.attr', 'disabled', 'disabled')        
        cy.get('[data-e2e-id="taskAddSubmit"]').click() // 送信
        cy.wait(1000)        
        cy.get('.v-alert').should('contain', 'タスクを新規作成しました') // alertメッセージ
        cy.get('.basic-list').contains('tr', 'hoge task') // 一覧描画チェック
    });

    it('タスク絞り込み（テキスト） true', () => {
        cy.get('[data-e2e-id="filterText"]').clear().type('hoge')
        cy.get('.basic-list').contains('tr', 'hoge task') 
    });
    it('タスク絞り込み（テキスト） false', () => {
        cy.get('[data-e2e-id="filterText"]').clear().type('あ')
        cy.get('[data-e2e-id="taskListRecord"]').should('have.length', 0)
        cy.get('[data-e2e-id="noItem"]').should('contain', 'アイテムがありません')
    });
    it('タスク絞り込み（テキスト） 初期化', () => {
        cy.get('[data-e2e-id="filterText"]').clear()
        cy.get('.basic-list').contains('tr', 'hoge task') 
    })
    // MEMO: ある程度タスクデータを手動で作成した状態で行う
    // it('タスク絞り込み（ステータス）', () => {
        
    // });
    // it('タスク絞り込み（優先度）', () => {
        
    // });
    // it('タスクソート（締切日）', () => {
        
    // });
    // it('タスクソート（作成日時）', () => {
        
    // });

    it('タスク削除 モーダル', () => {
        cy.get('[data-e2e-id="taskListDeleteButton"]').click()
        cy.contains('タスク「hoge task」を削除します。 ')
        cy.contains('.v-card__text', '削除後は復元できません。本当によろしいですか？')
        cy.get('[data-e2e-id="modalcancel"]').should('contain', 'キャンセル')
        cy.get('[data-e2e-id="modaldelete"]').should('contain', '削除する')
    });

    it('タスク削除キャンセル', () => {
        cy.get('[data-e2e-id="modalcancel"]').click()
        cy.get('.basic-list').contains('tr', 'hoge task')
        cy.get('[data-e2e-id="taskListRecord"]').should('have.length', 1)
    })
    it('タスク削除実行', () => {
        cy.get('[data-e2e-id="taskListDeleteButton"]').click()
        cy.get('[data-e2e-id="modaldelete"]').click()
        cy.get('.v-alert').should('contain', 'タスクを削除しました。') // alertメッセージ
        cy.get('[data-e2e-id="taskListRecord"]').should('have.length', 0) //リスト0
        cy.get('[data-e2e-id="noItem"]').should('contain', 'アイテムがありません')
    })
})