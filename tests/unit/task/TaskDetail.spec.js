import TaskDetail from '@/components/pages/task/TaskDetail.vue'
import Vuetify from 'vuetify'
import { createLocalVue, mount, config } from '@vue/test-utils'
import flushPromises from 'flush-promises';

config.showDeprecationWarnings = false
jest.useFakeTimers();

describe('TaskDetail.vue', () => {
    const localVue = createLocalVue()
    let vuetify
    // 共通処理
    const mockFunction = jest.fn();
    const mountFunction = options => {
        return mount(TaskDetail, {
            localVue,
            vuetify,
            ...options
        })
    }
    beforeEach(() => {
        vuetify = new Vuetify()
    })
    it('2. provide/inject', () => {
        
    })
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