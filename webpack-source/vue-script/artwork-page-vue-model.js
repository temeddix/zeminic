import baseVueModel from './base-vue-model.js';
let artworkPageVueModel = null;

if( document.getElementById('artworkPageVueModel')!=null ){
const artworkPageVueModel = new baseVueModel({
    el: '#artworkPageVueModel',
    data: function(){ return{
        birthdayInput: '',
        twoNumbersInput: '',
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
    },
    methods: {/*
        purchaseArtworkFront(artworkId){
            let self = this;

            simplePay.payFront(
                artworkId,
                'card',
                function(){
                },
                function(messageFromServer){
                    self.$root.showElasticAlert('purchaseButton', messageFromServer);
                }
            )
        },*/
        purchaseArtworkBack(artworkId, cardIndex){
            let self = this;
        
            axios.post('/ajax-tunnel/pay-card-alias',
            {
                artworkId: artworkId,
                cardAlias: self.$root.userInfo.paymentMethod[cardIndex].alias
            })
            .then( function(response) {
                if( response.data.isOk == true){
                    self.closePurchasePopupsAndReload(cardIndex);
                    setTimeout(function(){
                        self.$root.showElasticAlert('purchasePopupButton', response.data.msg);
                    }, 400)
                } else {
                    self.$root.showElasticAlert('purchaseBackButton', response.data.msg);
                }
            })
            .catch( function(error) {
                alert(error);
            });
        },
        deleteArtwork(artworkId){
            let self = this;

            axios.post('/ajax-tunnel/delete-post', {artworkId: artworkId})
            .then(function(response){
                console.log(response)
                if(response.data.isOk){
                    window.location.href = '/';
                }
                else{
                    self.$root.showElasticAlert('deleteArtworkButton', response.data.msg);
                }
            })
            .catch(error => alert(error));  
        },
        closePurchasePopupsAndReload(cardIndex){
            let self = this;
            self.$refs.purchaseFinalPopup[cardIndex].hidePopup();
            setTimeout(function(){
                self.$refs.purchasePopup.hidePopup();
                self.$root.getSignStatus();
            }, 400)
        },
    },
    created: function(){
        let self = this;
    }
});
}

export default artworkPageVueModel;