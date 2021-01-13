import baseVueModel from './base-vue-model.js';
let accountPageVueModel = null;

if( document.getElementById('accountPageVueModel')!=null ){
const accountPageVueModel = new baseVueModel({
    el: '#accountPageVueModel',
    data: function(){ return{
        list: {
            upload:[],
            purchase:[],
        },
        cardInfoInput: {
            alias: '',
            cardNumber: '',
            pwd2digit: '',
            expireDate: '',
            birth: '',
        },
    }},
    computed:
    {
        uploadList: function(){ return this.list.upload },
        purchaseList: function(){ return this.list.purchase },
    },
    methods: {
        listArtworks: function(){
            axios.post('/ajax-tunnel/list-my-artwork')
            .then(response => this.list.upload = response.data.myArtworkList);
        },
        listPurchased: function(){
            axios.post('/ajax-tunnel/list-purchased')
            .then(response => this.list.purchase = response.data.purchasedList);
        },
        addCard: function(){
            let self = this;
            axios.post('/ajax-tunnel/create-payment-method',{
                alias: self.cardInfoInput.alias,
                cardNumber: self.cardInfoInput.cardNumber,
                pwd2digit: self.cardInfoInput.pwd2digit,
                expireDate: self.cardInfoInput.expireDate,
                birth: self.cardInfoInput.birth,
            })
            .then( function(response) {
                if( response.data.isOk == true ){
                    self.$refs.addCardPopup.hidePopup();
                    setTimeout(function(){
                        self.$root.showElasticAlert('purchaseMethods', response.data.msg);
                        self.$root.getSignStatus();
                    }, 400);
                }
                else{
                    self.$root.showElasticAlert('addCardSubmitButton', response.data.msg);
                }
            }).catch(function (error) {
                alert(error.response.data.msg);
            });
        },
        deleteCard: function(cardAlias, cardIndex){
            let self = this;
            console.log(cardAlias);
            axios.post('/ajax-tunnel/delete-payment-method', {
                alias: cardAlias
            })
            .then(function (response) {
                if(response.data.isOk == true){
                    self.$refs.deleteCardPopup[cardIndex].hidePopup();
                    setTimeout(function(){
                        self.$refs.infoCardPopup[cardIndex].hidePopup();
                    }, 400)
                    setTimeout(function(){
                        self.$root.showElasticAlert('purchaseMethods', response.data.msg);
                        self.$root.getSignStatus();
                    }, 800)
                }
                else{
                    alert(response.data.msg);
                }
            }).catch(function (error) {
                alert(error.response.data.msg);
            });
        },
    },
    created: function(){
        this.listArtworks();
        this.listPurchased();
    }
});
}

export default accountPageVueModel;