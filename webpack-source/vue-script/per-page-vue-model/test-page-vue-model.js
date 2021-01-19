import baseVueModel from '../base-vue-model.js';
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
        openNotification() {
          this.$vs.notification({
            title: 'Documentation Vuesax 4.0+',
            text: `These documents refer to the latest version of vuesax (4.0+),
            to see the documents of the previous versions you can do it here 👉 Vuesax3.x`
          })
        }
    },
    created: function(){
    },
    mounted: function(){
    },
});
}

export default testPageVueModel;