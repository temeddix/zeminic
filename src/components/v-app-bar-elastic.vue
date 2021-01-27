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
      return 56
    },
  },
  methods: {},
  props: {},
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
};
</script>
<style scoped>
.v-toolbar__content{
  padding: 4px;
}
</style>