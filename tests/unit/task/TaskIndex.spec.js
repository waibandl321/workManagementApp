import TaskIndexTest from '@/components/pages/task/TaskIndexTest.vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount, mount, RouterLinkStub, config } from '@vue/test-utils'
import flushPromises from 'flush-promises';

config.showDeprecationWarnings = false
jest.useFakeTimers();

describe('TaskIndexTest.vue', () => {
    const localVue = createLocalVue()
    let vuetify

    const mountFunction = options => {
        return shallowMount(TaskIndexTest, {
            localVue,
            vuetify,
            stubs: {
                RouterLink: RouterLinkStub
            },
            ...options
        })
    }
    const domMountFunction = options => {
        return mount(TaskIndexTest, {
            localVue,
            vuetify,
            stubs: {
                RouterLink: RouterLinkStub
            },
            ...options
        })
    }

    beforeEach(() => {
        vuetify = new Vuetify()
    })

    it('1. メッセージ  error', async () => {
        const wrapper = domMountFunction()
        wrapper.setData({
            messages: {
                error: "hoge error"
            },
        })
        await flushPromises()
        expect(wrapper.get('.v-alert').text()).toBe("hoge error");
    });
    it('1. メッセージ success', async () => {
        const wrapper = domMountFunction()
        wrapper.setData({
            messages: {
                success: "hoge success"
            },
        })
        await flushPromises()
        expect(wrapper.get('.v-alert').text()).toBe("hoge success");
    });
    it('2-1. 初期表示', () => {
        const wrapper = mountFunction()
        expect(wrapper.findComponent("tasklist-stub").exists()).toBe(true)
        expect(wrapper.findComponent("taskdetail-stub").exists()).toBe(false)
    })

    it('2-2. 詳細コンポーネント表示', async () => {
        const wrapper = mountFunction()
        wrapper.setData({
            detail_mode: true,
        })
        await flushPromises()
        expect(wrapper.findComponent("tasklist-stub").exists()).toBe(true)
        expect(wrapper.findComponent("taskdetail-stub").exists()).toBe(true)
    })
})