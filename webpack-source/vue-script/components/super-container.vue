<template>
	<div v-if='isMobile==false' :class='$style.superContainer'>
		<vue-scroll ref = 'desktopVueScroll' @handle-scroll='whenScrolled'>
			<div :class='$style.contentWrapper' :style='contentWrapperStyle'>
				<div :class='$style.areaForTopBar'></div>
				<slot></slot>
				<div :class='$style.bottomArea'></div>
			</div>
		</vue-scroll>
	</div>
	<div v-else>
		<div :class='$style.contentWrapper' :style='contentWrapperStyle'>
			<div :class='$style.areaForTopBar'></div>
			<slot></slot>
			<div :class='$style.bottomArea'></div>
		</div>
	</div>
</template>

<script>
export default {
	data: function() { return {
		isMobile: detectMobile(),
	}},
	computed:{
		contentWrapperStyle(){ return {
			maxWidth: this.contentMaxWidth + 'px',
		}},
	},
	props:{
		contentMaxWidth: { type: Number, default: 1280 },
	},
	methods: {
		whenScrolled: function(){
			let scrollTop = this.$refs.desktopVueScroll.getPosition().scrollTop;
            this.$root.scrollPosition = scrollTop;
		},
	},
	watch: {/*
		'$root.scrollPosition': function(){
			let self = this;
			let destination = self.$root.scrollPosition;
			if( self.isMobile == false ){
				self.$refs.desktopVueScroll.scrollTo( { y: destination }, 0 );
			}
			else{
				window.scrollTo( 0, destination );
			}
		}*/
	},
	created: function() {
		let self = this;

		window.addEventListener('scroll', function() {
			let scrollTop = document.documentElement.scrollTop;
            self.$root.scrollPosition = scrollTop;
		});

		window.addEventListener('resize', function() {
			self.isMobile= detectMobile();
		});
	},
	mounted: function() {
		let self = this;
	},
};
</script>

<style module>
	.superContainer{
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        flex-direction: column;
		position: absolute;
		top: 0px;
		bottom: 0px;
		left: 0px;
		right: 0px;
		overflow: hidden;
		padding: 0px;
	}
	.areaForTopBar{
		height: 96px;
	}
	.bottomArea{
		height: 96px;
	}
	.contentWrapper{
		display: inline-block;
		width: 100%;
	}
</style>