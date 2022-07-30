import ConfirmDelete from '@/components/common/ConfirmDelete.vue';
import Vuetify from 'vuetify'
import { createLocalVue, mount } from '@vue/test-utils'
describe('ConfirmDelete.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('1. 初回レンダリング', () => {
    const wrapper = mount(ConfirmDelete, {
      localVue,
      vuetify,
    });
    const text = wrapper.find('[data-test-id="delete-modal-text"]');
    expect(text.text()).toBe("削除後は復元できません。本当によろしいですか？");
  });
  it('2. タイトル確認', () => {
    const wrapper = mount(ConfirmDelete, {
      localVue,
      vuetify,
      propsData: {
        delete_title: "hogehogeを削除します"
      }
    });
    const title = wrapper.find('[data-test-id="delete-modal-title"]');
    expect(title.text()).toBe("hogehogeを削除します");
  });
  it('3. ボタン表示確認', () => {
    const mockFunction = jest.fn();
    const wrapper = mount(ConfirmDelete, {
      localVue,
      vuetify,
      propsData: {
        delete_options: [
          { function_cd: "cancel", text: "キャンセル", callback: mockFunction },
          { function_cd: "delete", text: "削除する",   callback: mockFunction }
        ]
      }
    });
    const cencelBtn = wrapper.find('[data-test-id="modalcancel"]');
    const deleteBtn = wrapper.find('[data-test-id="modaldelete"]');
    expect(cencelBtn.text()).toBe("キャンセル");
    expect(deleteBtn.text()).toBe("削除する");
  });

  it('ボタンクリック時のメソッドのcall確認 キャンセル', () => {
    const mockFunction = jest.fn();
    const wrapper = mount(ConfirmDelete, {
      localVue,
      vuetify,
      propsData: {
        delete_options: [
          { function_cd: "cancel", text: "キャンセル", callback: mockFunction },
          { function_cd: "delete", text: "削除する",   callback: mockFunction }
        ]
      }
    });
    const cencelBtn = wrapper.find('[data-test-id="modalcancel"]');
    cencelBtn.trigger("click");
    expect(mockFunction).toHaveBeenCalled();
  });
  it('ボタンクリック時のメソッドのcall確認 削除', () => {
    const mockFunction = jest.fn();
    const wrapper = mount(ConfirmDelete, {
      localVue,
      vuetify,
      propsData: {
        delete_options: [
          { function_cd: "cancel", text: "キャンセル", callback: mockFunction },
          { function_cd: "delete", text: "削除する",   callback: mockFunction }
        ]
      }
    });
    const deleteBtn = wrapper.find('[data-test-id="modaldelete"]');
    deleteBtn.trigger("click");
    expect(mockFunction).toHaveBeenCalled();
  });
});

/** 
 * テストケース
 * 1. 初回レンダリング
 * ├── 削除後は復元できません。本当によろしいですか？のメッセージが表示されている
 * 2. タイトル確認
 * ├── propsのdelete_titleに「hogehogeを削除します」をセット
 * ├── 「hogehogeを削除します」が表示されるか確認
 * 3. ボタン表示確認
 * ├── propsのデータに削除オプションを渡す
 * ├── キャンセルボタン表示確認
 * ├── 削除ボタン表示確認
 * 4. ボタンクリック時のメソッドのcall確認
 * ├── キャンセルボタンクリック: メソッド実行確認
 * ├── 削除ボタンクリック: メソッド実行確認
 * 
 *  MEMO: 当コンポーネントテストでは内部ロジックに焦点を当てず、
 * 実際に削除されたかどうかはテストしない。
 * あくまで
 * ・データがセットされる→コンポーネントが描画される
 * ・イベント（クリック）が発火する→関数がcallされるか
 * を検証する。実際の削除処理、キャンセル処理はモック関数で代替
 * 
*/