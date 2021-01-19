import baseVueModel from '../base-vue-model.js';
let accountPageVueModel = null;

if( document.getElementById('accountPageVueModel')!=null ){
const accountPageVueModel = new baseVueModel({
    el: '#accountPageVueModel',
    data: function(){ return{
    }},
    computed: {
    },
    methods: {
    },
    mounted: function(){
    },
});
}

export default accountPageVueModel;