
export function hasClass(node, className) {
    if (node.classList) {
        return node.classList.contains(className);
    }
    const originClass = node.className;
    return ` ${originClass} `.indexOf(` ${className} `) > -1;
}

export function addClass(node, className) {
    if (node.classList) {
        node.classList.add(className);
    } else {
        if (!hasClass(node, className)) {
            node.className = ` ${node.className} ${className}`;
        }
    }
}

export function removeClass(node, className) {
    if (node.classList) {
        node.classList.remove(className);
    } else {
        if (hasClass(node, className)) {
            const originClass = node.className;
            node.className = ` ${originClass} `.replace(` ${className} `, '');
        }
    }
}


export function ansycClassObj(obj: any, srtClassName: string = '') {
    for (const key in obj) {
        srtClassName += obj[key] ? ` ${key} ` : ` `;
    }
    return srtClassName;
}

import { type } from './type';
export function setClassObj(arrs: any, to: Object = {}, val: any, pre: string = '') {
    if (type(arrs) === 'string') {
        arrs = arrs.split(',');
    }
    arrs.map((arr, index) => {
        to[`${pre}-${arr}`] = val === arr;
    });
    return to;
}
