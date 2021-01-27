const gsap = window.gsap

window.becomeNew = function (fromElement, toElement, duration) {
  gsap.set([fromElement, toElement], {
    display: "",
    opacity: 1,
  });

  let clone = toElement.cloneNode(true);
  clone.querySelectorAll('*').forEach(n => n.removeAttribute('id'));
  clone.innerHTML="";

  let fromPosition = fromElement.getBoundingClientRect();
  let toPosition = toElement.getBoundingClientRect();

  let initialState = {
    position: 'fixed',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    left: fromPosition.left,
    top: fromPosition.top,
    width: fromPosition.width,
    height: fromPosition.height,
    margin: 0,
    zIndex: 202,
    transform: '',
    overflow: 'hidden',
    opacity: 1,
    display: '',
    //여기까지가 강제 설정, 밑으로는 실제 형태 존중
    boxShadow: window.getComputedStyle(fromElement).boxShadow,
    borderRadius: Math.min(
      (isNaN(parseInt(fromElement.style.borderRadius)) ? 1000 : parseInt(parseInt(fromElement.style.borderRadius))),
      (isNaN(parseInt(getComputedStyle(toElement).borderTopLeftRadius)) ? 1000 : parseInt(getComputedStyle(fromElement).borderTopLeftRadius)),
      parseInt(fromPosition.width / 2),
      parseInt(fromPosition.height / 2)),
    backgroundColor: window.getComputedStyle(fromElement).backgroundColor,
    border: window.getComputedStyle(fromElement).border,
    color: window.getComputedStyle(fromElement).color,
    fontSize: window.getComputedStyle(fromElement).fontSize,
    fontFamily: window.getComputedStyle(fromElement).fontFamily,
    fontStyle: window.getComputedStyle(fromElement).fontStyle,
    fontVariant: window.getComputedStyle(fromElement).fontVariant,
    fontWeight: window.getComputedStyle(fromElement).fontWeight,
    lineHeight: window.getComputedStyle(fromElement).lineHeight,
  };

  let transitionPlan = {
    ease: 'power4.out',
    duration: duration,
    autoRound: true,
    onComplete: onCompleteFunction,
    //여기까지가 gsap 애니메이션 설정
    left: toPosition.left,
    top: toPosition.top,
    width: toPosition.width,
    height: toPosition.height,
    //여기까지가 강제 설정, 밑으로는 실제 형태 존중
    borderRadius: Math.min(
      (isNaN(parseInt(toElement.style.borderRadius)) ? 1000 : parseInt(parseInt(toElement.style.borderRadius))),
      (isNaN(parseInt(getComputedStyle(toElement).borderTopLeftRadius)) ? 1000 : parseInt(getComputedStyle(toElement).borderTopLeftRadius)),
      parseInt(toPosition.width / 2),
      parseInt(toPosition.height / 2)),
    backgroundColor: window.getComputedStyle(toElement).backgroundColor,
    border: window.getComputedStyle(toElement).border,
    color: window.getComputedStyle(toElement).color,
    fontSize: window.getComputedStyle(toElement).fontSize,
    fontFamily: window.getComputedStyle(toElement).fontFamily,
    fontStyle: window.getComputedStyle(toElement).fontStyle,
    fontVariant: window.getComputedStyle(toElement).fontVariant,
    fontWeight: window.getComputedStyle(toElement).fontWeight,
    lineHeight: window.getComputedStyle(toElement).lineHeight,
  };

  clone.className = '';
  document.getElementById("app").appendChild(clone);

  gsap.set([fromElement, toElement], {
    display: "",
    opacity: 0,
  });

  gsap.set(clone, initialState);
  gsap.to(clone, transitionPlan);

  function onCompleteFunction() {
    gsap.set(toElement, {
      display: "",
      opacity: 1,
    });
    gsap.set(fromElement, {
      display: "",
      opacity: 0,
    });
    document.getElementById("app").removeChild(clone);
  }
}