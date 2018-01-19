import { fromEvent, merge, Observable, combineLatest } from '../rxjs';

/**
 * 手写签名
 * @param canvas
 */
export function createWriteRealName(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    const mousedown = fromEvent(canvas, 'mousedown').do((e: Event) => {
        stopEvent(e);
    }).map((e: any) => getCanvasPosition(e, canvas));
    const touchstart = fromEvent(canvas, 'touchstart').do((e: Event) => {
        stopEvent(e);
    }).map((e: any) => getCanvasPosition(e, canvas));

    const mouseup = fromEvent(canvas, 'mouseup').do((e: Event) => {
        stopEvent(e);
    });
    const touchend = fromEvent(canvas, 'touchend').do((e: Event) => {
        stopEvent(e);
    })

    const touchmove = fromEvent(canvas, 'touchmove').do((e: Event) => {
        stopEvent(e);
    }).map((e: any) => getCanvasPosition(e, canvas));;
    const mousemove = fromEvent(canvas, 'mousemove').do((e: Event) => {
        stopEvent(e);
    }).map((e: any) => getCanvasPosition(e, canvas));;;

    const touchStartMove = merge(mousedown, touchstart, touchmove, mousemove);

    const movingCombit = touchStartMove.bufferCount(2, 1)
    // 开始
    const start$ = merge(mousedown, touchstart)
        .map(res => ({ data: res, type: 'start' }));
    // 画图移动
    const move$ = movingCombit.map(res => ({ data: res, type: 'move' }));
    // 结束
    const end$ = merge(mouseup, touchend).map(e => ({ type: 'end' }));

    let moving = false;
    const isWriting$ = merge(start$, move$, end$).map((res: any) => {
        if (res.type === 'start') {
            moving = true;
        } else if (res.type === 'end') {
            moving = false;
        }
        if (moving && res.type === 'move') {
            return res;
        }
        return null;
    })

    // 画完一笔
    isWriting$.subscribe((res: any) => {
        if (res) {
            const [first, sec] = res.data;
            ctx.moveTo(first.x, first.y);
            ctx.lineTo(sec.x, sec.y);
            ctx.stroke();
        }
    }, (err) => { }, () => { });
}

export function stopEvent(e: Event) {
    e.stopPropagation();
    e.preventDefault();
}

export function getCanvasPosition(event, canvas) {
    let xPos, yPos, rect;
    rect = canvas.getBoundingClientRect();
    // event = event;
    // Touch event
    if (event.type.indexOf('touch') !== -1) { // event.constructor === TouchEvent
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
}
