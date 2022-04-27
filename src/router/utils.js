// firebase module
import { getAuth, onAuthStateChanged } from "firebase/auth";


export default {
    // ログインチェック
    methods: {
        isSignin(to, from , next) {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                  return
                } else {
                  next({
                      path: '/auth/signin'
                  })
                }
              });
        },
    }
}