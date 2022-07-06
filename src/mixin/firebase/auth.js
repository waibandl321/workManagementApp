import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updateEmail,
    OAuthProvider
}
from "firebase/auth";

export default {
    methods: {
        firebaseGetCurrentUser() {
            const auth = getAuth();            
            return auth;
        },

        // サインアップ
        async firebaseSignup(email, password) {
            const auth = getAuth();
            await createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                this.loading = false
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                this.error = "入力されたメールアドレスの形式が間違っているか、すでに登録されている可能性があります。"
            });
        },

        // サインアウト
        firebaseSignout() {
            const auth = getAuth();
            signOut(auth)
            .then((res) => {
                console.log(res);
            }).catch((error) => {
                console.log(error.message);
            });
        },

        // サインイン
        async firebaseEmailSignin(email, password) {
            const auth = getAuth();
            let _uid = ''
            await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                this.loading = false
                _uid = userCredential.user.uid
            })
            .catch((error) => {
                this.loading = false
                const errorMessage = error.message;
                this.error = '入力されたメールアドレスもしくは、パスワードが間違っています。'
                console.log('error message' + errorMessage);
            });

            return _uid
        },

        // Googleログイン
        async firebaseGoogleAuth() {
            const provider = new GoogleAuthProvider();
            const auth = getAuth();
            provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
            return await signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                console.log(credential.accessToken);
                return result.user.uid
            })
            .catch((error) => {
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(error);
                console.log(credential);
                return false
            });
        },

        async firebaseYahooAuth() {
            const auth = getAuth();
            const provider = new OAuthProvider('yahoo.com');
            return await signInWithPopup(auth, provider)
            .then((result) => {
                const credential = OAuthProvider.credentialFromResult(result);
                console.log("access_token: " + credential.accessToken);
                console.log("id_token" + credential.idToken);
                return result.user.uid
            })
            .catch((error) => {
                console.log(error);
                return false;
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
        }

    }
}


