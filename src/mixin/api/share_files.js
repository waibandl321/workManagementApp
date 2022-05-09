/**
* ファイル管理機能で使用するFirebase, Storage関連の処理を記述する
* 
*/
import { getDatabase, ref, set, onValue } from "firebase/database";


export default {
    methods: {
        firebaseCreateShareFiles(formdata) {
            // データtypeがファイルの場合は、ストレージにインデックス

            // データベースに保存
            try {
                const db = getDatabase();
                set(ref(db, '/share_files/' + this.storeGetFirebaseUid() + '/' + formdata.id), formdata);
            } catch (error) {
                console.log(error);
            }
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
        }
    }
}