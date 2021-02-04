@@ -1,204 +0,0 @@
<template>
  <v-card class="backdrop">
    <v-card-title class="text-h4 justify-center my-2">개발용 패널</v-card-title>
    <v-card-text style="height: 600px">
      <v-card class="area pa-4 ma-2">
        <router-link to="/">
          <v-btn
            class="stuff ma-1"
            @click="$parent.$parent.$parent.devDialog = false"
            >홈으로 가기</v-btn
          >
        </router-link>
        <router-link to="/flower/1">
          <v-btn
            class="stuff ma-1"
            @click="$parent.$parent.$parent.devDialog = false"
            >꽃 페이지로 가기</v-btn
          >
        </router-link>
        <router-link to="/grass">
          <v-btn
            class="stuff ma-1"
            @click="$parent.$parent.$parent.devDialog = false"
            >풀 페이지로 가기</v-btn
          >
        </router-link>
        <router-link to="/tree">
          <v-btn
            class="stuff ma-1"
            @click="$parent.$parent.$parent.devDialog = false"
            >나무 페이지로 가기</v-btn
          >
        </router-link>
      </v-card>
      <v-card class="area pa-4 ma-2 text-body-1">
        <p class="ma-0">document.title == {{ documentTitle }}</p>
        <p class="ma-0">location.pathname == {{ locationPathname }}</p>
      </v-card>
      <v-card class="area pa-4 ma-2" height="800">
      </v-card>
    </v-card-text>
    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script>
/* global */

export default {
  data() {
    return {
      documentTitle: "",
      locationPathname: "",
    };
  },
  computed: {},
  methods: {},
  watch: {},
  created() {
    setInterval(() => {
      this.documentTitle = document.title;
      this.locationPathname = location.pathname;
    }, 100);
  },
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
</style>