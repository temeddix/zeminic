import baseVueModel from '../base-vue-model.js';
let mainPageVueModel = null;

if( document.getElementById('mainPageVueModel')!=null ){
mainPageVueModel = new baseVueModel({
    el: '#mainPageVueModel',
    data: function(){ return{
        checkbox: false, //실험용
    }},
    computed: {
    },
    methods: {
    },
    mounted: function(){
    },
});
}

export default mainPageVueModel;