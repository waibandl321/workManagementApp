import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup
}
from "firebase/auth";

const provider = new GoogleAuthProvider();

export default {
    methods: {
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

        async firebaseGoogleAuth() {
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
        async firebaseGithubAuth() {
            const auth = getAuth();
            provider.addScope('repo');
            return await signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GithubAuthProvider.credentialFromResult(result);
                console.log(credential.accessToken);
                return result.user.uid
            })
            .catch((error) => {
                const credential = GithubAuthProvider.credentialFromError(error);
                console.log(error);
                console.log(credential);
                return false
            });
        }, 
    }
}


