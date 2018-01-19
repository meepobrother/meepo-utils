export interface SignatureConfig {
    lineColor?: string;
    lineWidth?: number;
    border?: string;
    background?: string;
    width?: number;
    height?: number;
    autoFit?: boolean;
}

import { Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DomSize } from './dom';
import { fromEvent, merge } from '../rxjs';
export class SignatureAbstract {
    defaults: SignatureConfig = {
        lineColor: '#222222',
        lineWidth: 1,
        border: '1px dashed #AAAAAA',
        background: '#FFFFFF',
        width: 300,
        height: 100,
        autoFit: true
    };
    canvas: HTMLCanvasElement;
    settings: SignatureConfig;
    ctx: CanvasRenderingContext2D;
    domsize: DomSize;

    drawing: boolean;
    lastPos: any;
    currentPos: any;

    @HostListener('touchstart', ['$event'])
    touchstart(e) {
        e.preventDefault();
    }

    @HostListener('touchmove', ['$event'])
    touchmove(e) {
        e.preventDefault();
    }

    @HostListener('touchend', ['$event'])
    touchend(e) {
        e.preventDefault();
    }

    constructor(
        element: HTMLCanvasElement,
        public render: Renderer2
    ) {
        this.canvas = element;
        this.settings = this.defaults;
        this.domsize = new DomSize(this.canvas, this.render);

        this.currentPos = {
            x: 0,
            y: 0
        };
        this.lastPos = this.currentPos;
    }

    setSettings(settings: SignatureConfig) {
        this.settings = { ...this.settings, ...settings };
        this.canvas.width = this.settings.width;
        this.canvas.height = this.settings.height;
        this.init();
    }

    setStyle() {
        const style = {
            boxSizing: 'border-box',
            width: this.settings.width + 'px',
            height: this.settings.height + 'px',
            border: this.settings.border,
            background: this.settings.background,
            cursor: 'crosshair'
        }
        for (const k in style) {
            this.render.setStyle(this.canvas, k, style[k]);
        }
    }

    setAttr() {
        this.render.setAttribute(this.canvas, 'width', '' + this.settings.width);
        this.render.setAttribute(this.canvas, 'height', '' + this.settings.height);
    }

    init() {
        this.setStyle();
        if (this.settings.autoFit === true) {
            this._resizeCanvas();
        }
        this._resetCanvas();

        const end$ = merge(
            fromEvent(this.canvas, 'mouseup'),
            fromEvent(this.canvas, 'touchend')
        );

        end$.subscribe(res => {
            this.drawing = false;
        });

        const start$ = merge(
            fromEvent(this.canvas, 'mousedown'),
            fromEvent(this.canvas, 'touchstart')
        );

        start$.map((e: any) => this._getPosition(e)).subscribe(res => {
            this.drawing = true;
            this.lastPos = this.currentPos = res;
        });

        const move$ = merge(
            fromEvent(this.canvas, 'mousemove'),
            fromEvent(this.canvas, 'touchmove')
        );
        move$.map((e: any) => this._getPosition(e)).subscribe((e: any) => {
            this.currentPos = e;
            this._renderCanvas();
        });
    }

    clearCanvas() {
        this.canvas.width = this.canvas.width;
        this._resetCanvas();
    }

    getDataURL() {
        return this.canvas.toDataURL();
    }

    _getPosition(event: MouseEvent | TouchEvent) {
        let xPos, yPos, rect;
        rect = this.canvas.getBoundingClientRect();
        if (event instanceof TouchEvent) {
            xPos = event.touches[0].clientX - rect.left;
            yPos = event.touches[0].clientY - rect.top;
        } else {
            xPos = event.clientX - rect.left;
            yPos = event.clientY - rect.top;
        }
        return {
            x: xPos,
            y: yPos
        };
    };

    _renderCanvas() {
        if (this.drawing) {
            this.ctx.moveTo(this.lastPos.x, this.lastPos.y);
            this.ctx.lineTo(this.currentPos.x, this.currentPos.y);
            this.ctx.stroke();
            this.lastPos = this.currentPos;
        }
    }

    _resetCanvas() {
        this.ctx = this.canvas.getContext("2d");
        this.ctx.strokeStyle = this.settings.lineColor;
        this.ctx.lineWidth = this.settings.lineWidth;
    }

    _resizeCanvas() {
        const width = this.domsize.outerWidth(true);
        this.render.setAttribute(this.canvas, 'width', width);
    }
}


export class Signature extends SignatureAbstract {

}
