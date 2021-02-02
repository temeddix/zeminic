@@ -1,204 +0,0 @@
<template>
  <v-card>
    <v-card-title class="text-h4 justify-center my-2">설정</v-card-title>
    <v-card-text style="height: 600px">
      <v-switch
        class="ma-1"
        v-model="$root.settings.brightMode"
        inset
        label="밝은 모드"
      >
      </v-switch>
    </v-card-text>
    <v-card-actions> </v-card-actions>
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
</style>