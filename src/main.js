// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import VueLaztLoad from 'vue-lazyload'
import store from './store'

Vue.config.productionTip = false
fastclick.attach(document.body)
Vue.use(VueLaztLoad, {
  loading: require('common/image/default.png')
})
/* attach（）按钮点击300ms处理 */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
