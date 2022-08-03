// vuetify
import Vue from 'vue'
import Vuetify from 'vuetify'
Vue.use(Vuetify)
// vee-validate
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import { required, email, alpha_num  } from 'vee-validate/dist/rules';
import validatejs from '@/mixin/common/validate.js'
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
extend('required', required)
extend('email', email)
extend('alpha_num', alpha_num)

import { quillEditor } from 'vue-quill-editor'
Vue.component('quillEditor', quillEditor);