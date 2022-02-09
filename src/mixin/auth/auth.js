import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword
}
from "firebase/auth";
import {
    getDatabase,
    ref,
    set,
    update,
    onValue
}
from "firebase/database";

export default {
    methods: {
        getAuthUserId() {
            const auth = getAuth();
            return auth.currentUser.uid;
        },

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

        authSignIn(email, password) {
            const auth = getAuth();
            signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                if(result) {
                    this.loading = false
                    this.$router.push('/', () => {})
                }
            })
            .catch((error) => {
                this.loading = false
                const errorMessage = error.message;
                console.log('error message' + errorMessage);
                this.error = '入力されたメールアドレスもしくは、パスワードが間違っています。'
            });
        },

        
        authUserCheck() {
            const auth = getAuth()
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.authAccountGet()
                } else {
                    this.$router.push('/auth/signin', () => {})
                }
            });
        },

        authAccountGet() {
            const db = getDatabase();
            const userId = this.getAuthUserId()
            onValue(ref(db, '/users/' + userId), (snapshot) => {
                const data = snapshot.val()
                this.accountData = data
            });
        },

        authAccountRegister(firstName, lastName, company, status, color) {
            const userId = this.getAuthUserId()
            const db = getDatabase();
            set(ref(db, '/users/' + userId), {
                first_name: firstName,
                last_name: lastName,
                company : company,
                status: status,
                color: color
            });
        },

        authAccountUpdate(accountData) {
            const db = getDatabase();
            const userId = this.getAuthUserId()
            const account = {
                first_name: accountData.first_name,
                last_name: accountData.last_name,
                company : accountData.company,
                status: accountData.status,
                color: accountData.color
            }

            const updates = {};
            updates['/users/' + userId] = account;
            
            update(ref(db), updates);
        },
    }
}
