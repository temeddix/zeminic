<script>
export default {
  extends: require("vuetify/lib").VDialog, // 이 컴포넌트는 Vuetify의 v-dialog 컴포넌트를 확장한 것
  data() {
    return {};
  },
  computed: {},
  methods: {},
  props: {
    maxWidth: {
      type: String,
      default: "600px",
    },
    transitionDuration: {
      type: Number,
      default: 0.4,
    },
    transition: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    async value(newValue, oldValue) {
      let activator = await this.$children[0].$el; //HTML element
      let dialog = await this.$children[1].$el.children[0]; //HTML element
      if (newValue == true) {
        window.becomeNew(activator, dialog, this.transitionDuration);
      } else {
        window.becomeNew(dialog, activator, this.transitionDuration);
      }
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
};
</script>