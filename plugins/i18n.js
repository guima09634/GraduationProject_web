import Vue from 'vue'
import VueI18n from 'vue-i18n'
import extend from 'extend'
import Config from '@/config/config'
import Util from '@/lib/util'

Vue.use(VueI18n)

export default ({ app, req }) => {
  const messages = {}
  for (const one in Config.locale.all) {
    const v = Config.locale.all[one]
    messages[one] = extend(true, require(`@/locales/${one}.json`),
      require(`element-ui/lib/locale/lang/${v}`).default)
  }

  let language
  try {
    if (process.client) {
      console.log('navigator.browserlanguage:' + navigator.browserlanguage)
      console.log('navigator.language:' + navigator.language)
      language = navigator.browserlanguage ||
        navigator.language ||
        Config.locale.default
    } else {
      language = req.headers['accept-language'].split(',')[0]
    }
  } catch (e) {
  }

  console.log('language:' + language)
  // language = messages[language] ? language : Config.locale.default;
  language = Util.getCookie('lang') || 'zh-CN'
  app.i18n = new VueI18n({
    locale: language,
    fallbackLocale: language,
    messages: messages
  })
}
