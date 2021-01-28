@@ -1,204 +0,0 @@
<template>
  <div class="d-flex wrapper align-center">
    <router-link to="/">
      <v-btn
        class="secondary ma-1 logo-button"
        fab
        small
        v-alert-elastic="'안녕하세요! 여기는 오픈 웹툰 플랫폼 제미넴입니다!'"
      >
      </v-btn>
    </router-link>
    <v-toolbar-title class="mx-2">
      {{ $root.contentTitle == "" ? "Zeminem" : $root.contentTitle }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-dialog-elastic v-model="devDialog" scrollable max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          text
          fab
          small
          v-bind="attrs"
          v-on="on"
          class="ma-1"
          v-alert-elastic="'개발용 패널'"
        >
          <v-icon>mdi-dev-to</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>개발용 패널</v-card-title>
        <v-card-text style="height: 600px">
          <router-link to="/">
            <v-btn class="secondary ma-1" @click="devDialog = false"
              >홈으로 가기</v-btn
            >
          </router-link>
          <router-link to="/flower/1">
            <v-btn class="secondary ma-1" @click="devDialog = false"
              >꽃 페이지로 가기</v-btn
            >
          </router-link>
          <router-link to="/grass">
            <v-btn class="secondary ma-1" @click="devDialog = false"
              >풀 페이지로 가기</v-btn
            >
          </router-link>
          <router-link to="/tree">
            <v-btn class="secondary ma-1" @click="devDialog = false"
              >나무 페이지로 가기</v-btn
            >
          </router-link>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="devDialog = false"> 닫기 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog-elastic>
    <v-dialog-elastic v-model="settingsDialog" scrollable max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          small
          v-bind="attrs"
          v-on="on"
          class="secondary ma-1"
          v-alert-elastic="'설정'"
        >
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>설정</v-card-title>
        <v-card-text style="height: 600px">
          <v-switch
            class="ma-1"
            v-model="$root.settings.darkMode"
            inset
            label="어두운 모드"
          >
          </v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="devDialog = false"> 닫기 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog-elastic>
    <!-- 로그인 패널 참고 https://vuetifyjs.com/en/components/dialogs/#form -->
    <v-dialog-elastic v-model="loginDialog" scrollable>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          small
          class="secondary ma-1"
          v-bind="attrs"
          v-on="on"
          v-alert-elastic="'로그인과 로그아웃 등 회원 관련 기능'"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>로그인하세요!</v-card-title>
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
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-dialog-elastic v-model="signupDialog" scrollable max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn text v-bind="attrs" v-on="on"> 회원가입 </v-btn>
            </template>
            <v-card>
              <v-card-title class="d-flex pt-8 px-9"
                >회원가입을 하시겠어요?
              </v-card-title>
              <v-card-text class="py-2">
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="signinForm.email"
                        label="이메일"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="signinForm.nickname"
                        label="별명"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="signinForm.pw"
                        label="암호"
                        type="password"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row> </v-container
              ></v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="signupDialog = false"> 취소 </v-btn>
                <v-btn color="secondary" @click="signup"> 회원가입 </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog-elastic>
          <v-spacer></v-spacer>
          <v-btn text @click="loginDialog = false"> 닫기 </v-btn>
          <v-btn color="secondary" @click="login"> 로그인 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog-elastic>
  </div>
</template>

<script>
/* global axios */

export default {
  data() {
    return {
      devDialog: false,
      settingsDialog: false,
      loginDialog: false,
      signupDialog: false,
      loginForm: {
        email: "",
        pw: "",
      },
      signinForm: {
        email: "",
        nickname: "",
        pw: "",
      },
    };
  },
  computed: {},
  methods: {
    async login() {
      let response = await axios.post("/ajax/login", this.loginForm);
      console.log(response);
    },
    async signup() {
      let response = await axios.post("/ajax/login", this.signinForm);
      console.log(response);
    },
  },
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