export function computedStyle(el, prop, getComputedStyle?: any, style?: any) {
    getComputedStyle = window.getComputedStyle;
    style = getComputedStyle ? getComputedStyle(el) : el.currentStyle;
    if (style) {
        return style[
            prop.replace(/-(\w)/gi, function (word, letter) {
                return letter.toUpperCase();
            })
        ];
    }
}


export function setStyle(ele, render, styles) {
    for (const key in styles) {
        render.setStyle(ele, key, styles[key]);
    }
}

export function getWinWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}
export function getWinHeight() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

