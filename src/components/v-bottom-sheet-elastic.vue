@@ -1,204 +0,0 @@
<script>
/* global deepmerge*/

export default {
  extends: require("vuetify/lib").VBottomSheet,
  data() {
    return {
      hasTimeTravelled: false,
    };
  },
  computed: {},
  methods: {
    addHistory() {
      let original = history.state;
      let addition = {
        popupActivation: {
          [this.uid]: this.value,
        },
      };
      let state = deepmerge(original, addition);
      history.pushState(state, null, null);
    },
  },
  props: {
    inset: {
      type: [Boolean],
      default: true,
    },
  },
  watch: {
    async value(newValue, oldValue) {
      if (this.hasTimeTravelled == false) {
        this.addHistory();
      } else {
        this.hasTimeTravelled = false;
      }
    },
  },
  created() {
    window.addEventListener("popstate", (event) => {
      try {
        //history.state에 뭔가 정보가 있을 때
        //key는 있지만 value가 null인 경우도 고려함
        let restoreValue = event.state.popupActivation[this.uid] || false;
        if (restoreValue != this.value) {
          this.hasTimeTravelled = true;
          this.$emit("input", restoreValue);
        }
      } catch (error) {
        //history.state에 정보가 없을 때
        if (this.value == true) {
          this.hasTimeTravelled = true;
          this.$emit("input", false);
        }
      }
    });
  },
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
</style>