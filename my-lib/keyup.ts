import { Subject, fromEvent, merge, Observable } from './rxjs';
import { ElementRef } from '@angular/core';
/**
 * input变化监控
 *
 * ```ts
    const sub = createKeyUp(this.input).switchMap(res => {
        this.val = res;
        return this.http.get('https://meepo.com.cn/app/index.php?i=2&c=entry&do=open&m=imeepos_runner&__do=task.getAll')
    }).subscribe(res => {
        console.log(res);
    });
 * ```
 */
export function createKeyUp(ele: ElementRef, time: number = 400) {
    const keyup = fromEvent(ele.nativeElement, 'keyup');
    const keydown = fromEvent(ele.nativeElement, 'keydown');
    const input = fromEvent(ele.nativeElement, 'input');
    const propertychange = fromEvent(ele.nativeElement, 'propertychange');

    const observable = merge(keyup, keydown, input, propertychange)
        // 防止抖动
        .debounceTime(time)
        // 获取数据
        .map(() => {
            return ele.nativeElement.value;
        })
        // 过滤数据
        .filter((text) => !!text)
        // 直到改变变
        .distinctUntilChanged()
    return observable;
}

