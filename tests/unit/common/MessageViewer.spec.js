import MessageViewer from '@/components/common/MessageViewer.vue';
import Vuetify from 'vuetify'
import { createLocalVue, mount } from '@vue/test-utils'
describe('MessageViewer.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('1. 初回レンダリング 値なし', () => {
    const wrapper = mount(MessageViewer, {
      localVue,
      vuetify,
      propsData: {
        params: {
          success: "",
          error: "",
        }
      }
    })
    expect(wrapper.text()).not.toBe("success!");
    expect(wrapper.text()).not.toBe("error!");
  });
  it('2-1. successに値がセットされた場合', () => {
    const wrapper = mount(MessageViewer, {
      localVue,
      vuetify,
      propsData: {
        params: {
          success: "success!",
          error: "",
        }
      }
    })
    expect(wrapper.text()).toBe("success!");
    expect(wrapper.text()).not.toBe("error!");
  });
  it('2-2. errorに値がセットされた場合', () => {
    const wrapper = mount(MessageViewer, {
      localVue,
      vuetify,
      propsData: {
        params: {
          success: "",
          error: "error!",
        }
      }
    })
    expect(wrapper.text()).not.toBe("success!");
    expect(wrapper.text()).toBe("error!");
  });

  it('2-2. success, errorに値がセットされた場合', () => {
    const wrapper = mount(MessageViewer, {
      localVue,
      vuetify,
      propsData: {
        params: {
          success: "成功やで!",
          error: "失敗やで!",
        }
      }
    })
    expect(wrapper.text()).toContain("成功やで!");
    expect(wrapper.text()).toContain("失敗やで!");
  });

  // it.only('「×」がクリックされた場合', () => {
  //   const wrapper = mount(MessageViewer, {
  //     localVue,
  //     vuetify,
  //     propsData: {
  //       params: {
  //         success: "success!",
  //         error: "",
  //       }
  //     }
  //   })
  //   const button = wrapper.get(".v-alert__dismissible");
  //   expect(button.exists()).toBe(true)
  //   button.trigger("click")
  //   console.log(wrapper.html());
  //   expect(wrapper.text()).not.toBe("success!");
  // });
});

/** 
 * テストケース
 * 1. 初回レンダリング
 * ├── params.successが空: success要素が描画されない
 * ├── params.errorが空の場合: error要素が描画されない
 * 2. propsのデータがセットされた場合
 * ├── params.successに"success!"がセット: success!が表示される
 * ├── params.errorに"error!"がセット: error!が表示される
 * 
 * MEMO: ↓↓↓↓DOM未定義の要素のため、イベント処理うまくいかないので一旦未実施
 * 3. 「×」がクリックされた場合
 * ├── success要素の「×」をクリック: params.successが空になる + success要素が描画されない
 * ├── error要素の「×」をクリック: params.errorが空になる + error要素が描画されない
*/