<template>
  <v-app class="app">
    <!-- vuetify가 제공하는 helper class style을 사용하기 위해 필요 -->
    <v-container class="mb-6">
      <v-row class="spacer-top"> </v-row>

      <v-row>
        <v-col class="text-center">
          <img alt="Vue logo" src="./assets/logo.png" class="logo" />
          <br />
          <br />
          <hello-world msg="Welcome to Your Vue.js App" />
        </v-col>
      </v-row>

      <v-divider class="ma-8"> </v-divider>

      <v-row>
        <v-col>
          <a href="/flower">
            <v-btn block class="white rounded-lg elevation-4"
              >꽃 페이지로 가기</v-btn
            >
          </a>
        </v-col>
        <v-col>
          <a href="/grass">
            <v-btn block class="white rounded-lg elevation-4"
              >풀 페이지로 가기</v-btn
            >
          </a>
        </v-col>
        <v-col>
          <a href="/tree">
            <v-btn block class="white rounded-lg elevation-4"
              >나무 페이지로 가기</v-btn
            >
          </a>
        </v-col>
      </v-row>

      <v-divider class="ma-8"> </v-divider>

      <v-row>
        <v-col>
          <v-expansion-panels flat class="rounded-lg">
            <v-expansion-panel
              class="elevation-4"
              v-for="(item, i) in 5"
              :key="i"
            >
              <v-expansion-panel-header> Item </v-expansion-panel-header>
              <v-expansion-panel-content>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <v-divider class="ma-8"> </v-divider>

      <v-row>
        <v-col class="d-flex justify-center">
          <v-checkbox
            v-model="checkbox"
            :label="'이건 체크박스다 체크박스'"
          ></v-checkbox>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="d-flex justify-center">
          <v-bottom-sheet v-model="sheet">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="grey darken-4 elevation-4 rounded-lg"
                dark
                v-bind="attrs"
                v-on="on"
              >
                Bottom sheet 열기
              </v-btn>
            </template>
            <v-sheet class="text-center pa-4">
              <v-btn
                class="ma-2 red lighten-2 white--text"
                text
                @click="sheet = !sheet"
              >
                close
              </v-btn>
              <div class="ma-2">
                This is a bottom sheet This is a bottom sheet This is a bottom
                sheet This is a bottom sheet This is a bottom sheet This is a
                bottom sheet This is a bottom sheet This is a bottom sheet This
                is a bottom sheet This is a bottom sheet This is a bottom sheet
                This is a bottom sheet This is a bottom sheet This is a bottom
                sheet This is a bottom sheet This is a bottom sheet This is a
                bottom sheet This is a bottom sheet This is a bottom sheet This
                is a bottom sheet This is a bottom sheet This is a bottom sheet
                This is a bottom sheet This is a bottom sheet This is a bottom
                sheet This is a bottom sheet This is a bottom sheet This is a
                bottom sheet This is a bottom sheet This is a bottom sheet This
                is a bottom sheet This is a bottom sheet This is a bottom sheet
                This is a bottom sheet This is a bottom sheet
              </div>
            </v-sheet>
          </v-bottom-sheet>
        </v-col>
      </v-row>

      <v-divider class="ma-8"> </v-divider>

      <v-row v-for="n in 7" :key="n">
        <v-col v-for="k in n + 1" :key="k">
          <v-card class="pa-2 root text-center elevation-4 rounded-lg">
            {{ k }} of {{ n + 1 }}
          </v-card>
        </v-col>
      </v-row>

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

      <v-row class="spacer-bottom"> </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data: function () {
    return {
      checkbox: true, //실험용
      localAttrs: {
        absolute: false,
        fixed: true,
      }, //실험용
      icons: ["mdi-home", "mdi-email", "mdi-calendar", "mdi-delete"], //실험용
      sheet: false, //실험용
    };
  },
  computed: {},
  methods: {},
  watch: {},
  mounted: function () {},
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
.toTop {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
}
.sideBig {
  width: 100%;
  padding: 20px;
  margin: 12px;
}
.logo {
  border-radius: 12px;
}
</style>