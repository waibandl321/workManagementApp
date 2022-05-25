import storeAuth from '@/mixin/store/auth.js'
import storeAccount from '@/mixin/store/account.js'

export default {
    isSignin() {
        return storeAuth.methods.storeGetFirebaseUid()
    },
    isExistAccount() {
        const result = storeAccount.methods.storeGetAccountInfo()
        if(result.first_name) {
            return result
        } else {
            return false
        }
        
    }
}