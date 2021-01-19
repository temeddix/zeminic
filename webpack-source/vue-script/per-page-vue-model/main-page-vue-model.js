import baseVueModel from '../base-vue-model.js';
let mainPageVueModel = null;

if( document.getElementById('mainPageVueModel')!=null ){
mainPageVueModel = new baseVueModel({
    el: '#mainPageVueModel',
    data: function(){ return{
        searchText: '',
        lastSearchText: '',
        artworkList: [],
        newItemName : '',
        newItemText : '',
        submitArtworkInput: {
            title: '',
            price: '',
            content: '',
            fileobj : [ null ],
        },
        list: {
            upload:[],
            purchase:[]
        },
        isSmallScreen: false,
    }},
    computed:
    {
        searchButtonStyle(){ return {
            backgroundImage: this.noSearchYesList? 
            'url("/svg-icons/stack.svg")':''
        } },
        noSearchYesList(){
            return (this.searchText==this.lastSearchText || this.searchText=='')? true: false;
        }
    },
    methods: {
        updateArtworkList: function(){
            if(this.noSearchYesList==false){
                this.searchArtworks(this.searchText);
            }
            else{
                this.getAllArtworks();
                this.$root.showElasticAlert('searchButton', '모든 작품을 나열할게요');
            }
        },
        getAllArtworks: function()
        {
            let self = this;

            self.searchText = '';
            self.lastSearchText = '';
            self.artworkList=[];

            axios.post('/ajax-tunnel/list-artwork',
            {})
            .then( response => {
                if ( response.data.isOk == true ) {
                    setTimeout(function(){
                        self.artworkList = response.data.artworkList;
                    }, 600);
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        searchArtworks: function (searchText)
        {
            let self = this;

            self.lastSearchText = searchText;
            self.artworkList=[];

            axios
            .post( '/ajax-tunnel/search-artwork', {keyword: searchText} )
            .then(response => {
                setTimeout(function(){
                    self.artworkList = response.data.data;
                }, 600);
            })
        },
        shuffleItems: function(){
            this.$root.shuffleThose();
        },
        changeToggleTest: function(){
            this.$root.changeToggleTest();
        },
        itemBeforeEnter: function (element) {
            gsap.set(element, {
                opacity: 0,
                transform: 'scale(0.8)',
                transformOrigin: '50% 50%'
            })
        },
        itemEnter: function (element, done) {
            gsap.to(element, {
                ease: 'power4',
                delay: element.dataset.index * 0.08,
                duration: 0.4,
                opacity: 1,
                transform: 'scale(1)',
                onComplete: done,
                clearProps: 'all',
            });
        },
        itemLeave: function (element, done) {
            gsap.to(element, {
                ease: 'power4',
                delay: element.dataset.index * 0.02,
                duration: 0.4,
                opacity: 0,
                transform: 'scale(0.8)',
                onComplete: done
            });
        },
        updateFileobj: function(){
            let self = this;

            this.submitArtworkInput.fileobj = this.$refs.fileSelector.files;
            var fileReader = new FileReader();

            fileReader.onload = function () {
                self.$refs.previewImage.src = fileReader.result;
            }
            fileReader.readAsDataURL(self.submitArtworkInput.fileobj[0]);
        },
        submitArtwork: function(){
            let self = this;

            let formData = new FormData();

            formData.set('title', self.submitArtworkInput.title);
            formData.set('price', self.submitArtworkInput.price);
            formData.set('content', self.submitArtworkInput.content);

            for(let i=0; i<self.submitArtworkInput.fileobj.length; i++){
                formData.append('fileobj', self.submitArtworkInput.fileobj[i]);
            }

            console.log(formData);

            axios.post('/ajax-tunnel/artwork-post', formData)
            .then(function(response){
                console.log(response);
                if(response.data.isOk==true){
                    self.$root.$emit('close-create-popup');
    
                    setTimeout(function(){
                        self.getAllArtworks();
                    }, 1000)
                }
                else{
                    self.$root.showElasticAlert('artworkSubmitButton', response.data.msg);
                }
            })
            .catch(function(error){
            })
        },
    },
    created: function(){
        let self = this;
        
        //self.getAllArtworks();
        self.$root.$on('close-create-popup', function(){
            self.$refs.createButton.hidePopup();
        });

        if(window.innerWidth<442){
            self.isSmallScreen = true;
        }
        else{
            self.isSmallScreen = false;
        }

        window.addEventListener('resize', function(){
            if(window.innerWidth<442){
                self.isSmallScreen = true;
            }
            else{
                self.isSmallScreen = false;
            }
        })
    },
    mounted: function(){
    },
});
}

export default mainPageVueModel;