// firebase module
import { getAuth, onAuthStateChanged } from "firebase/auth";


export default {
    // ログインチェック
    methods: {
        isSignin() {
          new Promise((resolve, reject) => {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
              if (user) {
                return resolve(user)
              } else {
                reject(window.location = "/auth/signin")
                return;
              }
            })
          })
          .then((user) => {
            if(user) {
              console.log(user)
            }
          })
          .catch((err) => {
            console.log(err);
          })
        },
    }
}