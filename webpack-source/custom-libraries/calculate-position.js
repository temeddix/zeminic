window.calculatePosition = function(element) {
        
    let rect = element.getBoundingClientRect();
    
    let scrollTop  = window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop  || 0;
    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    
    let clientTop  = document.documentElement.clientTop  || document.body.clientTop  || 0;
    let clientLeft = document.documentElement.clientLeft || document.body.clientLeft || 0;
        
    return {
        top: Math.round(rect.top + scrollTop - clientTop),
        left: Math.round(rect.left + scrollLeft - clientLeft),
        height: rect.height,
        width: rect.width,
    };
}