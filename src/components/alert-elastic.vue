<template>
  <div
    :style="[balloonStyle, balloonStyleAnimated]"
    class="rounded stuff balloon elevation-8"
  >
    <svg width="12" height="8" :style="pokeStyle">
      <polygon points="0,0 12,0 6,8" style="fill: var(--v-stuff-base)" />
    </svg>
    <p class="ma-0 pa-0">{{ alertText }}</p>
  </div>
</template>

<script>
/*global gsap*/

export default {
  data() {
    return {
      duration: 3.5,
      transitionDuration: 0.3,
      xCorrection: 0,
      showUpward: false,
      targetActivation: 0,
      tweenedActivation: 1,
      targetElement: null,
      balloonStyle: {
        top: `-1000px`,
        left: `${window.innerWidth / 2}px`,
        transform: `translate(-50%,-50%)`,
        transformOrigin: `top left`,
      },
      pokeStyle: {
        position: `absolute`,
        transformOrigin: `top left`,
      },
    };
  },
  props: {
    target: null,
    alertText: { type: String, default: "알림 내용" },
  },
  computed: {
    balloonStyleAnimated() {
      return {
        transform:
          "scale(" +
          Math.sqrt(this.tweenedActivation) +
          ") translateX(-50%) " +
          " translateX(" +
          this.xCorrection +
          "px)" +
          (this.showUpward ? " translateY(-120%)" : " translateY(20%)"),
        opacity: this.tweenedActivation,
      };
    },
  },
  methods: {
    close() {
      this.targetActivation = 0;

      setTimeout(() => {
        // remove the element from the DOM
        try {
          this.$el.remove();
        } catch (error) {
          this.$el.parentNode.removeChild(this.$el); //IE는 element.remove() 지원을 안 하기 때문에 추가
        }

        if (this.targetElement.attachedElasticAlert == this) {
          this.targetElement.attachedElasticAlert = null; //뒷정리
        }
        // destroy the vue listeners, etc
        this.$destroy();
      }, this.transitionDuration*1000);
    },
    setTarget() {
      if (typeof this.target == "string") {
        this.targetElement = document.getElementById(this.target);
      } else {
        this.targetElement = this.target;
      }
    },
    setPosition() {
      let balloonWidth = this.$el.getBoundingClientRect().width;
      let elementRect = this.targetElement.getBoundingClientRect();
      let elementPosition = {
        top: elementRect.top, //상단 여백
        left: elementRect.left, //좌측 여백
        right: window.innerWidth - elementRect.right, //우측 여백
        bottom: window.innerWidth - elementRect.bottom, //하단 여백
        height: elementRect.height, //세로 길이
        width: elementRect.width, //가로 길이
        x: elementRect.left + elementRect.width / 2, //중심점의 좌표
        y: elementRect.top + elementRect.height / 2, //중심점의 좌표
      };

      if (elementPosition.top > elementPosition.bottom) {
        // 대상 Element가 화면 중간 높이보다 낮게 있다면
        // 말풍선은 아래가 아닌 위로 나타나게
        this.showUpward = true;
      }

      let balloonRightEnd = elementPosition.x + balloonWidth / 2;
      let balloonleftEnd = elementPosition.x - balloonWidth / 2;

      if (window.innerWidth - 12 < balloonRightEnd) {
        this.xCorrection = window.innerWidth - balloonRightEnd - 12;
      } else if (balloonleftEnd < 12) {
        this.xCorrection = 12 - balloonleftEnd;
      }

      this.pokeStyle.top = this.showUpward ? `100%` : `0%`;
      this.pokeStyle.left = `calc(50% - ${this.xCorrection}px)`;
      this.pokeStyle.transform = `${
        this.showUpward ? "" : "rotate(180deg)"
      } translateX(-50%)`;

      this.balloonStyle.top =
        elementPosition.top +
        (this.showUpward ? 0 : elementPosition.height) +
        "px";
      this.balloonStyle.left = elementPosition.x + "px";
      this.balloonStyle.width = balloonWidth + "px";
    },
    hideIntersects() {
      window.alertElasticActive.forEach((component) => {
        if (this == component) {
          return; //자기 자신일 땐 취소
        }

        let rect1 = this.$el.getBoundingClientRect();
        let rect2 = component.$el.getBoundingClientRect();

        let doesOverlap = !(
          rect1.right < rect2.left ||
          rect1.left > rect2.right ||
          rect1.bottom < rect2.top ||
          rect1.top > rect2.bottom
        );

        let index1 = window.alertElasticActive.indexOf(this); //이 컴포넌트가 배열에서 몇 번째인지 알아내고
        let index2 = window.alertElasticActive.indexOf(component); //그 컴포넌트가 배열에서 몇 번째인지 알아내고
        let isYounger = index2 < index1; //이 컴포넌트가 그 컴포넌트보다 더 최신인지 확인

        if (doesOverlap && isYounger) {
          component.close(); // 상대 컴포넌트를 닫고
          window.alertElasticActive.splice(index2, 1); // 그 컴포넌트를 배열 목록에서 제거
        }
      });
    },
  },
  watch: {
    targetActivation(newValue) {
      gsap.to(this.$data, {
        duration: this.transitionDuration,
        ease: "power4",
        tweenedActivation: newValue,
      });
    },
    tweenedActivation(newValue) {
      this.hideIntersects();
    },
  },
  created() {
    window.alertElasticActive.push(this);
    this.setTarget();
  },
  mounted() {
    setTimeout(() => {
      this.setPosition();
      this.tweenedActivation = 0;
      this.targetActivation = 1;
    }, 200);

    setTimeout(() => {
      this.close();
    }, this.duration*1000);
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.balloon {
  position: fixed;
  z-index: 150;
  pointer-events: none;
  padding: 18px;
  max-width: 280px;
}
</style>