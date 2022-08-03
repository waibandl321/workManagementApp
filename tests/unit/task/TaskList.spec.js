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
    const mockFunction = jest.fn();
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
    it('2. provide/inject 値チェック', () => {
        const wrapper = mountFunction()
        const status_result = wrapper.vm.task_status_list.find(v => v.text === "指定しない")
        const priority_result = wrapper.vm.task_priority_list.find(v => v.text === "指定しない")
        expect(status_result.text).toBe("指定しない")
        expect(priority_result.text).toBe("指定しない")
    })

    // アラート
    it('データとDOMの関連性 サクセスメッセージ', async () => {
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
    it('データとDOMの関連性  エラーメッセージ', async () => {
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
    it('データとDOMの関連性 フィルタ', async () => {
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

    // タスク追加
    it('データとDOMの関連性 タスク追加 input出現', () => {
        const wrapper = mountFunction();
        wrapper.setData({ create_task_mode: false })
        wrapper.get('[data-test-id="taskAddButton"]').trigger('click');
        expect(wrapper.vm.create_task_mode).toBeTruthy()
    })
    it('データとDOMの関連性 タスク追加 関数呼び出し', () => {
        const wrapper = mountFunction({
            data() {
                return {
                    create_task_mode: false
                }
            },
            methods: {
                clickTaskInput: mockFunction
            }
        });
        wrapper.get('[data-test-id="taskAddButton"]').trigger('click');
        expect(mockFunction).toHaveBeenCalled()
    })
    it('データとDOMの関連性 タスク追加 input入力', async () => {
        const wrapper = mountFunction();
        await wrapper.setData({ create_task_mode: true });
        await wrapper.get('[data-test-id="taskAddInput"]').setValue("hoge task");
        expect(wrapper.vm.create_task_name).toBe("hoge task")
    })
    it('データとDOMの関連性 タスク追加 input閉じる', () => {
        const wrapper = mountFunction();
        wrapper.setData({ create_task_mode: true });
        wrapper.get('[data-test-id="taskAddButton"]').trigger('click');
        expect(wrapper.vm.create_task_mode).toBeFalsy()
    })
    it('データとDOMの関連性 タスク追加 関数呼び出し', async () => {
        const wrapper = mountFunction({
            data() {
                return {
                    create_task_mode: true,
                    create_task_name: "hoge task",
                }
            },
            methods: {
                execCreateTask: mockFunction
            }
        });
        await wrapper.get('[data-test-id="taskAddSubmit"]').trigger('click');
        expect(mockFunction).toHaveBeenCalled()
    })

    it('データとDOMの関連性 タスク追加 バリデーション ', async () => {
        const wrapper = mountFunction({
            data() {
                return {
                    create_task_mode: true
                }
            }
        });
        await wrapper.get('[data-test-id="taskAddInput"]').setValue("");
        await flushPromises();
        console.log(wrapper.get('.input-error-message').text());
        expect(wrapper.get('.input-error-message').text()).toBe("タスク名は必須です");
        expect(wrapper.vm.$refs.task_name_input.errors[0]).toBe("タスク名は必須です");
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

/** 
 * MEMO: Vuetifyのコンポーネントの動作確認は行わない
 * Vuetifyが単体テストを行なっているので
 * あくまでdataとDOMの関連性にフォーカス
*/