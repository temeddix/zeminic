<template>
<div>
    <v-expansion-panels>
        <v-expansion-panel
            v-for="(item,i) in 5"
            :key="i"
        >
            <v-expansion-panel-header>
            Item
            </v-expansion-panel-header>
            <v-expansion-panel-content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>

    <v-btn elevation="15">이건 버튼이다 버튼</v-btn>

    <v-checkbox
    v-model="checkbox"
    :label="`Checkbox 1: ${checkbox.toString()}`"
    ></v-checkbox>
</div>
</template>

<script>
import vuetify from 'vuetify/lib' //Material Design 양식에 기반한 Vue UI 컴포넌트 라이브러리. https://vuetifyjs.com/en/getting-started/installation/ 여기가 사용법 안내.
import vueRouter from 'vue-router'

export default {
    el: '#vueModelElement',
    vuetify: new vuetify({
        //vuetify options
    }),
    data: function(){ return{
        checkbox: false, //실험용
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
		});

		window.addEventListener('resize', function() {
			self.isMobile= detectMobile();
		});
    }
};
</script>

<style scoped>
</style>