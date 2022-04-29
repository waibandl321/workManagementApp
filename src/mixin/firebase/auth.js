import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword
}
from "firebase/auth";


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
            signOut(auth).then(() => {
                this.loading = false
            }).catch((error) => {
                this.loading = false
                console.log(error.message);
            });
        },

        // サインイン
        async firebaseSignin(email, password) {
            let _uid = ''
            const auth = getAuth();
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
    }
}
