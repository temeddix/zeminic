/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶필요한 자바스크립트 모듈들 로드
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

import vue from 'vue';
import vueScroll from 'vuescroll';
import vueTouchEvents from 'vue2-touch-events';
import vuetify from 'vuetify/lib' //용량절약 Treeshaking을 위해 lib을 씀. https://vuetifyjs.com/en/features/treeshaking/#vuetify-loader





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶Vue 플러그인
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

vue.use(vueTouchEvents);
vue.use(vueScroll, {ops: {
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
}, name: 'vue-scroll'});
vue.use(vuetify)





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶Vue 컴포넌트
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
▶▶Vue 지시문
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
▶▶시작 기반 뷰모델
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

const baseVueModel = vue.extend({
    data: function(){ return{
        isAuthenticationChecked: false,
        isAuthenticated: null,
        userInfo: {
            userEmail: '',
            userAilas: '',
        },
        scrollPosition: 0,
        topBarTimer: null,
        layoutDebugging: false,
        isDebugging: false,
        isFullscreen: false,
		isMobile: detectMobile(),
    }},
    computed: {
    },
    methods: {
        toggleFullscreen: function(){
            let self = this;

            var doc = window.document;
            var docEl = doc.documentElement;
          
            var requestFullScreen =
            docEl.requestFullscreen
            || docEl.mozRequestFullScreen
            || docEl.webkitRequestFullScreen
            || docEl.msRequestFullscreen;

            var cancelFullScreen =
            doc.exitFullscreen
            || doc.mozCancelFullScreen
            || doc.webkitExitFullscreen
            || doc.msExitFullscreen;
          
            if(
            !doc.fullscreenElement
            && !doc.mozFullScreenElement
            && !doc.webkitFullscreenElement
            && !doc.msFullscreenElement) {
                requestFullScreen.call(docEl);
                self.isFullscreen = true;
            }
            else {
                cancelFullScreen.call(doc);
                self.isFullscreen = false;
            }
        },
        showTopBar: function ()
        {
            let self = this;
            
            if(!self.isTopBarShown){
                self.isTopBarShown = true;
                clearTimeout(self.topBarTimer);
                self.topBarTimer = setTimeout( function(){
                    self.isTopBarShown = false;
                } , 3000 );
            }
            else{
                clearTimeout(self.topBarTimer);
                self.isTopBarShown = false;
            }
        },
        signIn: function (signInInputs)
        {
            let self = this;
            
            axios
            .post('/ajax/login', signInInputs)
            // response를 안쓰지만 인자로 받는 이유는 이걸 안받으면 리스폰스 받기도 전에 코드 시행해버림
            .then(function(response){
                if(response.data.isOk==true){
                    console.log(response);
                    self.$root.$emit('close-all-sign-popups');
                    self.getSignStatus();
                    setTimeout(function(){
                        self.tellSignStatus();
                    }, 1000)
                }
                else{
                    self.showElasticAlert('signInSubmitButton', response.data.msg);
                }
            })
            .catch(error => alert(error));
        },
        signOut: function ()
        {
            let self = this;

            axios
            .post('/ajax/logout')
            // response를 안쓰지만 인자로 받는 이유는 이걸 안받으면 리스폰스 받기도 전에 코드 시행해버림
            .then(function(response){
                if(response.data.isOk==true){
                    console.log(response);
                    self.$root.$emit('close-all-sign-popups');
                    self.getSignStatus();
                    setTimeout(function(){
                        self.tellSignStatus();
                    }, 1000)
                }
                else{
                    self.showElasticAlert('signInSubmitButton', response.data.msg);
                }
            })
            .catch(error => alert(error));
        },
        getSignStatus: function ()
        {
            let self = this;

            axios
            .post('/ajax-tunnel/sign-in-check')
            .then(response => {
                self.isAuthenticated = response.data.isAuthenticated;
                if(response.data.isAuthenticated==true){
                    self.userInfo = response.data.user;
                    self.isAuthenticationChecked = true;
                }
                else{
                    self.isAuthenticationChecked = true;
                }
            })
            .catch(error => alert(error));
        },
        tellSignStatus: function ()
        {
            let self = this;

            if(self.isAuthenticated==true){
                self.showElasticAlert('signPopupButton', '로그인 된 상태입니다!');
            }
            else{
                self.showElasticAlert('signPopupButton', '로그아웃 된 상태입니다!');
            }
        },
        showElasticAlert: function(target, alertText){
            let componentClass = vue.extend(elasticAlert);
            let instance = new componentClass({
                propsData: {
                    target: target,
                    alertText: alertText
                }
            });
            instance.$mount();
            document.body.appendChild(instance.$el);
        },
    },
    created: function(){
    },
    mounted: function(){
        let self = this;
        
        //self.getSignStatus(); //페이지 열자마자 로그인 상태 확인

        gsap.registerPlugin(CustomEase); //gsap에서 애니메이션 곡선 플러그인 사용하도록 등록
        objectFitImages(); //IE 이미지 크기조절방식 호환성을 위한 폴리필(Polyfill) 실행

		window.addEventListener('scroll', function() {
			let scrollTop = document.documentElement.scrollTop;
            self.$root.scrollPosition = scrollTop;
		});

		window.addEventListener('resize', function() {
			self.isMobile= detectMobile();
		});
    }
});

export default baseVueModel;