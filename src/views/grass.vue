<template>
  <div>
    <v-row>
      <v-col class="text-center">
        <img alt="Vue big-image
      " src="../assets/grass.jpg" class="big-image
      " />
        <br />
        <br />
        여긴 풀 페이지야
      </v-col>
    </v-row>

    <v-divider class="ma-8"> </v-divider>

    <v-row>
      <v-col>
        <router-link to="/">
          <v-btn block class="white" rounded>홈으로 가기</v-btn>
        </router-link>
      </v-col>
      <v-col>
        <router-link to="/flower/1">
          <v-btn block class="white" rounded>꽃 페이지로 가기</v-btn>
        </router-link>
      </v-col>
      <v-col>
        <router-link to="/grass">
          <v-btn block class="white" rounded>풀 페이지로 가기</v-btn>
        </router-link>
      </v-col>
      <v-col>
        <router-link to="/tree">
          <v-btn block class="white" rounded
            >나무 페이지로 가기</v-btn
          >
        </router-link>
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
  mounted() {},
};
</script>

<style lang="scss" scoped>
.big-image {
  border-radius: 12px;
  width: 100%;
}
</style>