
/**
 * canvas 转化为图片
 * @param canvas
 */
export function canvasToImage(canvas: HTMLCanvasElement) {
    const image = new Image();
    image.src = canvas.toDataURL('image/png');
    return image;
}

