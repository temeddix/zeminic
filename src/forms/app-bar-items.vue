@@ -1,204 +0,0 @@
<template>
  <div class="d-flex wrapper align-center">
    <router-link to="/">
      <v-btn
        class="stuff ma-1 logo-button"
        fab
        v-alert-elastic="'안녕하세요! 여기는 오픈 웹툰 플랫폼 제미넴입니다!'"
      >
      </v-btn>
    </router-link>
    <v-toolbar-title class="mx-2">
      {{ $root.contentTitle == "" ? "Zeminem" : $root.contentTitle }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-dialog-elastic v-model="$root.popups.devDialog" scrollable max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          text
          fab
          v-bind="attrs"
          v-on="on"
          class="ma-1"
          v-alert-elastic="'개발용 패널'"
        >
          <v-icon>mdi-dev-to</v-icon>
        </v-btn>
      </template>
      <dev-items></dev-items>
    </v-dialog-elastic>
    <v-dialog-elastic v-model="$root.popups.settingsDialog" scrollable max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          v-bind="attrs"
          v-on="on"
          class="stuff ma-1"
          v-alert-elastic="'설정'"
        >
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
      <settings-inputs></settings-inputs>
    </v-dialog-elastic>
    <!-- 로그인 패널 참고 https://vuetifyjs.com/en/components/dialogs/#form -->
    <v-dialog-elastic v-model="$root.popups.loginDialog" scrollable>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          class="stuff ma-1"
          v-bind="attrs"
          v-on="on"
          v-alert-elastic="'회원 정보'"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <login-inputs></login-inputs>
    </v-dialog-elastic>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
.wrapper {
  width: 100%;
}
.logo-button {
  background-image: url("../assets/logo.png");
}
</style>