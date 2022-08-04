import TaskDetailTest from '@/components/pages/task/TaskDetailTest.vue'
import Utils from '@/mixin/common/util.js'
import Vuetify from 'vuetify'
import { quillEditor } from 'vue-quill-editor'
import { createLocalVue, mount, config } from '@vue/test-utils'
import flushPromises from 'flush-promises';

config.showDeprecationWarnings = false
jest.useFakeTimers();

describe('TaskDetailTest.vue', () => {
    const localVue = createLocalVue()
    localVue.use(Utils)
    let vuetify
    // 共通処理
    const mockFunction = jest.fn();
    const mountFunction = options => {
        return mount(TaskDetailTest, {
            localVue,
            vuetify,
            propsData: {
                detailItem: DETAIL,
                detailMode: true,
                listRefresh: mockFunction
            },
            provide: {
                task_status_list: TASK_STATUS,
                task_priority_list: TASK_PRIORITIES,
            },
            methods: {
                judgeRemainingDays: jest.fn(() => -1)
            },
            ...options
        })
    }
    beforeEach(() => {
        vuetify = new Vuetify()
    })
    it('1. provide/inject', () => {
        const wrapper = mountFunction()
        const status_result = wrapper.vm.task_status_list.find(v => v.text === "指定しない")
        const priority_result = wrapper.vm.task_priority_list.find(v => v.text === "指定しない")
        expect(status_result.text).toBe("指定しない")
        expect(priority_result.text).toBe("指定しない")
    })
    it('1. PropsとDOM', () => {
        const wrapper = mountFunction()
        expect(wrapper.get('[data-test-id="taskDetailToolbar"]').text()).toContain("hoge task")
        expect(wrapper.get('[data-test-id="taskDeadlineText"]').text()).toBe("2022-08-03");
        expect(wrapper.get('[data-test-id="taskCreatedText"]').text()).toContain("2022-08-02");
        expect(wrapper.get('[data-test-id="taskTermText"]').text()).toContain("2日間");
        // expect(wrapper.get('[data-test-id="taskDaysLeft"]').text()).toContain("1日");
        expect(wrapper.get('[data-test-id="noSubtask"]').text()).toBe("サブタスクはありません")
        expect(wrapper.get('[data-test-id="taskDescriptionText"]').text()).toContain("hoge task description");
        expect(wrapper.get('[data-test-id="taskAttachmentNothing"]').text()).toBe("添付ファイルはありません。")
        expect(wrapper.get('[data-test-id="taskAttachmentLength"]').text()).toBe("0 Files")
    })

    it('3-a-1 サクセスメッセージ', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            messages: {
                success: "成功hogehoge",
            },
        })
        await flushPromises()
        expect(wrapper.get('.v-alert.success').text()).toBe("成功hogehoge")
    });
    it('3-a-2  エラーメッセージ', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            messages: {
                error: "error hogehoge",
            },
        })
        await flushPromises()
        expect(wrapper.get('.v-alert.error').text()).toBe("error hogehoge")
    });
    it('3-b-1  編集モードアクティブ', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            task_name_edit_mode: false
        })
        await flushPromises()
        wrapper.get('[data-test-id="taskNameEdit"]').trigger('click');
        expect(wrapper.vm.task_name_edit_mode).toBeTruthy()
    });
    it('3-b-3  タスク名 input→data', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            task_name_edit_mode: true
        })
        await flushPromises()
        wrapper.get('[data-test-id="taskNameInput"]').setValue("hoge task update");
        expect(wrapper.vm.detail.task_name).toBe("hoge task update")
    });
    it('3-b-4 タスク名 data→input', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            task_name_edit_mode: true,
            detail: {
                task_name: "hoge task update"
            }
        })
        await flushPromises()
        expect(wrapper.get('[data-test-id="taskNameInput"]').element.value).toBe("hoge task update");
    });
    it('3-b-5 保存処理 関数呼び出し', async () => {
        const _mockFunction = jest.fn(() => "save dummy")
        const wrapper = mountFunction()
        wrapper.setData({
            task_name_edit_mode: true,
            detail: {
                task_name: "hoge task update"
            }
        })
        wrapper.vm.updateTaskName = _mockFunction
        await flushPromises()
        wrapper.get('[data-test-id="taskNameSave"]').trigger('click');
        expect(wrapper.vm.updateTaskName()).toBe("save dummy");
        expect(_mockFunction).toHaveBeenCalled()
    });

    it('3-b-6 タスク削除 関数コール＋モーダル出現', async () => {
        const _mockFunction = jest.fn(() => "delete dummy");
        const wrapper = mountFunction()
        wrapper.setData({
            task_name_edit_mode: true,
        })
        wrapper.vm.clickTaskDelete = _mockFunction
        setTimeout(() => {
            wrapper.get('[data-test-id="taskDetailDelete"]').trigger('click');
            // delete_modal
            expect(wrapper.vm.delete_modal).toBeTruthy()
            // call function
            expect(wrapper.vm.clickTaskDelete()).toBe("delete dummy");
            expect(_mockFunction).toHaveBeenCalled()
        }, 500);
    });

    it('3-b-7 closeボタン 関数コール', async () => {
        const _mockFunction = jest.fn(() => "delete close");
        const wrapper = mountFunction()
        wrapper.setData({
            task_name_edit_mode: true,
        })
        wrapper.vm.clickTaskDelete = _mockFunction
        await flushPromises()
        wrapper.get('[data-test-id="taskDetailClose"]').trigger('click');
        expect(wrapper.vm.clickTaskDelete()).toBe("delete close");
        expect(_mockFunction).toHaveBeenCalled()
    });
    // ステータス設定
    it('3-c-1 selectbox ステータス', async() => {
        const wrapper = mountFunction();
        wrapper.setData({
            detail: {
                task_status: 1
            }
        })
        await flushPromises()
        expect(wrapper.get('[data-test-id="taskDetailStatus"] .v-select__selections').text()).toBe("未着手")
    });

    // 優先度設定
    it('3-c-1 selectbox 優先度', async () => {
        const wrapper = mountFunction();
        wrapper.setData({
            detail: {
                task_priority: 3
            }
        })
        await flushPromises()
        expect(wrapper.get('[data-test-id="taskDetailPriority"] .v-select__selections').text()).toBe("低")
    });

    // タスク期日
    it('3-c-1 task期日 カレンダー表示', async () => {
        const wrapper = mountFunction();
        wrapper.setData({
            term_setting: false,
        })
        await flushPromises()
        wrapper.get('[data-test-id="taskDeadlineOpen"]').trigger('click');
        expect(wrapper.vm.term_setting).toBeTruthy()
    });
    it('3-c-1 task期日 日付反映', async () => {
        const wrapper = mountFunction();
        wrapper.setData({
            detail: {
                task_deadline: 1659397152
            },
        })
        await flushPromises()
        expect(wrapper.get('[data-test-id="taskDeadlineText"]').text()).toBe("2022-08-02")
    });
    it('3-c-1 task期日 日付消去 関数コール', async () => {
        const _mockFunction = jest.fn(() => "dummy delete date");
        const wrapper = mountFunction();
        wrapper.setData({
            detail: {
                task_deadline: 1659397152,
            },
            term_setting: true,
        })
        wrapper.vm.deleteTaskTerm = _mockFunction;
        await flushPromises()
        wrapper.get('[data-test-id="taskDeadlineDelete"]').trigger('click');
        expect(wrapper.vm.deleteTaskTerm()).toBe("dummy delete date")
        expect(_mockFunction).toHaveBeenCalled()
    });
    it('3-c-1 task期日 日付消去 値null', async () => {
        const wrapper = mountFunction();
        wrapper.setData({
            detail: {
                task_deadline: 1659397152,
            },
            term_setting: true,
        })
        await flushPromises()
        wrapper.get('[data-test-id="taskDeadlineDelete"]').trigger('click');
        // 通信処理あるので時間確保
        setTimeout(() => {
            expect(wrapper.vm.detail.task_deadline).toBeNull()
        }, 3000)
    });
    it('3-f-1 期日アラート 期限切れ', async () => {
        const wrapper = mountFunction()
        await flushPromises()
        // judgeRemainingDaysのモック関数で-1(期限切れを返すように設定)
        expect(wrapper.get('[data-test-id="alertDeadline"]').text()).toBe("タスクが期日を過ぎています")
        
    });
    // judgeRemainingDaysのモック関数が0（本日期日）を返す場合
    // it('3-f-1 期日アラート 本日期日', async () => {
    //     const wrapper = mountFunction()
    //     await flushPromises()
    //     expect(wrapper.get('[data-test-id="alertDeadline"]').text()).toBe("本日期日です")
    // });

    // サブタスク
    it('3-g-1 サブタスク追加 モーダル出現', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            subtask_mode: "task"
        })
        await flushPromises()
        wrapper.get('[data-test-id="subtaskCreateButton"]').trigger("click");
        expect(wrapper.vm.subtask_mode).toBe("subtask_edit")
    });
    it('3-g-1 サブタスク追加 モーダル関数コール', async () => {
        const _mockFunction = jest.fn(() => "dummy call subtask modal");
        const wrapper = mountFunction()
        wrapper.setData({
            subtask_mode: "task"
        })
        wrapper.vm.clickSubtaskNew = _mockFunction
        await flushPromises()
        wrapper.get('[data-test-id="subtaskCreateButton"]').trigger("click");
        expect(_mockFunction).toHaveBeenCalled();
        expect(wrapper.vm.clickSubtaskNew()).toBe("dummy call subtask modal");
    });
    it('3-g-2 サブタスク一覧チェック', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            subtask_mode: "task",
            subtask_list: ARRAY_SUBTASK
        })
        await flushPromises()
        // レコード数増やした場合もテスト済み
        expect(wrapper.get('[data-test-id="subtaskList"]').text()).toContain("hoge subtask")
        expect(wrapper.findAll('[data-test-id="subtaskList"]')).toHaveLength(1)
    });
    it('3-g-3 サブタスク詳細 関数コール', async () => {
        const _mockFunction = jest.fn(() => "dummy click subtask record");
        const wrapper = mountFunction()
        wrapper.setData({
            subtask_mode: "task",
            subtask_list: ARRAY_SUBTASK
        })
        wrapper.vm.clickSubtaskRecord = _mockFunction
        await flushPromises()
        wrapper.findAll('[data-test-id="subtaskList"]').at(0)
               .get('[data-test-id="subtaskCard"]').trigger('click');
        expect(_mockFunction).toHaveBeenCalled();
        expect(wrapper.vm.clickSubtaskRecord()).toBe("dummy click subtask record")
    });
    it('3-g-3 サブタスク詳細 関数コール', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            subtask_mode: "task",
            subtask_list: ARRAY_SUBTASK
        })
        
        await flushPromises()
        wrapper.findAll('[data-test-id="subtaskList"]').at(0)
               .get('[data-test-id="subtaskCard"]').trigger('click');
        expect(wrapper.vm.subtask_mode).toBe("subtask_detail")
    });

    // タスク詳細
    it('3-h-1 エディタ出現 データ', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            desc_editor: false
        })
        await flushPromises()
        wrapper.get('[data-test-id="taskDescriptionEdit"]').trigger('click');
        expect(wrapper.vm.desc_editor).toBeTruthy()
    });
    it('3-h-2 quillEditorコンポーネント 正常系', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            desc_editor: true
        })
        await flushPromises()
        const editor = wrapper.findComponent(quillEditor)
        expect(editor.exists()).toBe(true);
    });
    it('3-h-2 quillEditorコンポーネント 異常系 ', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            desc_editor: false
        })
        await flushPromises()
        const editor = wrapper.findComponent(quillEditor)
        expect(editor.exists()).toBe(false);
    });
    it('3-h-3 タスク詳細保存 関数コール ', async () => {
        const _mockFunction = jest.fn(() => "dummy desc save");
        const wrapper = mountFunction()
        wrapper.setData({
            desc_editor: true
        })
        wrapper.vm.updateTaskDescription = _mockFunction;
        await flushPromises()
        wrapper.get('[data-test-id="taskDescriptionSave"]').trigger('click');
        expect(wrapper.vm.updateTaskDescription()).toBe("dummy desc save");
        expect(_mockFunction).toHaveBeenCalled()
    });
    it('3-h-3 タスク詳細保存 エディタfalse ', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            desc_editor: true
        })
        await flushPromises()
        wrapper.get('[data-test-id="taskDescriptionSave"]').trigger('click');
        // 保存処理が走るので時間差で
        setTimeout(() => {
            expect(wrapper.vm.desc_editor).toBeFalsy()
        }, 3000)
    });

    it('3-h-4 詳細データセット→DOM反映', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            desc_editor: false,
            detail: {
                task_description: "hogehoge description"
            }
        })
        await flushPromises()
        expect(wrapper.get('[data-test-id="taskDescriptionText"]').text())
            .toContain("hogehoge description");
    });

    // 添付ファイル
    it('3-i-1 ファイルデータデータなし', () => {
        const wrapper = mountFunction()
        expect(wrapper.get('[data-test-id="taskAttachmentNothing"]').text()).toBe("添付ファイルはありません。")
        expect(wrapper.get('[data-test-id="taskAttachmentLength"]').text()).toBe("0 Files")
        expect(wrapper.findComponent('[data-test-id="taskAttachmentAllDelete"]').exists()).toBeFalsy()
    });
    it('3-i-2 「ファイルを添付する」 関数コール', () => {
        const _mockFunction = jest.fn(() => "dummy finder/explorer open")
        const wrapper = mountFunction()
        wrapper.vm.clickUploadButton = _mockFunction;
        wrapper.get('[data-test-id="taskAttachmentButton"]').trigger('click');
        expect(_mockFunction).toHaveBeenCalled()
        expect(wrapper.vm.clickUploadButton()).toBe("dummy finder/explorer open");
    });
    it('3-i-3 ファイルデータセット', () => {
        const wrapper = mountFunction()
        wrapper.setData({
            task_files: FILES,
        })
        // vuetify dialogアニメーションの影響でnextTickがうまく動かないのでsetTimeout
        setTimeout(()=> {
            // レコード数
            expect(wrapper.findAll('[data-test-id="taskAttachmentRecord"]').toHaveLength(1))
            // ファイル名
            expect(wrapper.findAllComponents('[data-test-id="taskAttachmentRecord"]')
            .at(0).get('[data-test-id="taskAttachmentName"]').text()).toBe("git.png");
            // ファイル数
            expect(wrapper.get('[data-test-id="taskAttachmentLength"]').text()).toBe("1 Files")
        }, 500)
    });
    it('3-i-4 単一レコード「ファイル削除」関数コール＋モーダル出現', async () => {
        const _mockFunction = jest.fn(() => "dummy task single file delete")
        const wrapper = mountFunction()
        wrapper.setData({
            task_files: FILES,
        })
        wrapper.vm.clickFileDeleteSingle = _mockFunction
        setTimeout(()=> {
            wrapper.get('[data-test-id="taskAttachmentDelete"]').trigger('click');
            // delete_modal
            expect(wrapper.vm.delete_modal).toBeTruthy()
            // call function
            expect(wrapper.vm.clickFileDeleteSingle()).toBe("dummy task single file delete");
            expect(_mockFunction).toHaveBeenCalled()
        }, 500)
    });
    it('3-i-5 単一レコード 別タブプレビュー hrefチェック', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            task_files: FILES,
        })
        setTimeout(()=> {
            const href = wrapper.get('[data-test-id="taskAttachmentPreviewButton"]').attributes().href;
            expect(href).toBe(...FILES.download_path)
        }, 500)
    });
    it('3-i-6 「全ファイル削除」関数コール＋モーダル出現', async () => {
        const _mockFunction = jest.fn(() => "dummy task all file delete")
        const wrapper = mountFunction()
        wrapper.setData({
            task_files: FILES,
        })
        wrapper.vm.clickAllFileDelete = _mockFunction
        setTimeout(()=> {
            wrapper.get('[data-test-id="taskAttachmentAllDelete"]').trigger('click')
            // delete_modal
            expect(wrapper.vm.delete_modal).toBeTruthy()
            // call function
            expect(_mockFunction).toHaveBeenCalled()
            expect(wrapper.vm.clickAllFileDelete()).toBe("dummy task all file delete")
        }, 500)
    });
})
const TASK_STATUS = [
    { key: 0, text: "指定しない" },
    { key: 1, text: "未着手" },
    { key: 2, text: "処理中" },
    { key: 3, text: "社内確認待ち" },
    { key: 4, text: "先方連絡待ち" },
    { key: 5, text: "完了" }
];
const TASK_PRIORITIES = [
    { key: 0, text: "指定しない" },
    { key: 1, text: "最優先" },
    { key: 4, text: "高" },
    { key: 2, text: "中" },
    { key: 3, text: "低" },
];
const DETAIL = {
    "create_account": "JbJmrYCo27Q9UuDwFjuq27iOcem1",
    "created": 1659397152,
    "finished_at": "",
    "project_id": "",
    "task_deadline": 1659484800,
    "task_description": "<p>hoge task description</p>",
    "task_id": "u05lgoj1nro",
    "task_manager": "",
    "task_message_content": "",
    "task_message_post_account": "",
    "task_name": "hoge task",
    "task_priority": 4,
    "task_status": 2,
    "updated": ""
}
const ARRAY_SUBTASK = [
    {
        "create_account": "JbJmrYCo27Q9UuDwFjuq27iOcem1",
        "created": 1659397424,
        "finished_at": "",
        "subtask_description": "<p>hoge subtask description</p>",
        "subtask_id": "a59md51822",
        "subtask_name": "hoge subtask",
        "task_id": "u05lgoj1nro"
    },
    // {
    //     "create_account": "JbJmrYCo27Q9UuDwFjuq27iOce22",
    //     "created": 1659397424,
    //     "finished_at": "",
    //     "subtask_description": "<p>hoge subtask description2</p>",
    //     "subtask_id": "a59md51823",
    //     "subtask_name": "hoge subtask2",
    //     "task_id": "u05lgoj1nro"
    // }
]
const FILES = [
    {
        "contentType": "image/png",
        "db_id": "240iilhsafg",
        "download_path": "https://firebasestorage.googleapis.com/v0/b/taskapp-f2537.appspot.com/o/JbJmrYCo27Q9UuDwFjuq27iOcem1%2Fgit.png?alt=media&token=902c6701-9bd0-479c-9b8c-4325fcdc6597",
        "name": "git.png",
        "size": 20771,
        "task_id": "u05lgoj1nro"
    }
]
