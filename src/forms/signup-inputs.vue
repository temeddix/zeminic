@@ -1,204 +0,0 @@
<template>
  <v-sheet class="pa-4 rounded-t backdrop">
    <p class="text-h4 text-center topText mb-1 mt-4">회원가입</p>
    <v-stepper v-model="currentStep" class="transparentArea" alt-labels>
      <v-stepper-header class="elevation-0">
        <v-stepper-step :complete="currentStep > 1" step="1">
          양식 입력
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentStep > 2" step="2">
          이메일 인증
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3"> 마지막 확인 </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content class="pt-0 px-0" step="1">
          <v-card class="area mb-4 px-4 d-flex align-center" height="300px">
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="signinForm.email"
                    label="이메일"
                    class="textField"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="signinForm.nickname"
                    label="별명"
                    class="textField"
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
                    class="textField"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <div class="actionsWrapper">
            <v-btn class="stuff nextButton" @click="currentStep = 2">
              다음
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content class="pt-0 px-0" step="2">
          <v-card class="area mb-4 px-4 d-flex align-center" height="300px">
            <v-container>
              <v-row>
                <v-col>
                  <p class="text-center text-body-1">
                    이메일로 인증 코드를 보내드렸어요.<br />확인하고 입력해
                    주세요!
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="verificationCode"
                    label="이메일로 전송된 인증 코드"
                    class="textField"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <div class="actionsWrapper">
            <v-btn class="stuff nextButton" @click="currentStep = 3">
              다음
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content class="pt-0 px-0" step="3">
          <v-card class="area mb-4 px-4 d-flex align-center" height="300px">
            <v-container>
              <v-row>
                <v-col>
                  <p class="text-center text-h5">
                    환영해요 0000님!
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <div class="actionsWrapper">
            <v-btn class="stuff nextButton" @click="currentStep = 1">
              끝
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-sheet>
</template>

<script>
/* global */

export default {
  data() {
    return {
      currentStep: 1,
      signinForm: {
        email: "",
        nickname: "",
        pw: "",
      },
      verificationCode: "",
    };
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
.transparentArea {
  background-color: rgba(0, 0, 0, 0);
  box-shadow: unset;
}
.nextButton {
  width: 120px;
}
.actionsWrapper {
  text-align: center;
}
.textField{
  max-width: 400px;
  margin: auto;
}
</style>