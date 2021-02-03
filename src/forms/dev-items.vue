@@ -1,204 +0,0 @@
<template>
  <v-card>
    <v-card-title class="text-h4 justify-center my-2">개발용 패널</v-card-title>
    <v-card-text style="height: 600px">
      <router-link to="/">
        <v-btn class="stuff ma-1" @click="$parent.$parent.$parent.devDialog = false"
          >홈으로 가기</v-btn
        >
      </router-link>
      <router-link to="/flower/1">
        <v-btn class="stuff ma-1" @click="$parent.$parent.$parent.devDialog = false"
          >꽃 페이지로 가기</v-btn
        >
      </router-link>
      <router-link to="/grass">
        <v-btn class="stuff ma-1" @click="$parent.$parent.$parent.devDialog = false"
          >풀 페이지로 가기</v-btn
        >
      </router-link>
      <router-link to="/tree">
        <v-btn class="stuff ma-1" @click="$parent.$parent.$parent.devDialog = false"
          >나무 페이지로 가기</v-btn
        >
      </router-link>
    </v-card-text>
    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script>
/* global */

export default {
  data() {
    return {};
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
</style>