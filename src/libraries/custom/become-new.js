/* global gsap */

window.becomeNew = function (fromElement, toElement, duration) {
  gsap.set([fromElement, toElement], {
    display: "", //vuetify 컴포넌트의 display:none을 제거해야 제대로 된 크기를 구할 수 있음
    transitionDuration: "0s", //vuetify 컴포넌트의 CSS 애니메이션을 제거해야 함
    transitionProperty: "", //vuetify 컴포넌트의 CSS 애니메이션을 제거해야 함
  });

  let fromPosition = fromElement.getBoundingClientRect();
  let toPosition = toElement.getBoundingClientRect();
  let fromBorderRadius = parseInt(getComputedStyle(fromElement).borderRadius);
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
    overflow: "hidden",
    transformOrigin: "top left",
    transform: `translate(${difference.x}px,${difference.y}px) scale( ${difference.xScale}, ${difference.yScale})`,
    boxShadow: "none",
    borderRadius: toElement.style.borderRadius = `${fromBorderRadius/Math.min(difference.xScale,difference.yScale)}px`,
    opacity: "",
    visibility: "visible",
  });

  gsap.to(toElement, {
    ease: 'power4.out',
    duration: duration,
    //여기까지가 gsap 애니메이션 설정
    transform: "",
    borderRadius: `${toBorderRadius}px`,
    clearProps: "zIndex, transformOrigin, transform, borderRadius, overflow", //https://greensock.com/docs/v3/GSAP/CorePlugins/CSSPlugin#h3-clearprops 그리고 camelCase로 적어야 함
  });

  gsap.to(toElement, {
    ease: 'power4.in',
    duration: duration,
    //여기까지가 gsap 애니메이션 설정
    boxShadow: toBoxShadow,
    clearProps: "boxShadow",
  });
}