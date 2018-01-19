import {
    ucfirst, isWindow,
    isDocument, isElement, fromPx,
    computedStyle, type, toPx
} from '../functions';
import { ElementRef, Renderer2 } from '@angular/core';

export function fromWindow(el, name) {
    return el[`client${ucfirst(name)}`]
}

function fromDocument(el, name) {
    name = ucfirst(name)
    const scroll_name = `scroll${name}`;
    const offset_name = `offset${name}`;
    const client_name = `client${name}`;
    const body_scroll = el.body[scroll_name]
    const document_scroll = el.documentElement[scroll_name]
    const body_offset = el.body[offset_name]
    const document_offset = el.documentElement[offset_name]
    const body_client = el.body[client_name]
    const document_client = el.documentElement[client_name]
    return Math.max(body_scroll, document_scroll, body_offset, document_offset, body_client, document_client)
}

function inner(el, name, from, to) {
    if (isWindow(el)) return fromWindow(el, name);
    if (isDocument(el)) return fromDocument(el, name);
    if (!isElement(el)) return null;
    const content = fromPx(computedStyle(el, name));
    const boxSizing = computedStyle(el, 'box-sizing');
    let padding = 0;
    let border = 0;
    if (boxSizing === 'padding-box') return content;
    padding += fromPx(computedStyle(el, `padding-${from}`));
    padding += fromPx(computedStyle(el, `padding-${to}`));
    if (boxSizing === 'border-box') {
        border += fromPx(computedStyle(el, `border-${from}-width`, ));
        border += fromPx(computedStyle(el, `border-${to}-width`, to));
    }
    return content + padding - border
}

function outer(el, withMargin, name, from, to) {
    if (isWindow(el)) return fromWindow(el, name);
    if (isDocument(el)) return fromDocument(el, name);
    if (!isElement(el)) return null;

    const content = fromPx(computedStyle(el, name))
    const boxSizing = computedStyle(el, 'box-sizing')
    let padding = 0
    let border = 0
    let margin = 0
    if (boxSizing === 'border-box' && !withMargin)
        return content

    margin += fromPx(computedStyle(el, `margin-${from}`, from));
    margin += fromPx(computedStyle(el, `margin-${to}`));

    if (boxSizing === 'border-box' && withMargin)
        return content + margin

    border += fromPx(computedStyle(el, `border-${from}-width`, from));
    border += fromPx(computedStyle(el, `border-${to}-width`, to));

    if (boxSizing === 'padding-box' && !withMargin)
        return content + border

    if (boxSizing === 'padding-box' && withMargin)
        return content + border + margin

    padding += fromPx(computedStyle(el, `padding-${from}`));
    padding += fromPx(computedStyle(el, `padding-${to}`, to));

    if (!withMargin)
        return content + border + padding
    return content + border + margin + padding
}

export class DomSize {
    el: HTMLElement;
    constructor(
        public ele: any,
        public render: Renderer2
    ) {
        this.el = ele;
    }

    innerWidth() {
        return inner(this.el, 'width', 'left', 'right');
    }

    innerHeight() {
        return inner(this.el, 'height', 'top', 'bottom');
    }

    height(value) {
        return this.wh(this.el, value, 'height', 'top', 'bottom');
    }

    width(value) {
        return this.wh(this.el, value, 'width', 'left', 'right');
    }

    outerWidth(withMargin) {
        return outer(this.el, withMargin, 'width', 'left', 'right');
    }

    outerHeight(withMargin) {
        return outer(this.el, withMargin, 'height', 'top', 'bottom')
    }

    wh(el, value, name, from, to) {
        if (isWindow(el)) return fromWindow(el, name);
        if (isDocument(el)) return fromDocument(el, name);
        if (!isElement(el)) return null;
        if (type(value) !== 'undefined') return this.whSet(el, value, name, from, to)
        return this.whGet(el, name, from, to)
    }

    whSet(el, value, name, from, to): void {
        const to_set = Object.create(null)
        const content = fromPx(computedStyle(el, name))
        const boxSizing = computedStyle(el, 'box-sizing')
        let padding = 0
        let border = 0

        if (!boxSizing || boxSizing === 'content-box') {
            return this.render.setStyle(el, name, toPx(value, true))
        }

        padding += fromPx(computedStyle(el, `padding-${from}`));
        padding += fromPx(computedStyle(el, `padding-${to}`, to));

        if (boxSizing === 'padding-box') {
            return this.render.setStyle(el, name, toPx(value + padding, true))
        }

        border += fromPx(computedStyle(el, `border-${from}-width`, from));
        border += fromPx(computedStyle(el, `border-${to}-width`, to));

        value = toPx(value + padding + border, true);
        return this.render.setStyle(el, name, value)
    }

    whGet(el, name, from, to) {
        const content = fromPx(computedStyle(el, name))
        const boxSizing = computedStyle(el, 'box-sizing')
        let padding = 0
        let border = 0

        if (!boxSizing || boxSizing === 'content-box')
            return content

        padding += fromPx(computedStyle(el, `padding-${from}`));
        padding += fromPx(computedStyle(el, `padding-${to}`));

        if (boxSizing === 'padding-box')
            return content - padding

        border += fromPx(computedStyle(el, `border-${from}-width`));
        border += fromPx(computedStyle(el, `border-${to}-width`));

        return content - padding - border
    }
}
