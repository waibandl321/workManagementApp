/**
* ファイル管理機能で使用するFirebase, Storage関連の処理を記述する
* 
*/
import { getDatabase, ref, set, onValue, update } from "firebase/database";

export default {
    methods: {
        async firebaseCreateShareFiles(formdata) {
            // データベースに保存
            const db = getDatabase();
            await set(ref(db, '/share_files/' + formdata.uid + '/' + formdata.id), formdata)
        },
        
        firebaseReadShareFiles() {
            return new Promise((resolve) => {
                const db = getDatabase();
                const starCountRef = ref(db, '/share_files/' + this.storeGetFirebaseUid());
                onValue(starCountRef, (snapshot) => {
                    return resolve(snapshot.val())
                });
            })
            .catch((error) => {
                console.log(error);
            })
        },
        async firebaseDeleteShareFiles(delete_item) {
            const db = getDatabase();
            const updates = {};
            updates[
                '/share_files/'
                + this.storeGetFirebaseUid()
                + '/' + delete_item.id
            ] = {}
            return await update(ref(db), updates)
            .then(() => {
                return true
            })
            .catch((error) => {
                console.log(error);
            });
        },
    }
}