@@ -1,204 +0,0 @@
<template>
  <v-card class="backdrop">
    <v-card-title class="text-h4 justify-center">개발용 패널</v-card-title>
    <v-card-text>
      <v-card class="area pa-4 my-2">
        <router-link to="/">
          <v-btn
            class="stuff ma-1 testt"
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
      <v-card class="area pa-4 my-2">
        <v-dialog-elastic v-model="ofDialog" width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="stuff ma-1" v-bind="attrs" v-on="on">
              Open Overflowed Dialog
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Use Google's location service?</span>
            </v-card-title>
            <v-card-text>
              <p>https://vuetifyjs.com/en/components/dialogs/#overflowed</p>
              <v-card class="backdrop" height="2500"></v-card>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false">
                Disagree
              </v-btn>
              <v-btn color="green darken-1" text @click="dialog = false">
                Agree
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog-elastic>
      </v-card>
      <v-card class="area pa-4 my-2 text-body-1">
        <p class="ma-0">document.title == {{ documentTitle }}</p>
        <p class="ma-0">location.pathname == {{ locationPathname }}</p>
      </v-card>
      <v-card class="area pa-4 my-2" height="1200"> </v-card>
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
      ofDialog: false,
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
.testt{
  padding: 60px;
}
</style>