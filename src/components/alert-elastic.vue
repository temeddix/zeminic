<template>
  <div :style="balloonStyle" class="alertBalloon">
    <svg width="12" height="8" :style="pokeStyle">
      <polygon points="0,0 12,0 6,8" style="fill: var(--v-secondary-base)" />
    </svg>
    <p class="alertTextClass">{{ alertText }}</p>
  </div>
</template>

<script>
const gsap = window.gsap;

export default {
  data: function () {
    return {
      targetActivation: 0,
      tweenedActivation: 0,
      showUpward: false,
      xCorrection: 0,
      balloonWidth: 240,
      elementPosition: {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      },
      targetElement: null,
    };
  },
  props: {
    target: null,
    alertText: { type: String, default: "알림 내용" },
  },
  computed: {
    balloonStyle() {
      return {
        width: this.balloonWidth + "px",
        top:
          this.elementPosition.top +
          (this.showUpward ? 0 : this.elementPosition.height) +
          "px",
        left: this.elementPosition.left + this.elementPosition.width / 2 + "px",
        transform:
          "scale(" +
          Math.sqrt(this.tweenedActivation) +
          ") translateX(-50%) " +
          " translateX(" +
          this.xCorrection +
          "px)" +
          (this.showUpward ? " translateY(-120%)" : " translateY(20%)"),
        opacity: this.tweenedActivation,
        transformOrigin: "0% 0%",
      };
    },
    pokeStyle() {
      return {
        position: "absolute",
        top: this.showUpward ? "100%" : "0%",
        left: "calc(50% - " + this.xCorrection + "px)",
        transform:
          (this.showUpward ? "" : " rotate(180deg)") + "translateX(-50%)",
        transformOrigin: "0% 0%",
      };
    },
  },
  methods: {
    close() {
      let self = this;

      self.targetActivation = 0;

      setTimeout(function () {
        // remove the element from the DOM
        try {
          self.$el.remove();
        } catch (error) {
          self.$el.parentNode.removeChild(self.$el); //IE는 element.remove() 지원을 안 하기 때문에 추가
        }

        if (self.targetElement.attachedElasticAlert == self) {
          self.targetElement.attachedElasticAlert = null; //뒷정리
        }
        // destroy the vue listeners, etc
        self.$destroy();
      }, 400);
    },
  },
  watch: {
    targetActivation(newValue) {
      gsap.to(this.$data, {
        duration: 0.3,
        ease: "power4",
        tweenedActivation: newValue,
      });
    },
  },
  created() {
    let self = this;

    if (typeof self.target == "string") {
      self.targetElement = document.getElementById(self.target);
    } else {
      self.targetElement = self.target;
    }

    if (self.targetElement.attachedElasticAlert != null) {
      self.targetElement.attachedElasticAlert.close(); //뭐야 넌? 비켜! (중복알림 방지)
    }

    self.targetElement.attachedElasticAlert = self; //이젠 내가 이 Element 쫄깃알림 지위를 차지한다

    let elementDomRect = self.targetElement.getBoundingClientRect();

    self.elementPosition.top = elementDomRect.top;
    self.elementPosition.left = elementDomRect.left;
    self.elementPosition.width = elementDomRect.width;
    self.elementPosition.height = elementDomRect.height;

    if (self.elementPosition.top < -self.elementPosition.height) {
      self.elementPosition.top = -self.elementPosition.height;
    } else if (window.innerHeight < self.elementPosition.top) {
      self.elementPosition.top = window.innerHeight;
    }

    if (
      self.elementPosition.top >
      window.innerHeight -
        self.elementPosition.top -
        self.elementPosition.height
    ) {
      self.showUpward = true;
    }

    if (
      this.elementPosition.left +
        this.elementPosition.width / 2 -
        this.balloonWidth / 2 <
      12
    ) {
      self.xCorrection =
        12 -
        (this.elementPosition.left +
          this.elementPosition.width / 2 -
          this.balloonWidth / 2);
    } else if (
      window.innerWidth -
        this.elementPosition.left -
        this.elementPosition.width / 2 -
        this.balloonWidth / 2 <
      12
    ) {
      self.xCorrection =
        window.innerWidth -
        this.elementPosition.left -
        this.elementPosition.width / 2 -
        this.balloonWidth / 2 -
        12;
    }

    self.targetActivation = 1;

    setTimeout(function () {
      self.close();
    }, 3500);
  },
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.allCenterContainer {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}
.alertBalloon {
  position: fixed;
  z-index: 150;
  border-radius: 6px;
  background-color: var(--v-secondary-base);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.6);
  pointer-events: none;
  padding: 18px;
}
.alertTextClass {
  color: #ffffff;
  margin: 0px !important;
}
.roundHighlight {
  background: radial-gradient(
    circle at 50% 20%,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0)
  );
}
</style>