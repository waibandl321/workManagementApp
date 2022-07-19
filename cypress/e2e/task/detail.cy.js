describe('タスク詳細', () => {
    before(() => {
        cy.appSignin('/task')
    })

    it('タスク詳細表示', () => {
        cy.get('[data-e2e-id="taskListRecord"]').click()
        cy.get('.v-overlay--active')
        cy.get('[data-e2e-id="taskDetailToolbar"]').contains('hoge task')
        cy.contains('ステータス')
        cy.contains('タスク期日')
        cy.contains('サブタスク')
        cy.contains('タスク概要説明')
        cy.contains('添付ファイル')
    });

    it('タスク名更新', () => {
        cy.get('[data-e2e-id="taskNameEdit"]').click()
        // input値なしの場合は保存ボタン非活性
        cy.get('[data-e2e-id="taskNameInput"]').clear()
        cy.get('[data-e2e-id="taskNameSave"]').should('have.attr', 'disabled', 'disabled')
        // 更新実行
        cy.get('[data-e2e-id="taskNameInput"]').clear().type('hoge task update')
        cy.get('[data-e2e-id="taskNameSave"]').should('not.have.attr', 'disabled', 'disabled')
        cy.get('[data-e2e-id="taskNameSave"]').click()
        cy.get('.v-alert').should('contain', 'タスク名を更新しました。')
        cy.get('[data-e2e-id="taskDetailToolbar"]').contains('hoge task update')
        // リスト更新確認 & 閉じる挙動も同時にテスト
        cy.get('[data-e2e-id="taskDetailClose"]').click()
        cy.get('.v-application').children().not('.v-overlay--active')
        cy.get('.basic-list').contains('tr', 'hoge task update')
    });

    it('タスクステータス更新', () => {
        cy.get('[data-e2e-id="taskListRecord"]').click()
        // 変更
        cy.get('[data-e2e-id="taskDetailStatus"] .v-input__slot').click()
        cy.get('.v-select-list').contains('未着手').click()
        cy.get('.v-select__selection').should('contain', '未着手')
        // もう一度
        cy.get('[data-e2e-id="taskDetailStatus"] .v-input__slot').click()
        cy.get('.v-select-list').contains('処理中').click()
        cy.get('.v-select__selection').should('contain', '処理中')
        // リスト更新確認
        cy.get('[data-e2e-id="taskDetailClose"]').click()
        cy.get('.v-application').children().not('.v-overlay--active')
        cy.get('.basic-list').contains('tr', '処理中')
    });
    it('詳細ステータス更新確認', () => {
        cy.get('[data-e2e-id="taskListRecord"]').click()
        cy.get('[data-e2e-id="taskDetailStatus"] .v-select__selection').should('contain', '処理中')
    });

    it('タスク優先度更新', () => {
        // 変更
        cy.get('[data-e2e-id="taskDetailPriority"] .v-input__slot').click()
        cy.get('.v-select-list').contains('高').click()
        cy.get('.v-select__selection').should('contain', '高')
        // もう一度
        cy.get('[data-e2e-id="taskDetailPriority"] .v-input__slot').click()
        cy.get('.v-select-list').contains('最優先').click()
        cy.get('.v-select__selection').should('contain', '最優先')
        // リスト更新確認
        cy.get('[data-e2e-id="taskDetailClose"]').click()
        cy.get('.v-application').children().not('.v-overlay--active')
        cy.get('.basic-list').contains('tr', '最優先')
    });
    it('詳細優先度更新確認', () => {
        cy.get('[data-e2e-id="taskListRecord"]').click()
        cy.get('[data-e2e-id="taskDetailPriority"] .v-select__selection').should('contain', '最優先')
    });

    it('タスク期日更新', () => {
        
    });
    it('タスク概要説明 エディタ表示', () => {
        
    });
    it('タスク概要説明 更新', () => {
        
    });
    it('ファイルアップロード拡張子エラー', () => {
        
    });
    it('ファイルアップロード実行', () => {
        
    });

    it('サブタスク作成表示', () => {
        
    });
    it('サブタスク作成入力エラー', () => {
        
    });
    it('サブタスク作成実行', () => {
        
    });
    it('サブタスク更新', () => {
       // タイトル
       // 説明文
       // チェック
    });
    it('サブタスク削除', () => {
       
    });
    it('タスク削除', () => {
        
    });
})