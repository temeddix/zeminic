@@ -1,204 +0,0 @@
<template>
  <v-sheet class="pa-4 rounded-t backdrop">
    <p ref="title" class="text-h4 text-center topText mb-1 mt-4">
      회원 탈퇴하기
    </p>
    <v-stepper v-model="currentStep" class="transparentArea" alt-labels>
      <v-stepper-header class="elevation-0">
        <v-stepper-step :complete="currentStep > 1" step="1">
          마지막 안내
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentStep > 2" step="2">
          본인 확인
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3"> 인사 </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content class="pt-0 px-0" step="1">
          <v-card class="area mb-4 px-4 d-flex align-center" height="300px">
            <v-container>
              <v-row>
                <v-col>
                  <p class="text-center text-subtitle-1">
                    정말 탈퇴하시겠어요?
                  </p>
                  <p>• 한 번 삭제한 계정은 다시 복구할 수 없습니다.</p>
                  <p>
                    • 업로드한 작품과 댓글은 삭제되지 않습니다. 삭제가
                    필요하다면 회원 탈퇴하기 전에 삭제하셔야 합니다.
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <div class="actionsWrapper">
            <v-btn
              class="stuff nextButton"
              ref="step2Button"
              @click="gotoStep2()"
            >
              다음
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content class="pt-0 px-0" step="2">
          <v-card class="area mb-4 px-4 d-flex align-center" height="300px">
            <v-container>
              <v-row>
                <v-col>
                  <p class="text-center text-subtitle-1">
                    본인이 맞는지 다시 한 번 확인해 주세요.
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="withdrawForm.email"
                    label="이메일"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="withdrawForm.pw"
                    label="암호"
                    type="password"
                    required
                    @keyup.enter="gotoStep3()"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <div class="actionsWrapper">
            <v-btn
              class="stuff nextButton"
              ref="step3Button"
              @click="gotoStep3()"
            >
              다음
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content class="pt-0 px-0" step="3">
          <v-card class="area mb-4 px-4 d-flex align-center" height="300px">
            <v-container>
              <v-row>
                <v-col>
                  <p class="text-center text-subtitle-1">안녕히 가세요!</p>
                  <p class="text-center">언제라도 돌아오시길 기다릴게요.</p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <div class="actionsWrapper">
            <v-btn class="stuff nextButton" @click="finish()"> 끝 </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-sheet>
</template>

<script>
/* global axios */

export default {
  data() {
    return {
      currentStep: 1,
      withdrawForm: {
        email: "",
        pw: "",
      },
    };
  },
  computed: {},
  methods: {
    async gotoStep2() {
      this.currentStep = 2;
    },
    async gotoStep3() {
      let response = await axios.post("/ajax/withdraw", this.withdrawForm);
      if (response.data.isOk == true) {
        this.currentStep = 3;
        this.$alertElastic(this.$refs.title, response.data.msg);
      } else {
        this.$alertElastic(this.$refs.step3Button.$el, response.data.msg);
      }
    },
    async finish() {
      //시트 닫기
      this.$parent.$parent.$emit("input", false);
      //로그인 상태 갱신
      this.$root.getUserInfo();
      //초기화
      this.currentStep = 1;
      this.withdrawForm.email = "";
      this.withdrawForm.pw = "";
    },
  },
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
</style>