<template>
  <!-- v-app은 vuetify가 제공하는 helper class style을 사용하기 위해 꼭 필요한 최상단 요소 -->
  <v-app class="app" ref="app">
    <v-app-bar app hide-on-scroll class="elevation-4" scroll-threshold="200">
      <router-link to="/">
        <v-btn class="secondary ma-1 logo-button"> </v-btn>
      </router-link>
      <v-toolbar-title class="mx-4">
        {{ contentTitle == "" ? "Zeminem" : contentTitle }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="devDialog" scrollable max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on" class="ma-1">
            개발용 패널
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="d-flex">개발용 패널</v-card-title>
          <v-card-text style="height: 600px">
            <router-link to="/">
              <v-btn class="secondary ma-1" rounded @click="devDialog = false"
                >홈으로 가기</v-btn
              >
            </router-link>
            <router-link to="/flower/1">
              <v-btn class="secondary ma-1" rounded @click="devDialog = false"
                >꽃 페이지로 가기</v-btn
              >
            </router-link>
            <router-link to="/grass">
              <v-btn class="secondary ma-1" rounded @click="devDialog = false"
                >풀 페이지로 가기</v-btn
              >
            </router-link>
            <router-link to="/tree">
              <v-btn class="secondary ma-1" rounded @click="devDialog = false"
                >나무 페이지로 가기</v-btn
              >
            </router-link>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="devDialog = false"> 닫기 </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-switch class="ma-1" v-model="darkMode" inset hide-details> </v-switch>
      <!-- 로그인 패널 참고 https://vuetifyjs.com/en/components/dialogs/#form -->
      <v-dialog v-model="loginDialog" scrollable max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="secondary ma-1" v-bind="attrs" v-on="on"> 로그인 </v-btn>
        </template>
        <v-card>
          <v-card-title class="d-flex"></v-card-title>
          <v-card-text class="py-2">
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="loginForm.email"
                    outlined
                    label="이메일"
                    required
                    hide-details="auto"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="loginForm.pw"
                    outlined
                    label="암호"
                    type="password"
                    hide-details="auto"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions class="pb-10 px-9">
            <v-spacer></v-spacer>
            <v-btn text @click="loginDialog = false"> 닫기 </v-btn>
            <v-btn color="secondary" @click="login"> 로그인 </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-main>
      <v-container
        fluid
        class="pt-14 pb-16"
        style="height: 100%"
        :style="vContainerStyle"
      >
        <transition name="fade" mode="out-in" appear>
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>

    <v-footer app absolute class="elevation-4" padless>
      <v-card tile width="100%" class="text-center">
        <v-card-text>
          <v-btn v-for="icon in icons" :key="icon" class="mx-4" icon>
            <v-icon size="24px">
              {{ icon }}
            </v-icon>
          </v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text>
          <strong>{{ new Date().getFullYear() }} — 예쁜 제미넴</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
const axios = window.axios;

export default {
  data() {
    return {
      icons: ["mdi-home", "mdi-email", "mdi-calendar", "mdi-delete"],
      contentTitle: "Untitled",
      devDialog: false,
      loginDialog: false,
      loginForm: {
        email: "",
        pw: "",
      },
      darkMode: true,
    };
  },
  computed: {
    vContainerStyle() {
      return {
        maxWidth: "1280px",
      };
    },
  },
  methods: {
    async login() {
      let response = await axios.post("/ajax/login", this.loginForm);
      console.log(response);
    },
  },
  watch: {
    contentTitle(newValue) {
      // 콘텐츠 제목 변수 contentTitle 변경에 따라 웹 페이지 제목도 변경
      if (newValue == "") {
        document.title = "Zeminem";
      } else {
        document.title = newValue + " - Zeminem";
      }
    },
    darkMode(newValue) {
      if (newValue == true) {
        this.$vuetify.theme.dark = true;
      } else {
        this.$vuetify.theme.dark = false;
      }
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.app {
  background-color: var(--v-background-base);
}
.spacer {
  &-top {
    height: 84px;
  }
  &-bottom {
    height: 180px;
  }
}
.logo-button {
  min-width: 42px !important;
  width: 42px !important;
  height: 42px;
  border-radius: 6px;
  background-image: url("./assets/logo.png");
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>