<template>
  <transition name="fade" mode="out-in" appear>
    <div key=1 v-if="$root.isLoggedin">
      <v-row>
        <v-col class="text-center">
          <p>얍 여긴 계정페이지야</p>
          <v-bottom-sheet-elastic v-model="withdrawSheet">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on">회원 탈퇴</v-btn>
            </template>
            <withdraw-inputs></withdraw-inputs>
          </v-bottom-sheet-elastic>
        </v-col>
      </v-row>
    </div>
    <div key=2 v-else>
      <v-row>
        <v-col class="text-center">
          <p>로그인이 안 되어 있어요</p>
        </v-col>
      </v-row>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      withdrawSheet: false,
    };
  },
  computed: {},
  methods: {
    withdraw() {},
  },
  watch: {},
  created() {
    this.$root.contentTitle = "계정";
  },
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.big-image {
  border-radius: 12px;
  width: 100%;
}
</style>