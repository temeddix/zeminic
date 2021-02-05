<template>
  <div>
    <v-row>
      <v-col class="text-center">
        <img alt="Vue logo" src="../assets/logo.png" class="logo-image" />
      </v-col>
    </v-row>
    <v-row class="mt-4 mb-n6">
      <v-col class="text-center">
        <p class="text-h4">제미닉 개발 초기 화면</p>
      </v-col>
    </v-row>

    <v-divider class="ma-8"> </v-divider>

    <v-row>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel class="area" v-for="(item, i) in 5" :key="i">
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
          class="ma-0"
          :label="'이건 체크박스다 체크박스'"
        ></v-checkbox>
      </v-col>
    </v-row>

    <v-divider class="ma-8"> </v-divider>

    <v-row>
      <v-col class="d-flex justify-center">
        <p>여기부턴 Vuetify의 레이아웃 기능</p>
      </v-col>
    </v-row>

    <v-row v-for="n in 7" :key="n" class="px-2">
      <v-col v-for="k in n + 1" :key="k" class="px-1">
        <v-card class="area d-flex justify-center align-center small-card" height="200px">
          {{ k }} of {{ n + 1 }}
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkbox: true, //실험용
      sheet: false, //실험용
    };
  },
  computed: {},
  methods: {},
  watch: {},
  created() {
    this.$root.contentTitle = "";
  },
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.logo-image {
  border-radius: 12px;
}
.small-card {
  height: 80px;
}
</style>