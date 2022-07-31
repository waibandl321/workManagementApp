// vuetify
import Vue from 'vue'
import Vuetify from 'vuetify'
Vue.use(Vuetify)

// vee-validate
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import { required, email, alpha_num  } from 'vee-validate/dist/rules';
import validatejs from '@/mixin/common/validate.js'
console.log(validatejs.max_length_password);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
extend('required', required)
extend('email', email)
extend('alpha_num', alpha_num)