<script>
/*global becomeNew vue*/

export default {
  extends: require("vuetify/lib").VDialog, // 이 컴포넌트는 Vuetify 컴포넌트를 확장한 것. template이 없는 이유도 그것.
  data() {
    return {
      anotherOverlay: null,
    };
  },
  computed: {},
  methods: {},
  props: {
    maxWidth: {
      type: [String, Number],
      default: "600px",
    },
    transitionDuration: {
      type: [String, Number],
      default: 0.3,
    },
    transition: {
      type: Boolean,
      default: false,
    },
    hideOverlay: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    async value(newValue, oldValue) {
      let activator = await this.$children[0].$el; //HTML element
      let dialog = await this.$children[1].$el.children[0]; //HTML element

      if (newValue == true) {
        becomeNew(activator, dialog, this.transitionDuration);
        document
          .getElementById("app")
          .insertBefore(
            this.anotherOverlay.$el,
            document.getElementById("app").firstChild
          );
          console.log('켜짐')
        setTimeout(() => {
          this.anotherOverlay.value = true;
        }, this.transitionDuration * 1000);
      } else {
        becomeNew(dialog, activator, this.transitionDuration);
        setTimeout(() => {
          this.anotherOverlay.value = false;
        }, this.transitionDuration * 1000);
        setTimeout(() => {
          try {
            this.anotherOverlay.$el.remove();
          } catch (error) {
            this.anotherOverlay.$el.parentNode.removeChild(self.$el); //IE는 element.remove() 지원을 안 하기 때문에 추가
          }
        }, this.transitionDuration * 1000 + 400);
      }
    },
  },
  created() {},
  mounted() {
    let componentClass = vue.extend(require("vuetify/lib").VOverlay);
    this.anotherOverlay = new componentClass({
      propsData: {
        value: false,
        zIndex: 201,
      },
    });
    this.anotherOverlay.$mount();
    document
      .getElementById("app")
      .insertBefore(
        this.anotherOverlay.$el,
        document.getElementById("app").firstChild
      );
  },
  destroyed() {},
};
</script>