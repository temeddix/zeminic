<template>
  <!-- v-app은 vuetify가 제공하는 helper class style을 사용하기 위해 꼭 필요한 최상단 요소 -->
  <v-app class="app" ref="app">
    <top-bar app> </top-bar>

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
// const axios = window.axios;

export default {
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>