<template>
  <div class="view-root">
    <p class="text-h1">404</p>
    <p class="text-h4">이런! 그런 페이지는 없어요</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkbox: true, //실험용
      sheet: false, //실험용
    };
  },
  computed: {},
  methods: {},
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.big-image {
  border-radius: 12px;
  width: 100%;
}
.view-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>