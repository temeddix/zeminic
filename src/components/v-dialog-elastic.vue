<script>
/*global gsap deepmerge*/

export default {
  extends: require("vuetify/lib").VDialog, // 이 컴포넌트는 Vuetify 컴포넌트를 확장한 것. template이 없는 이유도 그것.
  data() {
    return {
      hasTimeTravelled: false,
    };
  },
  computed: {},
  methods: {
    becomeNew(fromElement, toElement, duration) {
      gsap.set([fromElement, toElement], {
        display: "", //vuetify 컴포넌트의 display:none을 제거해야 제대로 된 크기를 구할 수 있음
        transitionDuration: "0s", //vuetify 컴포넌트의 CSS 애니메이션을 제거해야 함
        transitionProperty: "", //vuetify 컴포넌트의 CSS 애니메이션을 제거해야 함
      });

      let fromPosition = fromElement.getBoundingClientRect();
      let toPosition = toElement.getBoundingClientRect();
      let fromBorderRadius = parseInt(
        getComputedStyle(fromElement).borderRadius
      );
      let toBorderRadius = parseInt(getComputedStyle(toElement).borderRadius);
      let toBoxShadow = getComputedStyle(toElement).boxShadow;

      let difference = {
        x: fromPosition.x - toPosition.x,
        y: fromPosition.y - toPosition.y,
        xScale: fromPosition.width / toPosition.width,
        yScale: fromPosition.height / toPosition.height,
      };

      gsap.set(fromElement, {
        opacity: "0",
        visibility: "hidden",
      });

      gsap.set(toElement, {
        zIndex: 202,
        transformOrigin: "top left",
        transform: `translate(${difference.x}px,${difference.y}px) scale( ${difference.xScale}, ${difference.yScale})`,
        boxShadow: "none",
        borderRadius: (toElement.style.borderRadius = `${
          fromBorderRadius / Math.min(difference.xScale, difference.yScale)
        }px`),
        opacity: "",
        visibility: "visible",
      });

      gsap.to(toElement, {
        ease: "power4.out",
        duration: duration,
        //여기까지가 gsap 애니메이션 설정
        transform: "",
        borderRadius: `${toBorderRadius}px`,
        clearProps:
          "zIndex, transformOrigin, transform, borderRadius", //https://greensock.com/docs/v3/GSAP/CorePlugins/CSSPlugin#h3-clearprops 그리고 camelCase로 적어야 함
      });

      gsap.to(toElement, {
        ease: "power4.in",
        duration: duration,
        //여기까지가 gsap 애니메이션 설정
        boxShadow: toBoxShadow,
        clearProps: "boxShadow",
      });
    },
    addHistory() {
      let original = history.state;
      let addition = {
        popupActivation: {
          [this.uid]: this.value,
        },
      };
      let state = deepmerge(original, addition);
      history.pushState(state, document.title, null);
    },
  },
  props: {
    maxWidth: {
      type: [String, Number],
      default: "600px",
    },
    transitionDuration: {
      type: [String, Number],
      default: 0.3,
    },
    transition: {
      type: Boolean,
      default: false,
    },
    hideOverlay: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    async value(newValue, oldValue) {
      let activator = await this.$children[0].$el; //HTML element
      let dialog = await this.$children[1].$el.children[0]; //HTML element

      if (newValue == true) {
        this.becomeNew(activator, dialog, this.transitionDuration);
      } else {
        this.becomeNew(dialog, activator, this.transitionDuration);
      }

      if (this.hasTimeTravelled == false) {
        this.addHistory();
      } else {
        this.hasTimeTravelled = false;
      }
    },
  },
  created() {
    window.addEventListener("popstate", (event) => {
      try {
        //history.state에 뭔가 정보가 있을 때
        //key는 있지만 value가 null인 경우도 고려함
        let restoreValue = event.state.popupActivation[this.uid] || false;
        if (restoreValue != this.value) {
          this.hasTimeTravelled = true;
          this.$emit("input", restoreValue);
        }
      } catch (error) {
        //history.state에 정보가 없을 때
        if (this.value == true) {
          this.hasTimeTravelled = true;
          this.$emit("input", false);
        }
      }
    });
  },
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
</style>