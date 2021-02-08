@@ -1,204 +0,0 @@
<template>
  <v-card class="backdrop">
    <template v-if="!$root.isLoggedin">
      <v-card-title class="text-h4 justify-center">로그인</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                v-model="loginForm.email"
                label="이메일"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="loginForm.pw"
                label="암호"
                type="password"
                required
                @keyup.enter="login()"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-bottom-sheet-elastic v-model="signupSheet">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="px-5" v-bind="attrs" v-on="on" text>회원가입</v-btn>
          </template>
          <signup-inputs></signup-inputs>
        </v-bottom-sheet-elastic>
        <v-spacer></v-spacer>
        <v-btn ref="loginButton" class="stuff px-5" @click="login()">로그인</v-btn>
      </v-card-actions>
    </template>
    <template v-else>
      <v-card-title class="text-h4 justify-center">회원 정보</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <p class="text-subtitle-1 text-center ma-0">
                {{ $root.userInfo.nickname }}
              </p>
              <p class="text-body-1 text-center">
                {{ $root.userInfo.email }}
              </p></v-col
            >
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="pb-4">
        <router-link to="/account">
          <v-btn class="px-5" text @click="closeDialog()"> 계정 페이지 </v-btn>
        </router-link>
        <v-spacer></v-spacer>
        <v-btn ref="logoutButton" class="stuff px-5" @click="logout()">
          로그아웃
        </v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
/* global axios */

export default {
  data() {
    return {
      loginForm: {
        email: "",
        pw: "",
      },
      signupSheet: false,
    };
  },
  computed: {},
  methods: {
    closeDialog(){
        this.$parent.$parent.$emit("input", false);
    },
    async login() {
      let response = await axios.post("/ajax/login", this.loginForm);
      if (response.data.isOk == true) {
        this.$root.getUserInfo();
        this.closeDialog();
        this.$alertElastic("accountButton", response.data.msg);
      } else {
        this.$alertElastic(this.$refs.loginButton.$el, response.data.msg);
      }
    },
    async logout() {
      let response = await axios.post("/ajax/logout");
      console.log("현재 백엔드 로그아웃 기능에 문제가 있는 것 같음(로그아웃이 안 됨)");
      console.log(response);
      if (response.data.isOk == true) {
        this.$root.getUserInfo();
        this.closeDialog();
        this.$alertElastic("accountButton", response.data.msg);
      } else {
        this.$alertElastic(this.$refs.logoutButton.$el, response.data.msg);
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
</style>