import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    // signInWithPopup,
    getRedirectResult,
    signInWithRedirect,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateEmail,
    deleteUser
}
from "firebase/auth";

export default {
    methods: {
        // サインアップ
        async firebaseSignup(email, password) {
            const auth = getAuth();
            return await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                return userCredential.user.uid
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                return null;
            });
        },

        // サインアウト
        async firebaseSignout() {
            const auth = getAuth();
            return await signOut(auth)
            .then(() => {
                return true
            }).catch((error) => {
                console.log(error.message);
                return false
            });
        },

        // Emailサインイン
        async firebaseEmailSignin(email, password) {
            const auth = getAuth();
            return await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                return userCredential.user.uid
            })
            .catch((error) => {
                console.log(error.message);
                return null;
            });
        },

        // Googleログイン
        async firebaseGoogleAuth() {
            const provider = new GoogleAuthProvider();
            const auth = getAuth();
            await signInWithRedirect(auth, provider)
        },
        async authGetRedirectResult() {
            const auth = getAuth();
            return await getRedirectResult(auth)
            .then((result) => {
                return result.user;
            })
            .catch(() => {
                console.log("外部認証なし");
                return null;
            });
        },
        execOnAuthStateChanged() {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    return user.uid;
                } else {
                    return null
                }
            });
        },

        // メールアドレス更新
        async firebaseUpdateEmail(new_email) {
            const auth = getAuth();
            return await updateEmail(auth.currentUser, new_email)
            .then(() => {
                return true
            })
            .catch((error) => {
                console.log("メールアドレス更新処理でエラー");
                console.log(error);
                return false;
            });
        },

        // パスワード再設定
        async firebaseSendEmailByPasswordReset(email) {
            const auth = getAuth();
            return await sendPasswordResetEmail(auth, email)
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            });
        },

        // アカウント削除 memo:再認証して削除する
        async firebaseDeleteAuthUser() {
            const auth = getAuth();
            const user = auth.currentUser;

            return await deleteUser(user)
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.log(error)
            });

        }
    }
}


