import { getDatabase, ref, set, update, onValue } from "firebase/database";

export default {
  methods: {
    // プロジェクト一覧取得
    async firebaseGetProjectList() {
      return new Promise((resolve, reject) => {
        const db = getDatabase();
        const starCountRef = ref(db, "/projects/" + this.storeGetFirebaseUid());
        onValue(
          starCountRef,
          (snapshot) => {
            resolve(snapshot.val());
          },
          (err) => {
            reject(err);
          }
        );
      });
    },
    async firebaseGetProjectDetail(project_id) {
      return new Promise((resolve, reject) => {
        const db = getDatabase();
        const starCountRef = ref(
          db,
          "/projects/" + this.storeGetFirebaseUid() + "/" + project_id
        );
        onValue(
          starCountRef,
          (snapshot) => {
            resolve(snapshot.val());
          },
          (err) => {
            reject(err);
          }
        );
      });
    },

    // プロジェクト作成
    async firebaseProjectCreate(project) {
      const db = getDatabase();
      return await set(
        ref(
          db,
          "/projects/" + this.storeGetFirebaseUid() + "/" + project.project_id
        ),
        project
      )
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },

    // プロジェクトステータス更新
    async firebaseUpdateProjectStatus(project) {
      const db = getDatabase();
      const userId = this.storeGetFirebaseUid();
      const updates = {};

      if (project.project_status == 3) {
        updates[
          "/projects/" + userId + "/" + project.project_id + "/project_status"
        ] = project.project_status;
        updates[
          "/projects/" + userId + "/" + project.project_id + "/finished_at"
        ] = this.nowUnix();
      } else {
        updates[
          "/projects/" + userId + "/" + project.project_id + "/project_status"
        ] = project.project_status;
      }
      return await update(ref(db), updates)
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
    // プロジェクト名更新
    async firebaseUpdateProjectname(id, name) {
      const db = getDatabase();
      const userId = this.storeGetFirebaseUid();
      const updates = {};
      updates["/projects/" + userId + "/" + id + "/project_name"] = name;
      return await update(ref(db), updates)
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
    // プロジェクト詳細更新
    async firebaseUpdateProjectDescription(id, description) {
      const db = getDatabase();
      const userId = this.storeGetFirebaseUid();
      const updates = {};
      updates["/projects/" + userId + "/" + id + "/project_description"] =
        description;
      return await update(ref(db), updates)
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
    async firebaseUpdateProjectRepository(id, repository) {
      const db = getDatabase();
      const userId = this.storeGetFirebaseUid();
      const updates = {};
      updates["/projects/" + userId + "/" + id + "/project_repository"] =
        repository;
      return await update(ref(db), updates)
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
    async firebaseUpdateProjectDoc(id, doc) {
      const db = getDatabase();
      const userId = this.storeGetFirebaseUid();
      const updates = {};
      updates["/projects/" + userId + "/" + id + "/project_doc"] = doc;
      return await update(ref(db), updates)
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
    // プロジェクト期日更新
    async firebaseUpdateProjectDeadline(project_deadline, project_id) {
      const db = getDatabase();
      const userId = this.storeGetFirebaseUid();
      const updates = {};
      updates["/projects/" + userId + "/" + project_id + "/project_deadline"] =
        project_deadline;
      return await update(ref(db), updates)
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },

    // 削除
    async firebaseDeleteProject(project) {
      const db = getDatabase();
      const updates = {};
      updates[
        "/projects/" + this.storeGetFirebaseUid() + "/" + project.project_id
      ] = null;
      return await update(ref(db), updates);
    },
    // アカウント削除に連動したプロジェクト削除
    async firebaseDeleteAccountProjects() {
      const db = getDatabase();
      const updates = {};
      updates["/projects/" + this.storeGetFirebaseUid()] = null;
      return await update(ref(db), updates);
    },
    getSortStatusOptions() {
      return SORT_STATUS_OPTION;
    },
    getSortDateOptions() {
      return SORT_DATE_OPTIONS;
    },
    getProjectStatusList() {
      return PROJECT_STATUS_LIST;
    },
    getEditorOptions() {
      return Editoe_Toolbar_Options;
    },
  },
};

const PROJECT_STATUS_LIST = [
  { key: 0, text: "指定しない" },
  { key: 1, text: "未着手" },
  { key: 2, text: "進行中" },
  { key: 3, text: "完了" },
];
const SORT_STATUS_OPTION = [
  { text: "全てのプロジェクト", value: 1 },
  { text: "有効なプロジェクト", value: 2 },
  { text: "未着手のプロジェクト", value: 3 },
  { text: "処理中のプロジェクト", value: 4 },
  { text: "社内確認待ちプロジェクト", value: 5 },
  { text: "期限切れプロジェクト", value: 6 },
  { text: "完了したプロジェクト", value: 7 },
];
const SORT_DATE_OPTIONS = [
  { text: "期日が近い順", value: 1 },
  { text: "作成日順", value: 2 },
];
const Editoe_Toolbar_Options = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  // [{ 'header': 1 }, { 'header': 2 }],            // custom button values
  // [{ 'direction': 'rtl' }],                      // text direction
  // [{ 'script': 'sub'}, { 'script': 'super' }],   // superscript/subscript
  // [{ 'font': [] }],                              // font family
  // [{ 'align': [] }],                             // text-align
  // ['clean']                                      // remove formatting button
];
