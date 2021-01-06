import baseVueModel from './base-vue-model.js';
let testPageVueModel = null;

if( document.getElementById('testPageVueModel')!=null ){
const testPageVueModel = new baseVueModel({
    el: '#testPageVueModel',
    data: function(){ return{
        testA:'',
        testB:'',
        testC:'',
        testD:'',
        testE:'',
        testF:'',
        testG:'',
        testH:'',
        testI:'',
        testJ:'',
        testK:'',
        testL:'',
        testM:'',
        testN:false,
    }},
    computed:
    {
        windowInnerWidth: function(){
            return window.innerWidth;
        }
    },
    watch:{
        'window.innerWidth': function(newValue){
            console.log('창 크기 바뀜!');
        }
    },
    methods: {
    },
    created: function(){
    },
    mounted: function(){
    },
});
}

export default testPageVueModel;