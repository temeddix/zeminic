import baseVueModel from '../base-vue-model.js';
let artworkPageVueModel = null;

if( document.getElementById('artworkPageVueModel')!=null ){
const artworkPageVueModel = new baseVueModel({
    el: '#artworkPageVueModel',
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

export default artworkPageVueModel;