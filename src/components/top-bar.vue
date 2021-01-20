<template>
<div class='topBar' :style='outerStyle'>

    <div class='pageInformation' :style='pageInformationStyle'>
        <div class='pageType'><slot name='page-type'></slot></div>
        <div class='pageName' ><slot></slot></div>
    </div>

    <elastic-button
    id='theLogo'
    link-to='/'
    class='logoIcon topBarItemLeft'
    v-guide-alert='"반가워요! 여기는 오픈 웹툰 플랫폼 제미넴입니다!"'>
        <div class='fillParent'
        style='background-image: url("/logo.png");'>
        </div>
    </elastic-button>

    <elastic-button 
    ref='signPopupButton'
    id='signPopupButton'
    :switch-on='$root.isAuthenticated'
    class='signStatusButton topBarItemRight'
    poppable>

        {{ $root.isAuthenticated? $root.userInfo.userAlias: '로그인하세요!' }}

        <template v-slot:popup-content>
            <div v-if='$root.isAuthenticated==false'>

                <layout-block>
                    <p class='titleText'>로그인</p>
                </layout-block>

                <divider></divider>

                <layout-block>
                    <elastic-textbox
                    v-model='signInInputs.email'
                    label-text='이메일'
                    placeholder-text='abcde@domain.com'
                    class='inputBox'></elastic-textbox>
                </layout-block>
                
                <layout-block>
                    <elastic-textbox
                    v-model='signInInputs.pw'
                    label-text='암호'
                    text-hidden
                    class='inputBox'
                    v-on:keyup.enter.native='signIn'>
                    </elastic-textbox>
                </layout-block>
                
                <layout-block>
                    <elastic-button
                    id='signInSubmitButton'
                    class='blackButton'
                    @click.native='signIn'>
                        로그인
                    </elastic-button> 

                    <elastic-button
                    ref='signUpPopupButton'
                    id='signUpPopupButton'
                    poppable
                    :popup-width='500'
                    :popup-height='500'
                    class='blackButton'>

                        회원가입

                        <template v-slot:popup-content>

                            <layout-block>
                                <p class='titleText'>회원가입</p>
                            </layout-block>

                            <divider></divider>
<!--
                            <layout-block>
                                <div>
                                    <p>이메일을 입력한 후, 인증 코드를 전송해서</p>
                                    <p>자신의 이메일이 맞는지 확인해주세요</p>
                                </div>
                            </layout-block>
-->
                            <layout-block>
                                <elastic-textbox
                                class='inputBox'
                                v-model='signUpInputs.email'
                                label-text='이메일'>
                                </elastic-textbox>
                            </layout-block>
<!--
                            <layout-block>
                                <div class='inputBox flexContainer'>
                                    <elastic-button
                                    class='sideButton'
                                    @click.native='generateValidationCode'>
                                        전송
                                    </elastic-button>
                                    <elastic-textbox
                                    v-model='emailValidationCode'
                                    class='smallInputBox'
                                    label-text='인증 코드'>
                                    </elastic-textbox>
                                    <elastic-button
                                    id='validateEmailButton'
                                    class='sideButton'
                                    @click.native='validateEmail'
                                    :switch-on='isEmailValidated'>
                                        인증
                                    </elastic-button>
                                </div>
                            </layout-block>

                            <divider></divider>
-->
                            <layout-block>
                                <elastic-textbox
                                class='inputBox'
                                v-model='signUpInputs.pw'
                                label-text='암호'
                                text-hidden>
                                </elastic-textbox>
                            </layout-block>

                            <layout-block>
                                <elastic-textbox
                                class='inputBox'
                                v-model='signUpInputs.nickname'
                                label-text='별명'
                                v-on:keyup.enter.native='signUp'>
                                </elastic-textbox>
                            </layout-block>

                            <divider></divider>

                            <layout-block>
                                <elastic-button
                                id='signUpSubmitButton'
                                class='blackButton'
                                @click.native="signUp">
                                    가입하기
                                </elastic-button>
                            </layout-block>
                        </template>

                    </elastic-button>
                </layout-block>

            </div>

            <div v-else>

                <layout-block>
                    <elastic-button
                    link-to='/account'
                    class='accountButton topBarItemRight bigText'>
                    </elastic-button>
                </layout-block>

                <layout-block>
                    <div>
                        <p class='titleText'>{{ $root.userInfo.userAlias }}</p>
                        <p class='bigText'>{{ $root.userInfo.userEmail }}</p>
                    </div>
                </layout-block>

                <divider></divider>

                <layout-block>
                    <div>
                        <elastic-button 
                        class='blackButton'
                        @click.native="signOut">
                            로그아웃
                        </elastic-button>
                        <elastic-button
                        ref='withdrawPopupButton'
                        id='withdrawPopupButton'
                        class='blackButton'
                        :popup-width='400'
                        :popup-height='400'
                        poppable>
                            회원탈퇴
                            <template v-slot:popup-content>
                                
                                <layout-block>
                                    <div>
                                        <p>정말로 회원탈퇴하시겠어요?</p>
                                        <p>이 선택은 되돌릴 수 없습니다.</p>
                                    </div>
                                </layout-block>

                                <divider>
                                </divider>

                                <layout-block>
                                    <elastic-textbox
                                    class='inputBox'
                                    v-model='withdrawInputs.userPw'
                                    label-text='암호'
                                    text-hidden>
                                    </elastic-textbox>
                                </layout-block>

                                <divider></divider>

                                <layout-block>
                                    <elastic-button
                                    id='withdrawSubmitButton'
                                    class='blackButton'
                                    @click.native='withdraw'>
                                        탈퇴하기
                                    </elastic-button>
                                </layout-block>

                            </template>
                        </elastic-button>
                    </div>
                </layout-block>
            </div>
            
        </template>
    </elastic-button>

    <elastic-button
    class='fullscreenButton topBarItemRight'
    :switch-on='$root.isFullscreen'
    v-guide-alert='"전체화면에서 더 몰입도 높은 경험을 만끽해 보세요!"'
    @click.native='$root.toggleFullscreen()'>
    </elastic-button>

    <div
    ref='mouseDetector'
    v-if='!isMobile'
    class='mouseDetector'
    @mouseover='$root.showTopBar()'>
    </div>

    <elastic-button
    ref='debuggingPanel'
    class='debuggingPanel'
    poppable>
        <template v-slot:popup-content>
            디버깅 패널이다!
            <br>원하는 거 다 적어봐라
            <br>Shift+D를 누르면 보인다
            <br>
            <vs-button
                :active="active == 0"
                @click="active = 0"
            >
                Active
            </vs-button>
            <vs-button
                :active="active == 1"
                @click="active = 1"
            >
                Default
            </vs-button>
            <vs-button disabled >Disabled</vs-button>
            <div class="center">
                <vs-button
                    @click="openNotification">
                    Open Notification
                </vs-button>
            </div>
        </template>
    </elastic-button>

    <elastic-button
    ref='showTopBarButton'
    class='showTopBarButton'
    @click.native='$root.showTopBar()'>
    </elastic-button>
</div>
</template>

<script>
const gsap = window.gsap;
const axios = window.gsap;
const detectMobile = window.detectMobile;

export default {
    data: function() { return {
        isVisible: false,
        isEmailValidated: false,
        emailValidationCode: '',
        signInInputs: {
            email: '',
            pw: '',
        },
        signUpInputs: {
            email : '',
            pw : '',
            nickname: '',
        },
        withdrawInputs: {
            userPw: '',
        },
        tweenedTopBarPosition: 0,
        isMobile: detectMobile(),
        showPageInformation: true,
        tweenedInformationSize: 1,
        targetTopBarPosition: 0,
        active: 0,
    }},
    computed:{
        outerStyle(){ 
            return {
                top: this.tweenedTopBarPosition<0? this.tweenedTopBarPosition + 'px': '0px',
                //▲▲ iOS Safari 오버스크롤시 깜빡임 버그 제거를 위해
            }
        },
        pageInformationStyle(){ 
            return {
                transform: 'scale(' + (this.tweenedInformationSize*0.5+0.5) + ')',
                opacity: this.tweenedInformationSize ** 3,
            }
        },
    },
    watch: {
        targetTopBarPosition(newValue){
            gsap.to(this.$data, { 
                duration: 0.6, 
                ease: 'power4',
                tweenedTopBarPosition: newValue 
            })
        },
        showPageInformation(newValue){
            if(newValue==true){
                gsap.to(this.$data, { 
                    duration: 1, 
                    ease: 'power4',
                    tweenedInformationSize: 1, 
                })
            }
            else{
                gsap.to(this.$data, { 
                    duration: 1, 
                    ease: 'power4',
                    tweenedInformationSize: 0, 
                })
            }
        },
    },
    methods: {
        signIn: function(){
            this.$root.signIn(this.signInInputs);
        },
        signOut(){
            this.$root.signOut();
        },
        signUp(){
            let self = this;
            axios
            .post('/ajax/signup', this.signUpInputs)
            .then(function(response){
                if(response.data.isOk==true){
                    self.$root.$emit('close-all-sign-popups');
                    setTimeout(function(){
                        self.$root.showElasticAlert('signPopupButton', '성공적으로 가입되었습니다!' );
                    }, 1000)
                }
                else{
                    self.$root.showElasticAlert('signUpSubmitButton', response.data.msg );
                }
            })
            .catch(error => alert(error));
        },
        withdraw(){
            let self = this;
            axios
            .post('/ajax-tunnel/withdraw', this.withdrawInputs)
            .then(response => {
                if(response.data.isOk==true){
                    self.$root.$emit('close-all-sign-popups');
                    self.$root.getSignStatus();
                    setTimeout(function(){
                        self.$root.showElasticAlert('signPopupButton', '회원 탈퇴가 완료되었습니다. 안녕히 가세요!' );
                    }, 1000)
                }
                else{
                    self.$root.showElasticAlert('withdrawSubmitButton', response.data.msg );
                }
            })
            .catch(error => alert(error));
        },
        openNotification() {
          this.$vs.notification({
            title: 'Documentation Vuesax 4.0+',
            text: `These documents refer to the latest version of vuesax (4.0+),
            to see the documents of the previous versions you can do it here 👉 Vuesax3.x`
          })
        } //실험용
    },
    created: function() {
        let self = this;

        self.$root.$on('close-all-sign-popups', function(){
            console.log('모든 회원 관련 팝업을 닫겠습니다');
            if(self.$root.isAuthenticated==true){
                self.$refs.withdrawPopupButton.hidePopup();
            }
            else{
                self.$refs.signUpPopupButton.hidePopup()
            }
            setTimeout(function(){
                self.$refs.signPopupButton.hidePopup();
            }, 500);
        });

        if(window.innerWidth<800){
            self.showPageInformation = false;
        }
        else{
            self.showPageInformation = true;
        }

        window.addEventListener('resize', function() {
            if(window.innerWidth < 800){
                self.showPageInformation = false;
            }
            else{
                self.showPageInformation = true;
            }
        });
    },
    mounted: function(){
        let self = this;

        let showTopBarButton = this.$refs.showTopBarButton.$el;
        document.body.appendChild(showTopBarButton);

        let debuggingPanel = this.$refs.debuggingPanel.$el;
        document.body.appendChild(debuggingPanel);

        if(this.isMobile == false){
            let mouseDetector = this.$refs.mouseDetector;
            document.body.appendChild(mouseDetector);
        }

        document.addEventListener('scroll', function(){
            self.targetTopBarPosition = this.isVisible? 0 : -Math.min(window.scrollY,200)
            console.log(self.targetTopBarPosition)
        })

        document.addEventListener('keydown', function(evt){
            if (!evt) evt = event;
            if (evt.shiftKey && evt.keyCode==68){ //D+P https://www.quirksmode.org/js/keys.html
                self.$refs.debuggingPanel.$el.click()
            }
            else if (evt.shiftKey && evt.keyCode == 9){ //Shif+TAB
                alert("Shift+TAB");
            }
        })
    }
}
</script>

<style lang="scss" module>
    .bigText{
        font-size: 14pt;
    }
    .biggerText{
        font-size: 20pt;
    }
    .titleText{
        font-size:28pt;
    }
    .layoutStack{
        display: inline-block;
        width: 100%;
        margin-top: 6px;
        margin-bottom: 6px;
    }
    .fillParent{
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
    }
    .topBar{
        position: fixed;
        left: 0;
        right: 0;

        display: flex;
        align-items: center;

        margin: 0;
        padding: 0px 20px;
        background-color: #e2e2e2;
        box-shadow: 0 0 36px rgba(0,0,0,0.2);

        height:80px;
        z-index: 50;

        &Item{

            &Left{
                margin-right: auto;
            }

            &Right{
                margin-left: auto;
            }

        }
    }
    .logoIcon{
        flex: 0 0 60px;
        height: 60px !important;
    }
    .signStatusButton{
        flex: 0 0 140px;
        margin: 6px;
    }
    .defaultButton{
        width: 96px !important;
        margin: 0px 6px;
    }
    .accountButton{
        width: 140px !important;
        height: 140px !important;
        border-radius: 1000px !important;
        margin: 6px;
        background-image: url(/svg-icons/user.svg);
    }
    .smallButton{
        flex: 0 0 48px;
        margin: 6px;
    }
    .wideButton{
        width: 260px !important;
    }
    .mouseDetector{
        position: fixed;
        height: 20px;
        width: 100%;
        top: 0px;
        z-index: 40;
    }
    .showTopBarButton{
        position: fixed !important;
        top: 14px;
        right: 14px;
        z-index: 45 !important;
        border-radius: 1000px !important;
        background-image: url(/svg-icons/pull-down.svg);
    }
    .inputBox{
        margin: 0px 6px;
        width: 100%;
        max-width: 300px;
    }
    .smallInputBox{
        margin: 0px 12px;
        width: 100%;
        max-width: 200px;
        flex: 1 1;
    }
    .sideButton{
        flex: 0 0;
    }
    .blackButton{
        background-color: #000000 !important;
        color: #ffffff !important;
        width: 96px !important;
        margin: 0px 6px;
    }
    .flexContainer{
        display: inline-flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        flex-direction: row;
    }
    .pageInformation{
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        flex-direction: row;
        margin: 6px;
        overflow: hidden;
        white-space: nowrap;
        font-size: 14pt;
    }
    .pageType{
        display: inline-flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-radius: 1000px;
        //background-color: #000000;
        border: 1px solid rgba(0,0,0,0.3);
        color: rgba(0,0,0,0.3);
        padding: 3px 12px;
        margin: 0px 10px 0px 0px;
        font-size: 10pt;
    }
    .pageName{
        font-size: 14pt;
    }
    .fullscreenButton{
        flex: 0 0 48px;
        margin: 6px;
        background-image: url('/svg-icons/fullscreen.svg');
    }
    .debuggingPanel{
        position: fixed !important;
        top: -80px;
        left: 14px;
        z-index: 45 !important;
        border-radius: 1000px !important;
        background-image: url(/svg-icons/pull-down.svg);
    }
</style>