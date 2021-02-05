<template>
  <div>
    <v-row>
      <v-col class="text-center">
        <img alt="Vue big-image" src="../assets/flower.jpg" class="big-image" />
        <br />
        <br />
        <br />
        <p class="text-h4">{{ this.$route.params.flowerId }}번째 꽃</p>
        <p>
          주소 바뀌는 걸 봐봐 <br />페이지 불러오기(Reload) 없이도 주소가
          바뀌지? <br />이게 vue-router를 이용한 프론트엔드 라우팅이야
        </p>
        <br />
        <v-pagination v-model="flowerId" :length="8" circle></v-pagination>
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
      flowerId: parseInt(this.$route.params.flowerId), //실험용
    };
  },
  computed: {},
  methods: {},
  watch: {
    flowerId(newValue) {
      this.$router.push({ path: "", params: { flowerId: newValue } });
    },
  },
  created() {
    this.$root.contentTitle = "꽃";
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