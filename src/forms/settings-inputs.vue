@@ -1,204 +0,0 @@
<template>
  <v-card class="backdrop giveHeight">
    <v-card-title class="text-h4 justify-center">설정</v-card-title>
    <v-card-text>
      <v-switch
        class="ma-1"
        v-model="$root.settings.brightMode"
        inset
        label="밝은 모드"
      >
      </v-switch>
    </v-card-text>
    <v-card-actions class="pb-4"> </v-card-actions>
  </v-card>
</template>

<script>
/* global */

export default {
  data() {
    return {};
  },
  computed: {},
  methods: {},
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.giveHeight {
  height: 400px;
}
</style>