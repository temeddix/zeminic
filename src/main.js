/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶모듈 로드
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

import vue from 'vue';
import vueScroll from 'vuescroll';
import vueTouchEvents from 'vue2-touch-events';
import vueRouter from 'vue-router';
import vuetify from 'vuetify/lib'; //Material Design 양식에 기반한 Vue UI 컴포넌트 라이브러리. https://vuetifyjs.com/en/getting-started/installation/ 여기가 사용법 안내.

import './style.scss'; //CSS 파일은 import하는 것만으로도 전체에 반영돼. 웹팩 기능이야.
import '@fortawesome/fontawesome-free/css/all.css' //Font awesome에서 제공한 아이콘 팩. vuetify에 사용하려는 목적이야





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶모든 라이브러리 파일들을 불러와서 windows.xxx형식의 전역변수로 등록
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

//이렇게 이름 없이 불러들이기만 하면 변수를 가져오진 않지만, 그 안에 있는 global 변수 등록 코드가 실행되어 라이브러리가 window.library라는 전역 변수가 되는 효과가 있음.
//*로 모든 파일을 로드하는 건 import-glob이라는 webpack preloader npm 덕분에 가능함
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_a_module_for_its_side_effects_only

import "./libraries/**/*.js";







/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶Vue 플러그인 적용
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

vue.use(vueRouter)
vue.use(vueTouchEvents);
vue.use(vueScroll, {
  ops: {
    vuescroll: {
      mode: 'native',
      sizeStrategy: 'percent',
      detectResize: true,
      wheelScrollDuration: 100,
      wheelDirectionReverse: false
    },
    scrollPanel: {
      scrollingX: false,
      scrollingY: true,
    },
    rail: {},
    bar: {
      showDelay: 1000,
      onlyShowBarOnScroll: true,
      keepShow: false,
      background: '#000000',
      opacity: 0.2,
      hoverStyle: false,
      specifyBorderRadius: false,
      minSize: 0,
      size: '6px',
      disable: false
    }
  },
  name: 'vue-scroll'
});
vue.use(vuetify);





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶Vue 지시문 등록
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

// 전역 사용자 정의 디렉티브 v-guide-alert 등록
vue.directive('guide-alert', {
  // 바인딩 된 엘리먼트가 DOM에 삽입되었을 때...
  inserted: function (el, binding, vnode) {
    let showTimer;

    el.addEventListener('mouseover', function () {
      showTimer = setTimeout(function () {
        vnode.context.$root.showElasticAlert(el, binding.value);
      }, 500)
    })
    el.addEventListener('mouseleave', function () {
      clearTimeout(showTimer);
    })
    el.addEventListener('mousedown', function () {
      clearTimeout(showTimer);
    })
    el.addEventListener('click', function () {
      clearTimeout(showTimer);
    })
  }
})





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶Vue 컴포넌트 등록 (전역으로 Global하게=어디에서든 쓸 수 있게)
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

vue.component('hello-world', require('./components/hello-world.vue').default)
vue.component('top-bar', require('./components/top-bar.vue').default)
vue.component('elastic-button', require('./components/elastic-button.vue').default)
vue.component('elastic-alert', require('./components/elastic-alert.vue').default)





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶주소에 따라 <router-view> 내용을 바꿔주는 vue-router 주소관계 설정
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

const routes = [
  { path: '/', component: require('./views/home.vue').default },
  { path: '/flower/:flowerId', component: require('./views/flower.vue').default },
  { path: '/grass', component: require('./views/grass.vue').default },
  { path: '/tree', component: require('./views/tree.vue').default },
]





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶기타 설정
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

vue.config.productionTip = false





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶뷰 인스턴스 생성(=HTML에 적용)
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

new vue({
  router: new vueRouter({
    routes: routes,
    mode: 'history',
  }),
  vuetify: new vuetify({
    icons: {
      iconfont: 'fa', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
  }),
  render: h => h(require('./app.vue').default),
}).$mount('#vueModelElement')