<script>
export default {
  extends: require("vuetify/lib").VAppBar, // 이 컴포넌트는 Vuetify 컴포넌트를 확장한 것. template이 없는 이유도 그것.
  data() {
    return {};
  },
  computed: {
    computedTransform() {
      return this.isActive ? 0 : -80;
    },
    computedContentHeight() {
      return 56;
    },
  },
  methods: {},
  props: {},
  watch: {},
  created() {
    document.addEventListener("mousemove", (event) => {
      if (event.clientY <= 10) {
        this.isActive = true; //마우스를 화면 상단에 갖다 대면 활성화되도록
      }
    });
  },
  mounted() {},
  destroyed() {},
};
</script>
<style scoped>
.v-toolbar__content {
  padding: 4px;
}
</style>