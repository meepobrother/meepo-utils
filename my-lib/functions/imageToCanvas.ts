/**
 * 图片转换为canvas
 * @param image
 * @param canvas
 */

export function imageToCanvas(image: any, canvas: HTMLCanvasElement) {
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0);
    return canvas;
}
