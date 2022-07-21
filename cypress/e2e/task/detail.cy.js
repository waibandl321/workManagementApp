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

    // it('タスク名更新', () => {
    //     cy.get('[data-e2e-id="taskNameEdit"]').click()
    //     // input値なしの場合は保存ボタン非活性
    //     cy.get('[data-e2e-id="taskNameInput"]').clear()
    //     cy.get('[data-e2e-id="taskNameSave"]').should('have.attr', 'disabled', 'disabled')
    //     // 更新実行
    //     cy.get('[data-e2e-id="taskNameInput"]').clear().type('hoge task update')
    //     cy.get('[data-e2e-id="taskNameSave"]').should('not.have.attr', 'disabled')
    //     cy.get('[data-e2e-id="taskNameSave"]').click()
    //     cy.get('.v-alert').should('contain', 'タスク名を更新しました。')
    //     cy.get('[data-e2e-id="taskDetailToolbar"]').contains('hoge task update')
    //     // リスト更新確認 & 閉じる挙動も同時にテスト
    //     cy.get('[data-e2e-id="taskDetailClose"]').click()
    //     cy.get('.v-application').children().not('.v-overlay--active')
    //     cy.get('[data-e2e-id="tdTaskName"]').should('contain', 'hoge task update')
    // });

    // it('タスクステータス更新', () => {
    //     cy.get('[data-e2e-id="taskListRecord"]').click()
    //     // 変更
    //     cy.get('[data-e2e-id="taskDetailStatus"] .v-input__slot').click()
    //     cy.get('.v-select-list').contains('未着手').click()
    //     cy.get('.v-select__selection').should('contain', '未着手')
    //     // もう一度
    //     cy.get('[data-e2e-id="taskDetailStatus"] .v-input__slot').click()
    //     cy.get('.v-select-list').contains('処理中').click()
    //     cy.get('.v-select__selection').should('contain', '処理中')
    //     // リスト更新確認
    //     cy.get('[data-e2e-id="taskDetailClose"]').click()
    //     cy.get('.v-application').children().not('.v-overlay--active')
    //     cy.get('[data-e2e-id="tdStatus"]').should('contain', '処理中')
    // });

    // it('詳細ステータス更新確認', () => {
    //     cy.get('[data-e2e-id="taskListRecord"]').click()
    //     cy.get('[data-e2e-id="taskDetailStatus"] .v-select__selection').should('contain', '処理中')
    // });

    // it('タスク優先度更新', () => {
    //     // 変更
    //     cy.get('[data-e2e-id="taskDetailPriority"] .v-input__slot').click()
    //     cy.get('.v-select-list').contains('高').click()
    //     cy.get('.v-select__selection').should('contain', '高')
    //     // もう一度
    //     cy.get('[data-e2e-id="taskDetailPriority"] .v-input__slot').click()
    //     cy.get('.v-select-list').contains('最優先').click()
    //     cy.get('.v-select__selection').should('contain', '最優先')
    //     // リスト更新確認
    //     cy.get('[data-e2e-id="taskDetailClose"]').click()
    //     cy.get('.v-application').children().not('.v-overlay--active')
    //     cy.get('[data-e2e-id="tdPriority"]').should('contain', '最優先')
    // });

    // it('詳細優先度更新確認', () => {
    //     cy.get('[data-e2e-id="taskListRecord"]').click()
    //     cy.get('[data-e2e-id="taskDetailPriority"] .v-select__selection').should('contain', '最優先')
    // });

    // it('タスク期日設定 明日期日', () => {
    //     cy.get('[data-e2e-id="taskDeadlineText"]').should('contain', '未設定')
    //     cy.get('[data-e2e-id="taskDeadlineOpen"]').click()
    //     // 明日の日付を締め切り日に指定
    //     cy.get('.v-date-picker-table__current').parent().next().children('.v-btn').click()
    //     cy.get('[data-e2e-id="taskDeadlineValue"]').should('have.value', getDate(1))
    //     // 保存
    //     cy.get('[data-e2e-id="taskDeadlineSave"]').click()
    //     cy.get('.v-alert').should('contain', 'タスク期日を変更しました')
    //     // 変更チェック
    //     cy.get('[data-e2e-id="taskDeadlineText"]').should('contain', getDate(1))
    //     cy.get('[data-e2e-id="taskTermText"]').contains('2日間')
    //     cy.get('[data-e2e-id="taskDaysLeft"]').contains('1日')
    // });

    // it('タスク期日消去', () => {
    //     cy.get('[data-e2e-id="taskDeadlineOpen"]').click()
    //     cy.get('[data-e2e-id="taskDeadlineDelete"]').click()
    //     cy.get('[data-e2e-id="taskDeadlineText"]').contains('未設定')
    //     cy.get('[data-e2e-id="taskTermText"]').contains('未設定')
    // });

    // it('タスク期日 期限切れ', () => {
    //     cy.get('[data-e2e-id="taskDeadlineOpen"]').click()
    //     // 昨日の日付を締め切り日に指定
    //     cy.get('.v-date-picker-table__current').parent().prev().children('.v-btn').click()
    //     cy.get('[data-e2e-id="taskDeadlineValue"]').should('have.value', getDate(-1))
    //     // 保存
    //     cy.get('[data-e2e-id="taskDeadlineSave"]').click()
    //     cy.get('.v-alert').should('contain', 'タスク期日を変更しました')
    //     // 変更チェック
    //     cy.get('[data-e2e-id="alertDeadline"]').should('contain', 'タスクが期日を過ぎています')
    //     cy.get('[data-e2e-id="taskTermText"]').contains('0日間')
    //     cy.get('[data-e2e-id="taskDaysLeft"]').contains('期限切れ')
    // });

    // it('タスク期日消去', () => {
    //     cy.get('[data-e2e-id="taskDeadlineOpen"]').click()
    //     cy.get('[data-e2e-id="taskDeadlineDelete"]').click()
    //     cy.get('[data-e2e-id="taskDeadlineText"]').contains('未設定')
    //     cy.get('[data-e2e-id="taskTermText"]').contains('未設定')
    // });

    // it('タスク期日設定 本日期日', () => {
    //     cy.get('[data-e2e-id="taskDeadlineText"]').should('contain', '未設定')
    //     cy.get('[data-e2e-id="taskDeadlineOpen"]').click()
    //     // 今日の日付を締め切り日に指定
    //     cy.get('.v-date-picker-table__current').click()
    //     cy.get('[data-e2e-id="taskDeadlineValue"]').should('have.value', getDate())
    //     // 保存
    //     cy.get('[data-e2e-id="taskDeadlineSave"]').click()
    //     cy.get('.v-alert').should('contain', 'タスク期日を変更しました')
    //     cy.get('[data-e2e-id="taskDeadlineText"]').should('contain', getDate())
    //     // 変更チェック
    //     cy.get('[data-e2e-id="alertDeadline"]').should('contain', '本日期日です')
    //     cy.get('[data-e2e-id="taskTermText"]').contains('1日間')
    //     cy.get('[data-e2e-id="taskDaysLeft"]').contains('本日期日')
    // });

    // it('タスク期日 リスト更新確認', () => {
    //     cy.get('[data-e2e-id="taskDetailClose"]').click()
    //     cy.get('.v-application').children().not('.v-overlay--active')
    //     cy.get('[data-e2e-id="tdDeadline"]').should('contain', getDate())
    //     cy.get('[data-e2e-id="tdTerm"]').should('contain', '1日間')
    // });

    it('サブタスク作成 表示確認', () => {
        cy.get('[data-e2e-id="subtaskCreateButton"]').click()
        cy.get('.subtask-edit-modal').contains('[data-e2e-id="subtaskEditTitle"]', 'サブタスク作成')
        cy.get('[data-e2e-id="subtaskNameInput"]')
        cy.get('[data-e2e-id="subtaskDescriptionEditor"]')
    });
    it('サブタスク作成 入力エラー', () => {
        cy.get('[data-e2e-id="subtaskNameInput"]').focus().clear().blur()
        cy.get('.input-error-message').should('contain', 'サブタスク名は必須です')
        cy.get('[data-e2e-id="subtaskEditsave"]').should('have.attr', 'disabled', 'disabled')
    });
    it('サブタスク作成 キャンセル', () => {
        cy.get('[data-e2e-id="subtaskEditcancel"]').click()
        cy.get('.v-dialog').should('not.have.class', '.subtask-edit-modal')
    });
    it('サブタスク作成実行', () => {
        cy.get('[data-e2e-id="subtaskCreateButton"]').click()
        cy.get('[data-e2e-id="subtaskNameInput"]').clear().type('hoge subtask')
        cy.get('[data-e2e-id="subtaskEditsave"]').should('not.have.attr', 'disabled')
        // 保存実行
        cy.get('[data-e2e-id="subtaskEditsave"]').click()
        cy.wait(1000)
        cy.get('.v-dialog').should('not.have.class', '.subtask-edit-modal')
        cy.get('.v-alert').should('contain', 'サブタスクを新規作成しました。')
        // 追加されているか確認
        cy.get('[data-e2e-id="subtaskCard"]').contains('hoge subtask')

    });
    it('サブタスク更新', () => {
       // タイトル
       // 説明文
       // チェック
    });
    it('サブタスク削除', () => {
       
    });

    it('タスク概要説明 エディタ表示', () => {
        
    });
    it('タスク概要説明 更新', () => {
        
    });
    it('ファイルアップロード拡張子エラー', () => {
        
    });
    it('ファイルアップロード実行', () => {
        
    });

    it('タスク削除', () => {
        
    });
})

function getDate(addition_date = 0) {
    const date = new Date()
    const year = date.getFullYear()
    const month = zeroPadding(date.getMonth()+1)
    const day = zeroPadding(date.getDate() + addition_date)
    return String(year + '-' + month + '-' + day)
}
function zeroPadding(value) {
    return ("0" + value).slice(-2);
}