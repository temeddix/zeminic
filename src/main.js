/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶모듈 로드
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

import vue from 'vue';
import vueScroll from 'vuescroll';
import vueTouchEvents from 'vue2-touch-events';
import vuetify from 'vuetify/lib'; //Material Design 양식에 기반한 Vue UI 컴포넌트 라이브러리. https://vuetifyjs.com/en/getting-started/installation/ 여기가 사용법 안내.





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶모든 라이브러리를 전역변수로 등록
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

//이렇게 이름 없이 불러들이기만 하면 변수를 가져오진 않지만, 그 안에 있는 global 변수 등록 코드가 실행되어 라이브러리가 window.library라는 전역 변수가 되는 효과가 있음.
//*로 모든 파일을 로드하는 건 import-glob이라는 webpack preloader npm 덕분에 가능함
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_a_module_for_its_side_effects_only

import "./libraries/**/*.js";





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶제미넴만의 뷰모델 준비
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

import app from './app.vue'
import './style.css';






/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶Vue 플러그인 적용
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
// 관련글 https://ui.toast.com/weekly-pick/ko_20200804
vue.use(vueTouchEvents);
vue.use(vueScroll,{
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
        
        el.addEventListener('mouseover', function(){
            showTimer = setTimeout(function(){
                vnode.context.$root.showElasticAlert(el, binding.value);
            }, 500)
        })
        el.addEventListener('mouseleave', function(){
            clearTimeout(showTimer);
        })
        el.addEventListener('mousedown', function(){
            clearTimeout(showTimer);
        })
        el.addEventListener('click', function(){
            clearTimeout(showTimer);
        })
    }
})





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶Vue 컴포넌트 등록
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

import helloWorld from './components/hello-world.vue'
vue.component('hello-world', helloWorld)
import topBar from './components/top-bar.vue';
vue.component('top-bar', topBar)
import elasticButton from './components/elastic-button.vue';
vue.component('elastic-button', elasticButton)
import elasticTextbox from './components/elastic-textbox.vue';
vue.component('elastic-textbox', elasticTextbox)
import elasticAlert from './components/elastic-alert.vue';
vue.component('elastic-alert', elasticAlert)
import divider from './components/divider.vue';
vue.component('divider', divider)
import layoutBlock from './components/layout-block.vue';
vue.component('layout-block', layoutBlock)







/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶Vue 기타 설정
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

vue.config.productionTip = false





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶뷰 인스턴스 생성(=HTML에 적용)
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

new vue({
    vuetify: new vuetify(),
    render: h => h(app),
  }).$mount('#vueModelElement')