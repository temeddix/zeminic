/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶모듈 로드
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

import babelPolyfill from '@babel/polyfill';
import vue from 'vue';
import vueScroll from 'vuescroll';
import vueTouchEvents from 'vue2-touch-events';
import vuetify from 'vuetify/lib' //Material Design 양식에 기반한 Vue UI 컴포넌트 라이브러리. https://vuetifyjs.com/en/getting-started/installation/ 여기가 사용법 안내.

import model from './model.vue'
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
        
        el.addEventListener('mouseover', function(event){
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
▶▶뷰 인스턴스 생성(=HTML에 적용)
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
const app = new vue(model);