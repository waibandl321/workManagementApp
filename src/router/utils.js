import storeAuth from '@/mixin/store/auth.js'
import storeAccount from '@/mixin/store/account.js'

export default {
    isSignin() {
        return storeAuth.methods.storeGetFirebaseUid()
    },
    routerAccountExists() {
        const account = storeAccount.methods.storeGetAccountInfo()
        return account.last_name;
    }
}