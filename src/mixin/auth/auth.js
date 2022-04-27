import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword
}
from "firebase/auth";


export default {
    methods: {
        // ログインユーザーID取得
        getAuthUserId() {
            const auth = getAuth();
            return auth.currentUser.uid;
        },

        // サインアップ
        authSignUp(email, password) {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                this.loading = false
                this.$router.push('/auth/account', () => {})
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                this.error = "入力されたメールアドレスの形式が間違っているか、すでに登録されている可能性があります。"
            });
        },

        // サインアウト
        authSignOut() {
            const auth = getAuth();
            signOut(auth).then(() => {
                this.loading = false
                this.$router.push('/auth/signin', () => {})
            }).catch((error) => {
                this.loading = false
                console.log(error.message);
            });
        },

        // サインイン
        authSignIn(email, password) {
            const auth = getAuth();
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                this.loading = false
                this.auth = true
                this.$router.push('/', () => {})
            })
            .catch((error) => {
                this.loading = false
                const errorMessage = error.message;
                console.log('error message' + errorMessage);
                this.error = '入力されたメールアドレスもしくは、パスワードが間違っています。'
            });
        },

        
    }
}
