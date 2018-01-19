
import { type } from './type';

export function isNumber(num: any): boolean {
    if (type(num) === 'string' || num instanceof String) {
        if (!num.trim()) return false;
    } else if (type(num) !== 'number' && !(num instanceof Number)) {
        return false;
    }
    return (num - num + 1) >= 0;
}

export function isNaN(value: any): boolean {
    return isNumber(value) && value !== +value;
}

export function isWindow(el) {
    return el !== null && el === el.window
}
export function isDocument(el) {
    return el.nodeType === 9
}

export function isElement(el) {
    const element = HTMLElement ? HTMLElement : Element;
    if (type(element) === 'function') return (el instanceof element);
    return type(el) === 'element' && type(el.nodeName) === 'string';
}



export function isMeepoTrue(val) {
    if (val === true || val === 'true' || val === undefined || val === null || val === '') {
        return true;
    } else {
        return false;
    }
}
