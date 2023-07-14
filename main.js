import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);
import store from '@/store';

import uView from '@/uni_modules/uview-ui'
Vue.use(uView);

import ZAudio from '@/components/uniapp-zaudio';
let zaudio = new ZAudio({
  continuePlay: true, //续播
  autoPlay: true, //自动播放 部分浏览器不支持
});
Vue.prototype.$zaudio = zaudio; //挂载vue原型链上
let data = [];
zaudio.setAudio(data); //添加音频
// zaudio.setRender(0)//渲染第一首音频


const innerAudioContext = uni.createInnerAudioContext();
innerAudioContext.autoplay = true;
innerAudioContext.loop = true;
Vue.prototype.innerAudioContext = innerAudioContext;

const app = new Vue({
	store,
    ...App
})

// 引入请求封装，将app参数传递到配置中
require('./http/httpInterceptor.js')(app)

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif