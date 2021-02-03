@@ -1,204 +0,0 @@
<template>
  <v-card>
    <v-card-title class="text-h4 justify-center my-2">로그인</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field
              v-model="loginForm.email"
              label="이메일"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="loginForm.pw"
              label="암호"
              type="password"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-bottom-sheet-elastic v-model="signupSheet">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" text> 회원가입 </v-btn>
        </template>
        <signup-inputs></signup-inputs>
      </v-bottom-sheet-elastic>
      <v-spacer></v-spacer>
      <v-btn color="stuff" @click="login"> 로그인 </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
/* global axios */

export default {
  data() {
    return {
      loginForm: {
        email: "",
        pw: "",
      },
      signupSheet: false,
    };
  },
  computed: {},
  methods: {
    async login() {
      let response = await axios.post("/ajax/login", this.loginForm);
      console.log(response);
    },
    async signup() {
      let response = await axios.post("/ajax/login", this.signinForm);
      console.log(response);
    },
  },
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
</style>