import TaskList from '@/components/pages/task/TaskList.vue'
import Vuetify from 'vuetify'
import { createLocalVue, mount, config } from '@vue/test-utils'
import flushPromises from 'flush-promises';

config.showDeprecationWarnings = false
jest.useFakeTimers();

describe('TaskList.vue', () => {
    const localVue = createLocalVue()
    let vuetify
    // 共通処理
    const mountFunction = options => {
        return mount(TaskList, {
            localVue,
            vuetify,
            provide: {
                task_status_list: TASK_STATUS,
                task_priority_list: TASK_PRIORITIES,
            },
            ...options
        })
    }
    beforeEach(() => {
        vuetify = new Vuetify()
    })
    it('1. provide/inject 値チェック', () => {
        const wrapper = mountFunction()
        const status_result = wrapper.vm.task_status_list.find(v => v.text === "指定しない")
        const priority_result = wrapper.vm.task_priority_list.find(v => v.text === "指定しない")
        expect(status_result.text).toBe("指定しない")
        expect(priority_result.text).toBe("指定しない")
    })

    // アラート
    it('2-a-1 サクセスメッセージ', async () => {
        const wrapper = mountFunction({
            data() {
                return {
                    messages: {
                        success: "成功hogehoge",
                    }
                };
            }
        })
        expect(wrapper.get('.v-alert.success').text()).toBe("成功hogehoge")
    });
    it('2-a-2  エラーメッセージ', async () => {
        const wrapper = mountFunction({
            data() {
                return {
                    messages: {
                        error: "error hogehoge",
                    }
                };
            }
        })
        expect(wrapper.get('.v-alert.error').text()).toBe("error hogehoge")
    });

     // フィルタ
    it('2-b-1 フィルタ', async () => {
        const wrapper = mountFunction({
            data() {
                return {
                    filter_text: "hogehoge",
                    filter_status: 0,
                    filter_priority: 1,
                };
            }
        })
        // await flushPromises()
        expect(wrapper.get('[data-test-id="filterText"]').element.value).toBe("hogehoge")
        expect(wrapper.get('[data-test-id="filterStatus"] .v-select__selections').text()).toBe("指定しない")
        expect(wrapper.get('[data-test-id="filterPriority"] .v-select__selections').text()).toBe("最優先")
    })

    it('2-b-2 テキスト検索 関数呼び出し', () => {
        const _mockFunction = jest.fn(() => "dummy input")
        const wrapper = mountFunction()
        wrapper.vm.filterList = _mockFunction
        wrapper.get('[data-test-id="filterText"]').setValue("hoge");
        expect(wrapper.vm.filterList()).toBe("dummy input");
        expect(_mockFunction).toHaveBeenCalled()
    });

    // タスク追加
    it('2-c-1 タスク追加 (1)input出現', () => {
        const wrapper = mountFunction();
        wrapper.setData({ create_task_mode: false })
        wrapper.get('[data-test-id="taskAddButton"]').trigger('click');
        expect(wrapper.vm.create_task_mode).toBeTruthy()
    })
    it('2-c-1 タスク追加 (2)関数呼び出し', () => {
        const _mockFunction = jest.fn(() => "dummy open")
        const wrapper = mountFunction({
            data() {
                return {
                    create_task_mode: false
                }
            },
        });
        wrapper.vm.clickTaskInput = _mockFunction
        wrapper.get('[data-test-id="taskAddButton"]').trigger('click');
        expect(wrapper.vm.clickTaskInput()).toBe("dummy open")
        expect(_mockFunction).toHaveBeenCalled()
    })
    it('2-c-2 タスク追加 input入力', async () => {
        const wrapper = mountFunction();
        wrapper.setData({ create_task_mode: true });
        await flushPromises()
        wrapper.get('[data-test-id="taskAddInput"]').setValue("hoge task");
        expect(wrapper.vm.create_task_name).toBe("hoge task")
    })
    it('2-c-3 タスク追加 input閉じる', () => {
        const wrapper = mountFunction();
        wrapper.setData({ create_task_mode: true });
        wrapper.get('[data-test-id="taskAddButton"]').trigger('click');
        expect(wrapper.vm.create_task_mode).toBeFalsy()
    })
    it('2-c-4 タスク追加 関数呼び出し', () => {
        const _mockFunction = jest.fn(() => "add dummy")
        const wrapper = mountFunction({
            data() {
                return {
                    create_task_mode: true,
                    create_task_name: "hoge task",
                }
            },
        });
        wrapper.vm.execCreateTask = _mockFunction
        wrapper.get('[data-test-id="taskAddSubmit"]').trigger('click');
        expect(wrapper.vm.execCreateTask()).toBe("add dummy")
        expect(_mockFunction).toHaveBeenCalled()
    })

    it('2-c-5 タスク追加 バリデーション ', async () => {
        const wrapper = mountFunction({
            data() {
                return {
                    create_task_mode: true
                }
            }
        });
        wrapper.get('[data-test-id="taskAddInput"]').setValue("");
        await flushPromises();
        expect(wrapper.get('.input-error-message').text()).toBe("タスク名は必須です");
        expect(wrapper.vm.$refs.task_name_input.errors[0]).toBe("タスク名は必須です");
    });

    it('2-d-1 一覧描画', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            filter_items: TASK_DATA
        })
        setTimeout(() => {
            expect(wrapper.findAllComponents('[data-test-id="taskListRecord"]')).toHaveLength(1)
            const record = wrapper.findAllComponents('[data-test-id="taskListRecord"]').at(0)
            expect(record.get('[data-test-id="tdTaskName"]').text()).toBe("hoge task");
            expect(record.get('[data-test-id="tdStatus"]').text()).toBe("未着手");
            expect(record.get('[data-test-id="tdPriority"]').text()).toBe("低");
            expect(record.get('[data-test-id="tdDeadline"]').text()).toBe("2022-08-03");
            expect(record.get('[data-test-id="tdTerm"]').text()).toBe("2日間");
            expect(record.get('[data-test-id="tdCreated"]').text()).toBe("2022-08-02");
        })
    });
    it('2-d-2 タスク削除 関数コール＋モーダル', () => {
        const _mockFunction = jest.fn(() => "dummy task delete")
        const wrapper = mountFunction()
        wrapper.setData({
            filter_items: TASK_DATA
        })
        wrapper.vm.clickDelete = _mockFunction;
        setTimeout(() => {
            const record = wrapper.findAllComponents('[data-test-id="taskListRecord"]').at(0)
            record.get('[data-test-id="taskListDeleteButton"]').trigger('click');
            expect(_mockFunction).toHaveBeenCalled()
            wrapper(wrapper.vm.clickDelete()).toBe("dummy task delete")
            expect(wrapper.vm.delete_modal).toBeTruthy();
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
const TASK_DATA = [
    {
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
]
/** 
 * MEMO: Vuetifyのコンポーネントの動作確認は行わない
 * Vuetifyが単体テストを行なっているので
 * あくまでdataとDOMの関連性にフォーカス
*/