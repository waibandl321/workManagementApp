import storeAuth from '@/mixin/store/auth.js'
// import storeAccount from '@/mixin/store/account.js'

export default {
    isSignin() {
        return storeAuth.methods.storeGetFirebaseUid()
    },
}