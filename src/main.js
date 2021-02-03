/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶모듈 로드
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

import vue from 'vue';
import vueScroll from 'vuescroll';
import vueTouchEvents from 'vue2-touch-events';
import vueRouter from 'vue-router';
import vuetify from 'vuetify/lib'; //Material Design 양식에 기반한 Vue UI 컴포넌트 라이브러리. https://vuetifyjs.com/en/getting-started/installation/ 여기가 사용법 안내.
import colors from 'vuetify/es5/util/colors';

import '@mdi/font/css/materialdesignicons.css' //Material Design 아이콘 팩. vuetify가 사용함. https://materialdesignicons.com/ 여기가 아이콘 목록.

import './styles/basic.scss'; //CSS 파일은 import하는 것만으로도 전체에 반영돼. 웹팩 기능이야.
import './styles/override.scss';





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶모든 라이브러리 파일들을 불러와서 브라우저의 windows.xxx형식의 전역변수로 등록되게 하기
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

//*로 모든 파일을 로드하는 건 import-glob이라는 webpack preloader npm 덕분에 가능함
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_a_module_for_its_side_effects_only

//NPM 기반 라이브러리들
window.vue = require('vue').default;
window.axios = require('axios').default;
window.gsap = require('gsap').default;
window.cookies = require('js-cookie');
window.cssVarsPonyfill = require('css-vars-ponyfill').default; //IE11을 위한 CSS var기능 관련 Polyfill 호환성 확보 라이브러리

//CDN 기반 라이브러리들
//이렇게 이름 없이 불러들이기만 하면, 그 안에 있는 모든 코드가 실행됨
//즉 라이브러리에 내장된 global(=window) 변수 등록 코드가 실행되어 라이브러리가 브라우저의 window.xxx라는 전역 변수가 되는 효과가 있음.
import "./libraries/cdn/gsap-custom-ease.js";
import "./libraries/cdn/iamport.js";
import "./libraries/cdn/jquery.js";

//직접 만든 라이브러리들
import "./libraries/custom/calculate-position.js";
import "./libraries/custom/hex-to-rgb.js";
import "./libraries/custom/rgb-to-hex.js";
import "./libraries/custom/simple-pay.js";







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
▶▶Alert-Elastic 사용 가능하도록
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

// 전역 사용자 정의 디렉티브 v-elastic-alert 등록
// https://kr.vuejs.org/v2/guide/custom-directive.html
vue.directive('alert-elastic', {
  bind(el, binding, vnode) {},
  inserted(el, binding, vnode) {
    let showTimer;

    el.addEventListener('mouseover', function () {
      showTimer = setTimeout(function () {
        vnode.context.$alertElastic(el, binding.value);
      }, 500) //500밀리초 동안 마우스를 올리고 있으면 실행한다는 뜻
    })
    el.addEventListener('mouseleave', function () {
      clearTimeout(showTimer);
    })
    el.addEventListener('mouseout', function () {
      clearTimeout(showTimer);
    })
    el.addEventListener('mousedown', function () {
      clearTimeout(showTimer);
    })
    el.addEventListener('click', function () {
      clearTimeout(showTimer);
    })
  },
  update(el, binding, vnode) {},
  componentUpdated(el, binding, vnode) {},
  unbind(el, binding, vnode) {},
})

//그 어떤 컴포넌트에서든 this.$elasticAlert로 사용할 수 있게 됨
window.alertElasticActive = [];
vue.prototype.$alertElastic = function (target, alertText) {
  let componentClass = vue.extend(require('./components/alert-elastic.vue').default);
  let instance = new componentClass({
    propsData: {
      target: target,
      alertText: alertText,
    },
  });
  instance.$mount();
  document.getElementById("app").appendChild(instance.$el);
}





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶시기변수(Historic Variables) 사용 가능하도록
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

window.timeTravelled = false;
window.historicVariables = []; // 순서는 절대 변하지 않음. historicVariables[N]이 가리키는 대상은 항상 똑같음

vue.prototype.$setHistoricVariable = function (parentObject, propertyName) {
  let doesExist = false

  //가리키는 대상이 같은 자료가 이미 존재한다면 "이미 있는가?"에 대한 대답은 true
  window.historicVariables.forEach(targetInfo => {
    if (targetInfo.parentObject == parentObject && targetInfo.propertyName == propertyName) {
      doesExist = true;
    }
  })

  //가리키는 대상이 같은 자료가 없다면 추가
  if (doesExist == false) {
    window.historicVariables.push({
      parentObject,
      propertyName,
      value: parentObject[propertyName],
    });
  }
};

setInterval(() => {

  //혹시라도 history.state가 null일 때에는 채워넣기
  if (history.state == null) {
    console.log("첫 state");
    history.replaceState({}, null, null);
  }


  //시간여행을 했다면 바뀌어야 하는 건 history.state가 아니라 historic variables(거꾸로)
  if (window.timeTravelled == true) {
    let index = 0;
    let values = history.state.reducedHistoricVariables

    window.historicVariables.forEach(targetInfo => {
      targetInfo.parentObject[targetInfo.propertyName] = values[index].value;
      targetInfo.value = values[index].value;
      index += 1;
    })

    window.timeTravelled = false;
    return;
  }

  //시기변수가 바뀌었는지 판별하는 변수
  let isValueChanged = false;

  //시기변수들 중 하나라도 값이 바뀌었다면 "변했는가?"에 대한 답은 true
  window.historicVariables.forEach(targetInfo => {
    if (targetInfo.parentObject == null) {
      //그 자바스크립트 오브젝트가 불미스러운 일로 제거되었다면 무시
      return;
    }
    let calculated = targetInfo.parentObject[targetInfo.propertyName];
    if (targetInfo.value != calculated) {
      targetInfo.value = calculated;
      isValueChanged = true;
    }
  })

  let reducedHistoricVariables = [];
  let newState = {};

  //history.state에 담을 오브젝트 제작
  window.historicVariables.forEach(targetInfo => {
    reducedHistoricVariables.push({
      propertyName: targetInfo.propertyName,
      value: targetInfo.value
    });
  })

  newState = Object.assign(history.state, {
    reducedHistoricVariables
  });

  history.replaceState(newState, null, null);

  if (isValueChanged == true) {
    //"변했는가?"가 true면 새로운 시기 추가
    console.log("바뀌어서 다음 시기 등록");
    history.pushState(history.state, null, null);
  }

  console.log(history.state);
}, 20)

window.addEventListener("popstate", event => {
  console.log("POPSTATE");
  window.timeTravelled = true;
})








/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶Vue 컴포넌트 등록 (전역으로 Global하게=어디에서든 쓸 수 있게)
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

//components
vue.component('v-app-bar-elastic', require('./components/v-app-bar-elastic.vue').default)
vue.component('alert-elastic', require('./components/alert-elastic.vue').default)
vue.component('v-dialog-elastic', require('./components/v-dialog-elastic.vue').default)

//forms
vue.component('app-bar-items', require('./forms/app-bar-items.vue').default)
vue.component('login-inputs', require('./forms/login-inputs.vue').default)
vue.component('settings-inputs', require('./forms/settings-inputs.vue').default)
vue.component('dev-items', require('./forms/dev-items.vue').default)
vue.component('signup-inputs', require('./forms/signup-inputs.vue').default)



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
▶▶Vuetify 기본값 수정하기
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

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
      // 기본 7가지 색상은 텍스트 색상이 안 바뀐다. Custom 색상을 만들어 쓰기.
      light: {
        primary: colors.shades.black, // Highlight에 쓰임. 그러니까 함부로 부여하지도 쓰지도 말기. =켜진 상태.
        secondary: colors.shades.darken3, //함부로 부여하지도 쓰지도 말기. 텍스트 컬러는 바뀌지도 않음.
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        backdrop: "#ececec", //custom
        area: "#f8f8f8", //custom
        stuff: "#ffffff", //custom
      },
      dark: {
        primary: colors.shades.white, // Highlight에 쓰임. 그러니까 함부로 부여하지 말기. =켜진 상태.
        secondary: colors.grey.lighten3, //함부로 부여하지도 쓰지도 말기. 텍스트 컬러는 바뀌지도 않음.
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        backdrop: "#151515", //custom
        area: "#1b1b1b", //custom
        stuff: "#333333", //custom
      },
    },
  },
};

require("vuetify/lib").VOverlay.options.props.color.default = "#000000";
require("vuetify/lib").VTextField.options.props.rounded.default = true;
require("vuetify/lib").VTextField.options.props.hideDetails.default = true;
require("vuetify/lib").VTextField.options.props.filled.default = true;
require("vuetify/lib").VSwitch.options.props.hideDetails.default = true;
require("vuetify/lib").VBtn.options.props.rounded.default = true;





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶기타 설정
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

vue.config.productionTip = false;





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶뷰 인스턴스 생성(=HTML에 적용)
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

import rootVueOptions from './app.vue';
//rootVueOptions은 단순한 자바스크립트 오브젝트임. console.log()를 해 보면 바로 알 수 있지.

rootVueOptions.el = '#vueModelElement' //index.html의 해당 id를 가진 요소에 뷰 앱이 삽입됨
rootVueOptions.router = new vueRouter(routerOpotions)
rootVueOptions.vuetify = new vuetify(vuetifyOptions)

window.vueModel = new vue(rootVueOptions);