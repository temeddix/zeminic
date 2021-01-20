const gsap = window.gsap;

const customEase = window.CustomEase

window.becomeNew = function(fromElement, toElement, duration, smoothShadow) {
    let fromPosition = fromElement.getBoundingClientRect();
    let toPosition = toElement.getBoundingClientRect();

    let clone = toElement.cloneNode(true);

    /*
    if(isMobile==true){
        for(let i=0; i<clone.children.length; i++){
            clone.removeChild(clone.children[i])
        }
    }
    */

    let initialState = {
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        left: fromPosition.left,
        top: fromPosition.top,
        width: fromPosition.width,
        height: fromPosition.height,
        margin: 0,
        zIndex: 100,
        transform: '',
        overflow: 'hidden',
        visibility: 'visible',
        //여기까지가 강제 설정, 밑으로는 실제 형태 존중
        boxShadow: window.getComputedStyle(fromElement).boxShadow,
        borderRadius: Math.min(
            (isNaN(parseInt(fromElement.style.borderRadius))?1000:parseInt(parseInt(fromElement.style.borderRadius))),
            (isNaN(parseInt(getComputedStyle(toElement).borderTopLeftRadius))?1000:parseInt(getComputedStyle(fromElement).borderTopLeftRadius)),
            parseInt(fromPosition.width/2),
            parseInt(fromPosition.height/2) ) ,
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
        ease: 'power4',
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
            (isNaN(parseInt(toElement.style.borderRadius))?1000:parseInt(parseInt(toElement.style.borderRadius))),
            (isNaN(parseInt(getComputedStyle(toElement).borderTopLeftRadius))?1000:parseInt(getComputedStyle(toElement).borderTopLeftRadius)),
            parseInt(toPosition.width/2),
            parseInt(toPosition.height/2) ) ,
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

    let shadowTransitionPlan = {
        ease: smoothShadow? 'power4.inOut'
        : customEase.create("custom", "M0,0,C0,0.484,0.034,0.726,0.16,0.852,0.292,0.984,0.504,1,1,1"),
        boxShadow: window.getComputedStyle(toElement).boxShadow,
    }; //그림자는 성능상 가장 무겁기 때문에 마지막에 커짐. 안 그러면 프레임드랍 심함.

    clone.className = '';
    document.body.appendChild(clone);
    gsap.set([fromElement, toElement], { visibility: "hidden" });
    gsap.set(clone, initialState);
    gsap.to(clone, transitionPlan);
    gsap.to(clone, shadowTransitionPlan);
    
    function onCompleteFunction() {
        gsap.set(toElement, { visibility: "inherit" });
        document.body.removeChild(clone);
    }
}