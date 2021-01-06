<template>
    <div
    ref='buttonElement'
    :class='$style.buttonClass'
    :style='buttonStyle'
    @click='showPopup'
    @mouseover='mouseOver'
    @mouseleave='mouseLeave'
    v-touch:start='touchStart'
    v-touch:end='touchEnd'
    @mousedown='touchStart'
    @mouseup='touchEnd'>

        <div
        ref='switchIndicator'
        v-show='switchOn'
        :class='$style.switchIndicator'
        :style='switchIndicatorStyle'>
        </div>

        {{ (selectFile && fileName!='')? fileName: '' }}
        <slot v-if='fileName==""'></slot>

        <div :class='[$style.overfillParent, $style.baseHighlight]'>
        </div>

        <div :class='$style.overfillParent'>
            <div :class='[$style.mouseHighlight, $style.overfillParent]'
            :style='{opacity: Math.min(0.8, tweenedActivation*0.5)}'>
            </div>
        </div>

        <a v-if='linkTo!=""' :href='linkTo'>
            <div :class='$style.fillParent'></div>
        </a>

        <div v-if='selectFile' :class='$style.fillParent' @click='getFile'>
            <input
            type='file'
            multiple
            ref='fileInput'
            :class='$style.fileInput'
            @change='updatefileName'>
        </div>

        <div v-if='poppable' ref='popupElement' :class='$style.popupClass' :style='popupStyle'>
            <div :class='$style.fillParent'>
                <elastic-button
                :class='$style.exitButton'
                @click.native='hidePopup'>
                </elastic-button>
                <vue-scroll>
                    <div
                    :class='[$style.fillParent, $style.popupContent]'>
                        <div :class='$style.contentWrapper'>
                            <div :class='$style.filler'></div>
                            <slot name='popup-content'>내용</slot>
                            <div :class='$style.filler'></div>
                        </div>
                    </div>
                </vue-scroll>
            </div>
        </div>

        <div ref='overlayElement' :class='$style.overlayClass' v-if='poppable' v-show='isPopped' @click='hidePopup'>
        </div>

    </div>
</template>

<script>
export default {
    data: function() { return {
        tweenedActivation: 0,
        tweenedSwitchActivation: 0,
        isPopped: false,
        isCompletelyPopped: false,
        zLayerIndex: 1,
        mouseOverActivation: 0,
        pressActivation: 0,
        targetPopupWidth: 600,
        targetPopupHeight: 600,
        tweenedPopupWidth: 600,
        tweenedPopupHeight: 600,
        targetPopupPositionTop: 0,
        targetPopupPositionLeft: 0,
        tweenedPopupPositionTop: 0,
        tweenedPopupPositionLeft: 0,
        popDuration: 0.4,
        fileName: '',
        files: ['이거','저거'],
    }},
    props:{
        switchOn: { type: Boolean, default: false },
        switchColor: { type: String, default: '#4400ff' },
        poppable: { type: Boolean, default: false },
        contentCentered: { type: Boolean, default: false },
        popupColor: { type: String, default: '#f1f1f1' },
        popupWidth: { type: Number, default: 600 },
        popupHeight: { type: Number, default: 600 },
        linkTo: { type: String, default: '' },
        selectFile: { type: Boolean, default: false },
    },
    computed: {
        buttonStyle(){ return {
            transform: 'scale('+(1+this.tweenedActivation*0.1)+')',
            boxShadow: 
                (this.switchOn?
                    '0px 0px 16px rgba('+hexToRgb(this.switchColor).red+','
                    +hexToRgb(this.switchColor).green+','
                    +hexToRgb(this.switchColor).blue+', 0.6)'
                    :''),
            zIndex: this.zLayerIndex,
        } },
        switchColorFiller(){ return {
            backgroundColor: this.switchColor,
            opacity: this.tweenedSwitchActivation,
        } },
        popupStyle(){ return {
            visibility: 'hidden',
            borderRadius: '30px',
            backgroundColor: this.popupColor,
            width: this.tweenedPopupWidth+'px',
            height: this.tweenedPopupHeight+'px',
            left: this.tweenedPopupPositionLeft+'px',
            top: this.tweenedPopupPositionTop+'px'
        } },
        targetActivation(){
            return this.mouseOverActivation+this.pressActivation;
        },
        switchIndicatorStyle(){ return {
            borderWidth: '6px',
            borderStyle: 'solid',
            borderColor: 'rgba('+hexToRgb(this.switchColor).red+','
                +hexToRgb(this.switchColor).green+','
                +hexToRgb(this.switchColor).blue+', 0.15)',
        }},
    },
    methods:{
        showPopup(){
            let self = this;

            if( this.poppable ){
                self.isPopped = true;

                let overlayElement = self.$refs.overlayElement;
                let popupElement = self.$refs.popupElement;
                document.body.appendChild(overlayElement);
                document.body.appendChild(popupElement);

                becomeNew(self.$refs.buttonElement, self.$refs.popupElement, self.popDuration, true);

                self.mouseOverActivation= 0;
                self.pressActivation= 0;
                self.tweenedActivation= 0;

                setTimeout(function(){
                    self.isCompletelyPopped = true;
                }, self.popDuration*1000 );
            }
        },
        hidePopup(){
            let self = this;
            if(this.isCompletelyPopped){
                self.isCompletelyPopped = false;
                becomeNew( self.$refs.popupElement, self.$refs.buttonElement, self.popDuration);
                setTimeout(function(){
                    self.isPopped = false;
                }, self.popDuration * 1000 );
            }
        },
        mouseOver(){
            let self = this
            if(!detectMobile())
            {
                self.mouseOverActivation = 1;
                self.zLayerIndex = 2;
            }
        },
        mouseLeave(){
            this.mouseOverActivation = 0;
            this.pressActivation = 0;
            this.zLayerIndex = 1;
        },
        touchStart(){
            this.pressActivation = 1.5;
            this.zLayerIndex = 2;
            let self = this;
        },
        touchEnd(){
            this.pressActivation = 0;
        },
        getFile(){
            this.$refs.fileInput.click();
        },
        updatefileName(){
            let filePath = this.$refs.fileInput.value;
            this.files = this.$refs.fileInput.files;
            this.fileName = filePath.substring(filePath.lastIndexOf('\\')+1)
            + (this.files.length>1? ' 등 '+ this.files.length + '개': 
                this.files.length==1?' 1개': '');
            this.$emit('got-file');
        },
    },
    watch: {
        switchOn(newValue) {
            let self = this;
            if(newValue==true){
                gsap.to(self.$data, { 
                    duration: 0.6, 
                    ease: 'power4',
                    tweenedSwitchActivation: 1,
                })
            }
            else{
                gsap.to(self.$data, { 
                    duration: 0.6, 
                    ease: 'power4',
                    tweenedSwitchActivation: 0, 
                })
            }
        },
        targetActivation(newValue) {
            gsap.to(this.$data, { 
                duration: 0.3, 
                ease: 'power4',
                tweenedActivation: newValue 
            })
        },
        targetPopupPositionTop(newValue) {
            gsap.to(this.$data, { 
                duration: 0.6, 
                ease: 'power4',
                tweenedPopupPositionTop: newValue 
            })
        },
        targetPopupPositionLeft(newValue){
            let self= this;
            gsap.to(this.$data, { 
                duration: 0.6, 
                ease: 'power4',
                tweenedPopupPositionLeft: newValue
            })
        },
        targetPopupWidth(newValue) {
            gsap.to(this.$data, { 
                duration: 0.6, 
                ease: 'power4',
                tweenedPopupWidth: newValue 
            })
        },
        targetPopupHeight(newValue){
            let self= this;
            gsap.to(this.$data, { 
                duration: 0.6, 
                ease: 'power4',
                tweenedPopupHeight: newValue
            })
        }
    },
    created: function(){
        let self = this;

        this.targetPopupHeight = Math.min( this.popupHeight, window.innerHeight - 40 ) ;
        this.targetPopupWidth = Math.min( this.popupWidth, window.innerWidth - 40 ) ;
        this.targetPopupPositionTop = ( window.innerHeight - this.targetPopupHeight ) / 2 ;
        this.targetPopupPositionLeft = ( window.innerWidth - this.targetPopupWidth ) / 2 ;

        window.addEventListener('resize', function() {
            self.targetPopupHeight = Math.min( self.popupHeight, window.innerHeight - 40 ) ;
            self.targetPopupWidth = Math.min( self.popupWidth, window.innerWidth - 40 ) ;
            self.targetPopupPositionTop = ( window.innerHeight - self.targetPopupHeight ) / 2 ; 
            self.targetPopupPositionLeft = ( window.innerWidth - self.targetPopupWidth ) / 2 ; 
        });
    },
    mounted: function(){
        let self = this;

        this.$refs.switchIndicator.style.borderRadius
        = (parseInt(getComputedStyle(self.$refs.buttonElement).borderTopLeftRadius) - 0) + 'px';

        try{
            let overlayElement = self.$refs.overlayElement;
            let popupElement = self.$refs.popupElement;
            document.body.appendChild(overlayElement);
            document.body.appendChild(popupElement);
        }
        catch{

        }
    }
};
</script>

<style module>
    .fillParent{
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
    }
    .overfillParent{
        position: absolute;
        top: -3px;
        bottom: -3px;
        left: -3px;
        right: -3px;
    }
    .buttonClass{
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        flex-direction: column;
        overflow: hidden;
        user-select: none;
        overflow: hidden;
        border-radius: 12px;
        min-width: 48px;
        min-height: 48px;
        width: 48px;
        height: 48px;
        box-shadow: 0px 0px 16px rgba(0,0,0,0.1);
        background-color: #f5f5f5;
    }
    .popupClass{
        position: fixed;
        box-sizing: border-box;
        overflow: hidden;
        z-index:100;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        box-shadow: 0px 0px 72px rgba(0,0,0,0.4)
    }
    .overlayClass{
        position: fixed;
        top:-200px;
        bottom:-200px;
        left: -200px;
        right: -200px;
        background-color: #000000;
        z-index: 100;
        opacity: 0;
    }
    .baseHighlight{
        background: radial-gradient( circle at 50% 20%, rgba(255,255,255,0.1), rgba(255,255,255,0) );
        pointer-events: none;
    }
    .mouseHighlight{
        background: #ffffff;
        mix-blend-mode: color-dodge;
    }
    .popupContent{
		display: inline-flex;
        flex-direction: column;
        align-items: center;
        flex-wrap: nowrap;
        width: 100%;
    }
    .contentWrapper{
        display: inline-block;
        margin: auto;
		width: 100%;
    }
    .fileInput{
        visibility: hidden;
        pointer-events: none;
    }
    .filler{
        width: 100%;
        height: 60px;
        background-color: #000000;
        opacity: 0;
    }
    .exitButtonContainer{
        display: flex;
    }
    .exitButton{
        position: absolute;
        z-index: 10 !important;
        right: 6px;
        top: 6px;
        border-radius: 1000px;
        background-image: url(/svg-icons/exit.svg);
    }
    .switchColorFiller{
        z-index: -1;
    }
    .buttonDisplay{
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        flex-direction: column;
    }
    .switchIndicator{
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
    }
</style>