<template>
  <v-app class="app">
    <!-- v-app은 vuetify가 제공하는 helper class style을 사용하기 위해 꼭 필요한 최상단 요소 -->
    <v-container class="pa-8">
      <v-row class="spacer-top"> </v-row>

      <transition name="fade" mode='out-in' appear>
        <router-view></router-view>
      </transition>

      <v-row class="spacer-bottom"> </v-row>

      <v-footer v-bind="localAttrs" class="elevation-15" padless>
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
    </v-container>
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
  background-color: #f2f2f2 !important;
}
.spacer {
  &-top {
    height: 40px;
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
</style>