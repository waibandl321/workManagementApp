describe('ダッシュボード', () => {
    before(() => {
        cy.appSignin('/')
    })

    it('表示チェック', () => {
        cy.get('.dashboard-card-title').should('contain', 'タスク完了率（週間・月間）')
        cy.get('.dashboard-card-title').should('contain', '期限切れ率（週間・月間）')
        cy.get('.v-card__title.justify-center').should('contain', 'アクティブタスク数')
        cy.get('.v-card__title.justify-center').should('contain', '期限切れタスク数')
        cy.get('.v-card__title.justify-center').should('contain', '完了タスク数')
        cy.get('.dashboard-list-title').should('contain', '期限が１週間以内のタスク')
        cy.get('.dashboard-list-title').should('contain', '期限超過のタスク')
        cy.get('.dashboard-list-title').should('contain', '本日期限のタスク')
        cy.get('.dashboard-list-title').should('contain', '完了したタスク')
    });

    // タスク登録後確認
})