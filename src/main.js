/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶모듈 로드
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

import vue from 'vue';
import vueScroll from 'vuescroll';
import vueTouchEvents from 'vue2-touch-events';
import vueRouter from 'vue-router';
import vuetify from 'vuetify/lib'; //Material Design 양식에 기반한 Vue UI 컴포넌트 라이브러리. https://vuetifyjs.com/en/getting-started/installation/ 여기가 사용법 안내.
import colors from 'vuetify/es5/util/colors'

import './styles/basic.scss'; //CSS 파일은 import하는 것만으로도 전체에 반영돼. 웹팩 기능이야.
import '@mdi/font/css/materialdesignicons.css' //Material Design 아이콘 팩. vuetify가 사용함.





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶모든 라이브러리 파일들을 불러와서 브라우저의 windows.xxx형식의 전역변수로 등록되게 하기
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

//이렇게 이름 없이 불러들이기만 하면 딱히 변수로 등록되진 않지만, 그 안에 있는 global(=window) 변수 등록 코드가 실행되어 라이브러리가 브라우저의 window.xxx라는 전역 변수가 되는 효과가 있음.
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
// https://kr.vuejs.org/v2/guide/custom-directive.html
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

vue.component('top-bar', require('./components/top-bar.vue').default)
vue.component('elastic-button', require('./components/elastic-button.vue').default)
vue.component('elastic-alert', require('./components/elastic-alert.vue').default)





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶주소에 따라 <router-view> 내용을 바꿔주는 vue-router 주소관계 설정
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

const routes = [{
    path: '/',
    component: require('./views/home.vue').default
  },
  {
    path: '/flower/:flowerId',
    component: require('./views/flower.vue').default
  },
  {
    path: '/grass',
    component: require('./views/grass.vue').default
  },
  {
    path: '/tree',
    component: require('./views/tree.vue').default
  },
  {
    path: '*',
    component: require('./views/not-found.vue').default
  }, //마지막으로 남은 모든 경우의 수에서는 not-found 페이지를 표시하라는 뜻
]

const routerOpotions = {
  routes: routes,
  mode: 'history',
};




/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶기타 설정
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

vue.config.productionTip = false

const vuetifyOptions = {
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    dark: true,
    options: {
      customProperties: true, //각 컴포넌트의 <style> 영역에서 변수로 접근 가능해짐
      variations: false,
    },
    themes: {
      // 방법 참고 https://vuetifyjs.com/en/features/theme/
      // 색깔 참고 https://vuetifyjs.com/en/styles/colors/#material-colors
      light: {
        primary: colors.shades.black, // Highlight에 쓰임. 그러니까 함부로 부여하지 말기. =켜진 상태.
        secondary: colors.grey.darken4, //강조하고 싶을 땐 이 속성을 쓰기. =돋보이는 것.
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        background: "#f2f2f2", //custom
      },
      dark: {
        primary: colors.shades.white, // Highlight에 쓰임. 그러니까 함부로 부여하지 말기. =켜진 상태.
        secondary: colors.grey.darken3, //강조하고 싶을 땐 이 속성을 쓰기. =돋보이는 것.
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        background: "#151515", //custom
      },
    },
  },
};





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶뷰 인스턴스 생성(=HTML에 적용)
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

import rootVueOptions from './app.vue';
//rootVueOptions은 단순한 그냥 오브젝트임. console.log()를 해 보면 바로 알 수 있지.

rootVueOptions.el = '#vueModelElement' //index.html의 해당 id를 가진 요소에 뷰 앱이 삽입됨
rootVueOptions.router = new vueRouter(routerOpotions)
rootVueOptions.vuetify = new vuetify(vuetifyOptions)

new vue(rootVueOptions);