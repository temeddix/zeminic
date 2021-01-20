<template>
    <div class='componentWrapper' :style='transformer'>
        <div class='baseHighlight fillParent'>
        </div>

        <textarea
        v-if='multiLine'
        class='inputElement'
        ref='inputArea'
        @input='onInput'
        @mouseover='mouseOver'
        @mouseleave='mouseLeave'
        @focus='onFocus'
        @blur='onBlur'>
        </textarea>

        <input
        v-else-if='textHidden' 
        class='inputElement'
        type='password'
        ref='inputArea'
        @input='onInput'
        @mouseover='mouseOver'
        @mouseleave='mouseLeave'
        @focus='onFocus'
        @blur='onBlur'>

        <input
        v-else-if='onlyNumber' 
        class='inputElement'
        type='number'
        ref='inputArea'
        @input='onInput'
        @mouseover='mouseOver'
        @mouseleave='mouseLeave'
        @focus='onFocus'
        @blur='onBlur'>

        <input
        v-else
        class='inputElement'
        type='text'
        ref='inputArea'
        @input='onInput'
        @mouseover='mouseOver'
        @mouseleave='mouseLeave'
        @focus='onFocus'
        @blur='onBlur'>
        
        <div ref='labelText' class='labelText'>
            <p ref='labelTextInside' class='labelTextInside'>
                {{ labelText }}
            </p>
        </div>
        
        <div ref='placeholder' class='placeholderText' :style='placeholderStyle'>
            <p ref='placeholderInside' class='placeholderTextInside'>
                {{ placeholderText }}
            </p>
        </div>

    </div>  
</template>

<script>
const gsap = window.gsap;
const detectMobile = window.detectMobile;

export default {
    data: function() { return {
        tweenedActivation: 0,
        zLayerIndex: 1,
        mouseOverActivation: 0,
        focusActivation: 0,
        isFocused: false,
        isFilled: false,
        isPlaceholderVisible: false,
    }},
    props:{
        labelText: { type: String, default: '' },
        placeholderText: { type: String, default: '' },
        multiLine: { type: Boolean, default: false },
        textHidden: { type: Boolean, default: false },
        onlyNumber: { type: Boolean, default: false },
        value: { type: String, default: '' },
    },
    computed: {
        transformer(){ return {
            transform: 'scale('+(1+this.tweenedActivation*0.1)+')',
            zIndex: this.zLayerIndex,
        } },
        placeholderStyle(){ return {
            visibility: this.isPlaceholderVisible? 'inherit' : 'hidden'
        } },
        targetActivation(){
            return this.mouseOverActivation+this.focusActivation;
        }
    },
    methods:{
        mouseOver(){
            let self = this;
            if(!detectMobile())
            {
                self.mouseOverActivation = 0.5;
                self.zLayerIndex = 2;
            }
        },
        mouseLeave(){
            let self = this;
            
            self.mouseOverActivation = 0;
            if(!self.isFocused){
                self.zLayerIndex = 1;
            }
        },
        onFocus(){
            this.focusActivation = 1;
            this.zLayerIndex = 2;
            this.isFocused = true;
            this.isFilled = true;
            if(this.$refs.inputArea.value==''){
                this.isPlaceholderVisible = true;
            }
        },
        onBlur(){
            let self = this;

            this.focusActivation = 0;
            this.zLayerIndex = 1;
            this.isFocused = false;
            if(this.$refs.inputArea.value==''){
                self.isFilled = false;
            }
            self.isPlaceholderVisible = false;
        },
        onInput(){
            this.$emit('input', this.$refs.inputArea.value);
            if(this.$refs.inputArea.value!=''){
                this.isPlaceholderVisible = false;
            }
            else{
                this.isPlaceholderVisible = true;
            }
        }
    },
    watch: {
        value(newValue) {
            this.$refs.inputArea.value = newValue;
        },
        targetActivation(newValue) {
            gsap.to(this.$data, { 
                duration: 0.3, 
                ease: 'power4',
                tweenedActivation: newValue 
            })
        },
        isFilled(newValue) {
            let self = this;

            if(newValue==true && this.labelText!=''){
                gsap.to(self.$refs.labelText, {
                    ease: 'power1',
                    duration: 0.3,
                    top: '4px',
                });
                gsap.to(self.$refs.labelTextInside, {
                    ease: 'power1',
                    duration: 0.3,
                    fontSize: '9pt',
                    color: '#ffffff',
                    backgroundColor: 'rgba(0,0,0,1)'
                });
            }
            else{
                gsap.to(self.$refs.labelText, {
                    ease: 'power1',
                    duration: 0.3,
                    top: '50%',
                });
                gsap.to(self.$refs.labelTextInside, {
                    ease: 'power1',
                    duration: 0.3,
                    fontSize: '10pt',
                    color: '#999999',
                    backgroundColor: 'rgba(0,0,0,0)'
                });
            }
        }
    },
    created: function(){
    },
    mounted: function(){
    },
};
</script>

<style scoped>
    .componentWrapper{
        display: inline-flex;
        position: relative;
        min-width: 48px;
        min-height: 48px;
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
        border-radius: 12px;
        box-shadow: 0px 0px 16px rgba(0,0,0,0.1);
    }
    .inputElement{
        width: 100%;
        height: 100%;
        min-width: 48px;
        min-height: 48px;
        padding: 14px;
        background-color: rgba(0,0,0,0);
    }
    .placeholderText{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        pointer-events:none;
        z-index: 3;
    }
    .placeholderTextInside{
        color: #999999;
        width: max-content;
    }
    .labelText{
        position: absolute;
        display: flex;
        justify-content: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 1000px;
        color: #999999;
        pointer-events: none;
        width: 100%;
    }
    .labelTextInside{
        padding: 1px 13px 1px;
        border-radius: 1000px;
        color: #999999;
        background-color: rgba(0,0,0,0);
        width: max-content;
    }
    .baseHighlight{
        background: radial-gradient( circle at 50% 20%, rgba(255,255,255,0.1), rgba(255,255,255,0) );
        pointer-events: none;
    }
</style>