<template>
  <!-- v-app은 vuetify가 제공하는 helper class style을 사용하기 위해 꼭 필요한 최상단 요소 -->
  <v-app ref="app">
    <v-app-bar-elastic
      class="area rounded-pill ma-3 elevation-8"
      app
      hide-on-scroll
    >
      <app-bar-items></app-bar-items>
    </v-app-bar-elastic>

    <v-main class="backdrop">
      <v-container
        fluid
        class="pt-14 pb-16 superContainer"
        style="height: 100%"
        :style="vContainerStyle"
      >
        <transition name="fade" mode="out-in" appear>
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>

    <v-footer app absolute class="elevation-8" padless>
      <v-card tile width="100%" class="area text-center">
        <v-card-text>
          <v-btn class="mx-4" fab text>
            <v-icon size="24px"> mdi-home </v-icon>
          </v-btn>
          <v-btn class="mx-4" fab text>
            <v-icon size="24px"> mdi-email </v-icon>
          </v-btn>
          <v-btn class="mx-4" fab text>
            <v-icon size="24px"> mdi-calendar </v-icon>
          </v-btn>
          <v-btn class="mx-4" fab text>
            <v-icon size="24px"> mdi-delete </v-icon>
          </v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="text-body-2">
          {{ new Date().getFullYear() }} — 예쁜 제미넴
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
/* global cookies cssVarsPonyfill */

export default {
  data() {
    return {
      contentTitle: "Untitled",
      settings: {
        brightMode: false,
      },
    };
  },
  computed: {},
  methods: {},
  watch: {
    contentTitle(newValue) {
      // 콘텐츠 제목 변수 contentTitle 변경에 따라 웹 페이지 제목도 변경
      if (newValue == "") {
        document.title = "Zeminem";
      } else {
        document.title = newValue + " - Zeminem";
      }
    },
    settings: {
      // This will let Vue know to look inside the array
      deep: true,
      handler(newValue, oldValue) {
        this.$vuetify.theme.dark = !newValue.brightMode;
        cookies.set("settings", newValue, { expires: 365 });
        this.$setThemeTextColor();

        // 이건 IE11에서 CSS var가 가능하게 해 주는 Ponyfill(호환성 확보)
        //CSS var가 봐뀌어도 IE11은 탐지를 못 함. 그래서 직접 값을 변경해주는 라이브러리임.
        // https://jhildenbiddle.github.io/css-vars-ponyfill/#/
        cssVarsPonyfill({
          // Targets
          rootElement: document,
          shadowDOM: true,

          // Sources
          include: "link[rel=stylesheet],style",
          exclude: "",
          variables: {},

          // Options
          onlyLegacy: true,
          preserveStatic: true,
          preserveVars: false,
          silent: false,
          updateDOM: true,
          updateURLs: false,
          watch: false,
        });
      },
    },
  },
  created() {
    //저장된 쿠키를 읽어서 반영
    Object.assign(this.settings, cookies.getJSON("settings"));
    this.$setThemeTextColor();
  },
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.spacer {
  &-top {
    height: 84px;
  }
  &-bottom {
    height: 180px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.superContainer {
  max-width: 1280px;
}
</style>