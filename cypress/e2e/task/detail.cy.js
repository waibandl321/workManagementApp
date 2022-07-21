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
        cy.get('[data-e2e-id="taskNameSave"]').should('not.have.attr', 'disabled')
        cy.get('[data-e2e-id="taskNameSave"]').click()
        cy.get('.v-alert').should('contain', 'タスク名を更新しました。')
        cy.get('[data-e2e-id="taskDetailToolbar"]').contains('hoge task update')
        // リスト更新確認 & 閉じる挙動も同時にテスト
        cy.get('[data-e2e-id="taskDetailClose"]').click()
        cy.get('.v-application').children().not('.v-overlay--active')
        cy.get('[data-e2e-id="tdTaskName"]').should('contain', 'hoge task update')
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
        cy.get('[data-e2e-id="tdStatus"]').should('contain', '処理中')
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
        cy.get('[data-e2e-id="tdPriority"]').should('contain', '最優先')
    });

    it('詳細優先度更新確認', () => {
        cy.get('[data-e2e-id="taskListRecord"]').click()
        cy.get('[data-e2e-id="taskDetailPriority"] .v-select__selection').should('contain', '最優先')
    });

    it('タスク期日設定 明日期日', () => {
        cy.get('[data-e2e-id="taskDeadlineText"]').should('contain', '未設定')
        cy.get('[data-e2e-id="taskDeadlineOpen"]').click()
        // 明日の日付を締め切り日に指定
        cy.get('.v-date-picker-table__current').parent().next().children('.v-btn').click()
        cy.get('[data-e2e-id="taskDeadlineValue"]').should('have.value', getDate(1))
        // 保存
        cy.get('[data-e2e-id="taskDeadlineSave"]').click()
        cy.get('.v-alert').should('contain', 'タスク期日を変更しました')
        // 変更チェック
        cy.get('[data-e2e-id="taskDeadlineText"]').should('contain', getDate(1))
        cy.get('[data-e2e-id="taskTermText"]').contains('2日間')
        cy.get('[data-e2e-id="taskDaysLeft"]').contains('1日')
    });

    it('タスク期日消去', () => {
        cy.get('[data-e2e-id="taskDeadlineOpen"]').click()
        cy.get('[data-e2e-id="taskDeadlineDelete"]').click()
        cy.get('[data-e2e-id="taskDeadlineText"]').contains('未設定')
        cy.get('[data-e2e-id="taskTermText"]').contains('未設定')
    });

    it('タスク期日 期限切れ', () => {
        cy.get('[data-e2e-id="taskDeadlineOpen"]').click()
        // 昨日の日付を締め切り日に指定
        cy.get('.v-date-picker-table__current').parent().prev().children('.v-btn').click()
        cy.get('[data-e2e-id="taskDeadlineValue"]').should('have.value', getDate(-1))
        // 保存
        cy.get('[data-e2e-id="taskDeadlineSave"]').click()
        cy.get('.v-alert').should('contain', 'タスク期日を変更しました')
        // 変更チェック
        cy.get('[data-e2e-id="alertDeadline"]').should('contain', 'タスクが期日を過ぎています')
        cy.get('[data-e2e-id="taskTermText"]').contains('0日間')
        cy.get('[data-e2e-id="taskDaysLeft"]').contains('期限切れ')
    });

    it('タスク期日消去', () => {
        cy.get('[data-e2e-id="taskDeadlineOpen"]').click()
        cy.get('[data-e2e-id="taskDeadlineDelete"]').click()
        cy.get('[data-e2e-id="taskDeadlineText"]').contains('未設定')
        cy.get('[data-e2e-id="taskTermText"]').contains('未設定')
    });

    it('タスク期日設定 本日期日', () => {
        cy.get('[data-e2e-id="taskDeadlineText"]').should('contain', '未設定')
        cy.get('[data-e2e-id="taskDeadlineOpen"]').click()
        // 今日の日付を締め切り日に指定
        cy.get('.v-date-picker-table__current').click()
        cy.get('[data-e2e-id="taskDeadlineValue"]').should('have.value', getDate())
        // 保存
        cy.get('[data-e2e-id="taskDeadlineSave"]').click()
        cy.get('.v-alert').should('contain', 'タスク期日を変更しました')
        cy.get('[data-e2e-id="taskDeadlineText"]').should('contain', getDate())
        // 変更チェック
        cy.get('[data-e2e-id="alertDeadline"]').should('contain', '本日期日です')
        cy.get('[data-e2e-id="taskTermText"]').contains('1日間')
        cy.get('[data-e2e-id="taskDaysLeft"]').contains('本日期日')
    });

    it('タスク期日 リスト更新確認', () => {
        cy.get('[data-e2e-id="taskDetailClose"]').click()
        cy.get('.v-application').children().not('.v-overlay--active')
        cy.get('[data-e2e-id="tdDeadline"]').should('contain', getDate())
        cy.get('[data-e2e-id="tdTerm"]').should('contain', '1日間')
    });

    it('サブタスク作成 表示確認', () => {
        cy.get('[data-e2e-id="taskListRecord"]').click()
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
    it('サブタスク 作成実行', () => {
        cy.get('[data-e2e-id="subtaskCreateButton"]').click()
        cy.get('[data-e2e-id="subtaskNameInput"]').clear().type('hoge subtask')
        cy.get('.subtask-edit-modal .ql-editor').clear().type('hoge subtask description')
        cy.get('[data-e2e-id="subtaskEditsave"]').should('not.have.attr', 'disabled')
        // 保存実行
        cy.get('[data-e2e-id="subtaskEditsave"]').click()
        cy.wait(1000)
        cy.get('.v-dialog').should('not.have.class', '.subtask-edit-modal')
        cy.get('.v-alert').should('contain', 'サブタスクを新規作成しました。')
        // 追加されているか確認
        cy.get('[data-e2e-id="subtaskCard"]').contains('hoge subtask')

    });
    it('サブタスク 詳細表示', () => {
        cy.get('[data-e2e-id="subtaskCard"]').click()
        // 要素チェック
        cy.get('.subtask-view-modal').contains('[data-e2e-id="subtaskTitle"]', 'サブタスク詳細')
        cy.get('.subtask-view-modal').contains('サブタスク名')
        cy.get('.subtask-view-modal').contains('サブタスク詳細')
        // タイトル・説明文
        cy.get('[data-e2e-id="subtaskName"]').should('contain', 'hoge subtask')
        cy.get('[data-e2e-id="subtaskDescription"]').should('contain', 'hoge subtask description')
    });
    it('サブタスク 詳細→編集 切り替え', () => {
        cy.get('[data-e2e-id="subtaskViewedit"]').click()
        cy.get('.subtask-edit-modal').contains('サブタスク更新')
        // 値チェック
        cy.get('[data-e2e-id="subtaskNameInput"]').should('have.value', 'hoge subtask')
        cy.get('.ql-editor').contains('hoge subtask description')
    });

    it('サブタスク 更新', () => {
        // タイトル消すと保存ボタン押せない
        cy.get('[data-e2e-id="subtaskNameInput"]').clear().blur()
        cy.get('.input-error-message').should('contain', 'サブタスク名は必須です')
        cy.get('[data-e2e-id="subtaskEditsave"]').should('have.attr', 'disabled', 'disabled')
        // 更新実行
        cy.get('[data-e2e-id="subtaskNameInput"]').clear().type('hoge subtask update')
        cy.get('.subtask-edit-modal .ql-editor').clear().type('hoge subtask description update')
        cy.get('[data-e2e-id="subtaskEditsave"]').click()
        cy.wait(1000)
        cy.get('.v-dialog').should('not.have.class', '.subtask-edit-modal')
        cy.get('.v-alert').should('contain', 'サブタスクを更新しました。')
        // 更新確認
        cy.get('[data-e2e-id="subtaskCard"]').contains('hoge subtask update')
    });

    it('サブタスク チェック', () => {
        cy.get('[data-e2e-id="subtaskCheckButton"]').click()
        cy.get('[data-e2e-id="subtaskCheckButton"]').should('have.class', 'primary')
        // サブタスクの完了取り消しはなし
        cy.get('[data-e2e-id="subtaskCheckButton"]').click()
        cy.get('[data-e2e-id="subtaskCheckButton"]').should('have.class', 'primary')
    });
    it('サブタスク 削除', () => {
        cy.get('[data-e2e-id="subtaskDeleteButton"]').click()
        cy.get('.v-alert').should('contain', 'サブタスクを削除しました。')
        cy.get('[data-e2e-id="noSubtask"]').should('contain', 'サブタスクはありません')
    });
    

    // memo: エディタ機能のテストはなし
    it('タスク概要説明 表示確認', () => {
        cy.get('[data-e2e-id="taskDescriptionText"]').should('contain', 'タスクの詳細がありません')
        cy.get('[data-e2e-id="taskDescriptionEdit"]').should('contain', '概要を編集')
    });
    it('タスク概要説明 編集', () => {
        cy.get('[data-e2e-id="taskDescriptionEdit"]').click()
        cy.get('[data-e2e-id="taskDescriptionEditor"] .ql-editor').type('hoge task description')
        // 保存処理
        cy.get('[data-e2e-id="taskDescriptionSave"]').click()
        cy.get('.v-alert').should('contain', 'タスク概要説明を更新しました。')
        cy.get('[data-e2e-id="taskDescriptionText"]').contains('hoge task description')
    });

    it('タスク概要説明 編集', () => {
        cy.get('[data-e2e-id="taskDescriptionEdit"]').click()
        cy.get('[data-e2e-id="taskDescriptionEditor"] .ql-editor').clear().type('hoge task description update')
        // 保存処理
        cy.get('[data-e2e-id="taskDescriptionSave"]').click()
        cy.get('[data-e2e-id="taskDescriptionText"]').contains('hoge task description update')
    });

    it('添付ファイル 要素確認', () => {
        cy.get('[data-e2e-id="taskAttachmentNothing"]').should('contain', '添付ファイルはありません。')
    });
    it('添付ファイル アップロード拡張子エラー', () => {
        

    });
    it('添付ファイル アップロード成功', () => {
        cy.get('[data-e2e-id="taskAttachmentButton"]').click()
        cy.get('[data-e2e-id="taskAttachmentInput"]').attachFile('git.png');
        cy.wait(2000)
        cy.get('.v-alert').should('contain', 'ファイルをアップロードしました。')
        // 確認
        cy.get('[data-e2e-id="taskAttachmentLength"]').contains('1')
        cy.get('[data-e2e-id="taskAttachmentAllDelete"]').should('contain', '全ファイル削除')
        cy.get('[data-e2e-id="taskAttachmentList"]').contains('git.png')
        cy.get('[data-e2e-id="taskAttachmentView"]').should('have.attr', 'src')
    });
    it('添付ファイル プレビュー', () => {
        // 一応属性とhrefのURLチェックはしておく
        cy.get('[data-e2e-id="taskAttachmentPreviewButton"]')
            .should('have.attr', 'href')
            .and('include', 'git.png')
        // memo: crosブロックのためクリックまで
        // 正常なら、cypressアプリで別タブでプレビューが開く
        cy.get('[data-e2e-id="taskAttachmentPreviewButton"]').click()
    });
    it('添付ファイル 削除キャンセル', () => {
        cy.get('[data-e2e-id="taskAttachmentDelete"]').click()
        cy.get('.v-dialog').contains('ファイル「git.png」を削除します。')
        cy.get('[data-e2e-id="modalcancel"]').click()
        cy.get('[data-e2e-id="taskAttachmentList"]').contains('git.png')
    });
    it('添付ファイル 1つ削除', () => {
        cy.get('[data-e2e-id="taskAttachmentDelete"]').click()
        cy.get('.v-dialog').contains('ファイル「git.png」を削除します。')
        cy.get('[data-e2e-id="modaldelete"]').click()
        cy.wait(2000)
        cy.get('.v-alert').should('contain', 'ファイルgit.pngを削除しました。')
        cy.get('[data-e2e-id="taskAttachmentNothing"]').should('contain', '添付ファイルはありません。')
    });

    it('ファイル再アップ 複数', () => {
        cy.get('[data-e2e-id="taskAttachmentButton"]').click()
        cy.get('[data-e2e-id="taskAttachmentInput"]').attachFile('git.png');
        cy.wait(2000)
        cy.get('[data-e2e-id="taskAttachmentButton"]').click()
        cy.get('[data-e2e-id="taskAttachmentInput"]').attachFile('npm.png');
        cy.wait(2000)
        cy.get('[data-e2e-id="taskAttachmentList"]').contains('git.png')
        cy.get('[data-e2e-id="taskAttachmentList"]').contains('npm.png')
        cy.get('[data-e2e-id="taskAttachmentLength"]').contains('2')
    });
    it('添付ファイル まとめて削除', () => {
        cy.get('[data-e2e-id="taskAttachmentAllDelete"]').click()
        cy.get('.v-dialog').contains('このタスクにアップされている全てのファイルを削除します')
        cy.get('[data-e2e-id="modaldelete"]').click()
        cy.wait(2000)
        cy.get('.v-alert').should('contain', '全てのファイルを削除しました。')
        cy.get('[data-e2e-id="taskAttachmentNothing"]').should('contain', '添付ファイルはありません。')
    });

    it('タスク削除', () => {
        cy.get('[data-e2e-id="taskDetailDelete"]').click()
        cy.get('.v-dialog').contains('タスク「hoge task update」を削除します。')
        cy.get('[data-e2e-id="modaldelete"]').click()
        cy.get('[data-e2e-id="noItem"]').should('contain', 'アイテムがありません')
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