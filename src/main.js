// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'
//通过impor进行导入
Vue.config.productionTip = false;
Vue.use(infiniteScroll);
//全局拒绝过滤器
Vue.filter('currency',currency);
Vue.use(VueLazyLoad,{
  loading:'/static/loading-svg/loading-bars.svg'
});
/* eslint-disable no-new */
import './assets/css/base.css'
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
