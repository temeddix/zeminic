<template>
  <div>
    <v-row>
      <v-col class="text-center">
        <img alt="Vue big-image" src="../assets/grass.jpg" class="big-image" />
        <br />
        <br />
        여긴 풀 페이지야
      </v-col>
    </v-row>
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
  created() {
    this.$root.contentTitle = "Grass";
  },
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.big-image {
  border-radius: 12px;
  width: 100%;
}
</style>