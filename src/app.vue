<template>
  <!-- v-app은 vuetify가 제공하는 helper class style을 사용하기 위해 꼭 필요한 최상단 요소 -->
  <v-app ref="app">
    <v-app-bar-elastic class="stuff rounded-pill ma-3 elevation-8" app hide-on-scroll>
      <app-bar-items></app-bar-items>
    </v-app-bar-elastic>

    <v-main class="backdrop">
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

    <v-footer app absolute class="elevation-8" padless>
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
export default {
  components: {
    appBarItems: require("./forms/app-bar-items.vue").default,
  },
  data() {
    return {
      icons: ["mdi-home", "mdi-email", "mdi-calendar", "mdi-delete"],
      contentTitle: "Untitled",
      settings: {
        darkMode: false,
      },
    };
  },
  computed: {
    vContainerStyle() {
      return {
        maxWidth: "1280px",
      };
    },
  },
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
    "settings.darkMode"(newValue) {
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
</style>