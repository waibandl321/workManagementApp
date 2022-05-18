import storeAuth from '@/mixin/store/auth.js'

export default {
    isSignin() {
        return storeAuth.methods.storeGetFirebaseUid()
    }
}