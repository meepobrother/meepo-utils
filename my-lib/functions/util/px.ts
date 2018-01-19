import { type } from './type';

export function fromPx(px) {
    if (type(px) !== 'string') return 0;
    const number = Number(px.replace(/px$/, ''))
    return isNaN(number) ? 0 : number
}

export function toPx(n, pos) {
    if (type(n) === 'string')
        return n
    if (type(n) === 'number')
        return `${(pos && n < 0) ? 0 : n}px`;
    return '0px'
}
