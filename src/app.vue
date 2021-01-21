<template>
  <!-- v-app은 vuetify가 제공하는 helper class style을 사용하기 위해 꼭 필요한 최상단 요소 -->
  <v-app class="app">
    <v-app-bar
      app
      hide-on-scroll
      class="white elevation-4 d-flex justify-center"
      scroll-threshold="200"
    >
      <router-link to="/" class="ma-1">
        <v-btn block class="white" rounded>홈으로 가기</v-btn>
      </router-link>
      <router-link to="/flower/1" class="ma-1">
        <v-btn block class="white" rounded>꽃 페이지로 가기</v-btn>
      </router-link>
      <router-link to="/grass" class="ma-1">
        <v-btn block class="white" rounded>풀 페이지로 가기</v-btn>
      </router-link>
      <router-link to="/tree" class="ma-1">
        <v-btn block class="white" rounded>나무 페이지로 가기</v-btn>
      </router-link>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pt-14 pb-16 view-container">
        <transition name="fade" mode="out-in" appear>
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>

    <v-footer app absolute v-bind="localAttrs" class="elevation-4" padless>
      <v-card tile width="100%" class="grey lighten-5 text-center">
        <v-card-text>
          <v-btn v-for="icon in icons" :key="icon" class="mx-4" icon>
            <v-icon size="24px">
              {{ icon }}
            </v-icon>
          </v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text>
          {{ new Date().getFullYear() }} — <strong>예쁜 제미넴</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      localAttrs: {
        absolute: false,
        fixed: true,
      }, //실험용
      icons: ["mdi-home", "mdi-email", "mdi-calendar", "mdi-delete"], //실험용
    };
  },
  computed: {},
  methods: {},
  watch: {},
  mounted() {},
};
</script>

<style lang="scss">
.app {
  background-color: #f5f5f5 !important;
}
.spacer {
  &-top {
    height: 84px;
  }
  &-bottom {
    height: 180px;
  }
}
.logo {
  border-radius: 12px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.view-container {
  max-width: 1280px;
}
</style>