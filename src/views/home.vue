<template>
  <div>
    <v-row>
      <v-col class="text-center">
        <img alt="Vue logo" src="../assets/logo.png" class="logo" />
        <br />
        <br />
        <hello-world msg="Welcome to Your Vue.js App" />
      </v-col>
    </v-row>

    <v-divider class="ma-8"> </v-divider>

    <v-row>
      <v-col>
        <router-link to="/">
          <v-btn block class="white" rounded>홈으로 가기</v-btn>
        </router-link>
      </v-col>
      <v-col>
        <router-link to="/flower/1">
          <v-btn block class="white" rounded>꽃 페이지로 가기</v-btn>
        </router-link>
      </v-col>
      <v-col>
        <router-link to="/grass">
          <v-btn block class="white" rounded>풀 페이지로 가기</v-btn>
        </router-link>
      </v-col>
      <v-col>
        <router-link to="/tree">
          <v-btn block class="white" rounded
            >나무 페이지로 가기</v-btn
          >
        </router-link>
      </v-col>
    </v-row>

    <v-divider class="ma-8"> </v-divider>

    <v-row>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel
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
              class="grey darken-4"
              rounded
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
              bottom sheet This is a bottom sheet This is a bottom sheet This is
              a bottom sheet This is a bottom sheet This is a bottom sheet This
              is a bottom sheet This is a bottom sheet This is a bottom sheet
              This is a bottom sheet This is a bottom sheet This is a bottom
              sheet This is a bottom sheet This is a bottom sheet This is a
              bottom sheet This is a bottom sheet This is a bottom sheet This is
              a bottom sheet This is a bottom sheet This is a bottom sheet This
              is a bottom sheet This is a bottom sheet This is a bottom sheet
              This is a bottom sheet This is a bottom sheet This is a bottom
              sheet This is a bottom sheet This is a bottom sheet This is a
              bottom sheet This is a bottom sheet
            </div>
          </v-sheet>
        </v-bottom-sheet>
      </v-col>
    </v-row>

    <v-divider class="ma-8"> </v-divider>

    <v-row>
      <v-col class="d-flex justify-center">
        <p>여기부턴 Vuetify의 레이아웃 기능</p>
      </v-col>
    </v-row>

    <v-row v-for="n in 7" :key="n">
      <v-col v-for="k in n + 1" :key="k">
        <v-card class="d-flex justify-center align-center small-card">
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
  mounted() {},
};
</script>

<style lang="scss" scoped>
.logo {
  border-radius: 12px;
}
.small-card{
  height: 80px;
}
</style>