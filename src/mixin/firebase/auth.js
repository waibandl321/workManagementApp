import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    getRedirectResult,
    signInWithRedirect,
    sendPasswordResetEmail,
    deleteUser,
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
        async firebaseAuthGetRedirectResult() {
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

        // アカウント削除
        async firebaseDeleteAuthUser() {
            const auth = getAuth();

            return await deleteUser(auth.currentUser).then((res) => {
                console.log(res);
                return true
            }).catch((error) => {
                console.log(error)
                return false
            });
        }
    }
}


