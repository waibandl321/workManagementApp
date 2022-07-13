import { ValidationProvider, ValidationObserver, localize, extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';

Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule]);
});

localize('ja', {
    "code": "ja",
    "messages": {
        "alpha": "{_field_}はアルファベットのみ使用できます",
        "alpha_num": "{_field_}は英数字のみ使用できます",
        "alpha_dash": "{_field_}は英数字とハイフン、アンダースコアのみ使用できます",
        "alpha_spaces": "{_field_}はアルファベットと空白のみ使用できます",
        "between": "{_field_}は{min}から{max}の間でなければなりません",
        "confirmed": "{_field_}が一致しません",
        "digits": "{_field_}は{length}桁の数字でなければなりません",
        "dimensions": "{_field_}は幅{width}px、高さ{height}px以内でなければなりません",
        "email": "有効な{_field_}ではありません",
        "excluded": "{_field_}は不正な値です",
        "ext": "{_field_}は有効なファイル形式ではありません",
        "image": "{_field_}は有効な画像形式ではありません",
        "integer": "{_field_}は整数のみ使用できます",
        "is": "{_field_}が一致しません",
        "is_not": "{_field_}は無効です ",
        "length": "{_field_}は{length}文字でなければなりません",
        "max_value": "{_field_}は{max}以下でなければなりません",
        "max": "{_field_}は{length}文字以内にしてください",
        "mimes": "{_field_}は有効なファイル形式ではありません",
        "min_value": "{_field_}は{min}以上でなければなりません",
        "min": "{_field_}は{length}文字以上でなければなりません",
        "numeric": "{_field_}は数字のみ使用できます",
        "oneOf": "{_field_}は有効な値ではありません",
        "regex": "{_field_}のフォーマットが正しくありません",
        "required": "{_field_}は必須です",
        "required_if": "{_field_}は必須です",
        "size": "{_field_}は{size}KB以内でなければなりません",
        "double": "{_field_}フィールドは有効な10進数である必要があります"
    } 
});

export default {
    components: {
        ValidationProvider,
        ValidationObserver
    },
    data: () => ({
        max_length_password: 8,
    })
};