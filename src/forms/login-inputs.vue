@@ -1,204 +0,0 @@
<template>
  <v-card>
    <v-card-title>로그인하세요!</v-card-title>
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
      <v-btn text> 회원가입 </v-btn>
      <!--
      <v-dialog-elastic v-model="signupDialog" scrollable max-width="500px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on"> 회원가입 </v-btn>
        </template>
        <v-card>
          <v-card-title class="d-flex pt-8 px-9"
            >회원가입을 하시겠어요?
          </v-card-title>
          <v-card-text class="py-2">
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="signinForm.email"
                    label="이메일"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="signinForm.nickname"
                    label="별명"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="signinForm.pw"
                    label="암호"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row> </v-container
          ></v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="signupDialog = false"> 취소 </v-btn>
            <v-btn color="stuff" @click="signup"> 회원가입 </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog-elastic>
      -->
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
      signinForm: {
        email: "",
        nickname: "",
        pw: "",
      },
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