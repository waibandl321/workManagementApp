import TaskIndex from '@/components/pages/task/TaskIndex.vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount, RouterLinkStub, config } from '@vue/test-utils'
import flushPromises from 'flush-promises';

config.showDeprecationWarnings = false
jest.useFakeTimers();

describe('Signin.vue', () => {
    const localVue = createLocalVue()
    let vuetify

    const mockFunction = jest.fn();
    const mountFunction = options => {
        return shallowMount(TaskIndex, {
            localVue,
            vuetify,
            stubs: {
                RouterLink: RouterLinkStub
            },
            methods: {
                setRoutetitle: mockFunction
            },
            ...options
        })
    }

    beforeEach(() => {
        vuetify = new Vuetify()
    })
    it('1. 初期表示', () => {
        const wrapper = mountFunction()
        console.log(wrapper.html());
    })
})
/** 
 * テストケース
 * 1. 初期表示
 * ├── 「パスワード再設定」のタイトルが存在する
*/