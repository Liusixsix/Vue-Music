import Vue from 'vue'
import { Locale } from 'vant'
import VueI18n from 'vue-i18n'
import zhCN from 'vant/lib/locale/lang/zh-CN'
import enUS from 'vant/lib/locale/lang/en-US'

import zh from './zh'
import en from './en'

Vue.use(VueI18n)

const messages = {
    zh: {
        ...zhCN,
        ...zh
    },
    en: {
        ...enUS,
        ...en
    }
}

const i18n = new VueI18n({
    locale: 'zh',  // 设置默认语言
    messages  // 设置资源文件对象
})

// 更新vant组件库本身的语言变化，支持国际化
function vantLocales(lang) {
    console.log(lang)
    if (lang === 'en') {
        Locale.use(lang, enUS)
    } else if (lang === 'zh') {
        Locale.use(lang, zhCN)
    }
}

export { i18n, vantLocales };