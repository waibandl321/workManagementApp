import Header from '@/components/common/Header.vue';
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { createLocalVue, mount, shallowMount, RouterLinkStub } from '@vue/test-utils'
describe('Header.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('1. 初回レンダリング', () => {
    const wrapper = mount(Header, {
      localVue,
      vuetify,
      stubs: { RouterLink: RouterLinkStub },
      propsData: {
        params: {
          user_info: {}
        }
      }
    });
    const dashboard_button = wrapper.get('[data-test-id="ダッシュボード"]');
    const task_button = wrapper.get('[data-test-id="タスク一覧"]');
    const file_button = wrapper.get('[data-test-id="ファイル管理"]');
    const signout_button = wrapper.get('[data-test-id="appSignout"]');
    const account_button = wrapper.get('[data-test-id="headerAccountName"]');

    expect(dashboard_button.text()).toBe("ダッシュボード")
    expect(task_button.text()).toBe("タスク一覧")
    expect(file_button.text()).toBe("ファイル管理")
    expect(signout_button.text()).toBe("ログアウト")
    expect(account_button.text()).toContain("アカウント:")
    expect(account_button.text()).not.toContain("HOGE CHAN")
  });

  it('アカウント名反映', () => {
    const wrapper = mount(Header, {
      localVue,
      vuetify,
      stubs: { RouterLink: RouterLinkStub },
      propsData: {
        params: {
          user_info: {
            first_name: "chan",
            last_name: "hoge",
          }
        }
      }
    });
    const account_button = wrapper.get('[data-test-id="headerAccountName"]');
    expect(account_button.text()).toBe("アカウント: hoge chan")
  });
  it('アカウントボタン背景色', () => {
    const wrapper = mount(Header, {
      localVue,
      vuetify,
      stubs: { RouterLink: RouterLinkStub },
      propsData: {
        params: {
          user_info: {
            first_name: "chan",
            last_name: "hoge",
            color: "32BC1F",
          }
        }
      }
    });
    const account_button = wrapper.get('[data-test-id="headerAccountName"]');
    expect(account_button.attributes().style).toContain("background-color: rgb(50, 188, 31);");
  });

  it('機能ボタン リンク先', () => {
    localVue.use(VueRouter)
    const wrapper = shallowMount(Header, {
      localVue,
      vuetify,
      stubs: { RouterLink: RouterLinkStub },
      propsData: {
        params: {
          user_info: {}
        }
      }
    });
    const dashboard_button = wrapper.get('[data-test-id="ダッシュボード"]');
    const task_button = wrapper.get('[data-test-id="タスク一覧"]');
    const file_button = wrapper.get('[data-test-id="ファイル管理"]');

    expect(dashboard_button.attributes().to).toBe("/");
    expect(task_button.attributes().to).toBe("/task");
    expect(file_button.attributes().to).toBe("/file");
  });

  // MEMO: 5.6は、ルーティングが絡むのでe2eテストで検証する
  // リンクの存在は「1. 初回レンダリング」で検証済み
});

/** 
 * テストケース
 * 1. 初回レンダリング
 * ├── ユーザーデータはセットしない
 * ├── 機能リンク（ダッシュボード、タスク一覧、ファイル管理）が描画されている
 * ├── ログアウトボタンが表示されている
 * ├── アカウントボタンが表示されている
 * ├── アカウントボタンに名前（HOGE）はセットされていない
 * 2. アカウント名
 * ├── first_nameに「chan」をセット
 * ├── last_nameに「hoge」をセット
 * ├── アカウント名に「HOGE CHAN」がセットされている
 * 3. アカウントボタン背景色
 * ├── colorに#32BC1Fをセット
 * ├── アカウントボタンの背景色がカラーコードrgb(50, 188, 31) = #32BC1Fと一致する
 * 4. 機能ボタン イベント
 * ├── ダッシュボードボタンのhref属性が'/'である
 * ├── タスク一覧ボタンのhref属性が'/task'である
 * ├── ファイル管理ボタンのhref属性が'/file'である
 * 5. アカウントボタン イベント
 * ├── アカウントボタンクリックでメソッド(accountEdit)がcallされる
 * 6. ログアウトボタン イベント
 * ├── ログアウトボタンクリックでメソッド(clickSignout)がcallされる
*/

