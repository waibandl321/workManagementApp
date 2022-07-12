import { ValidationProvider, ValidationObserver, localize, extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import ja from 'vee-validate/dist/locale/ja.json';

Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule]);
});

localize('ja', ja);

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  }
};