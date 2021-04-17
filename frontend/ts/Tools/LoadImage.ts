import { ImgType } from "./interface";

const LoadImage = (images: Map<ImgType, string | HTMLImageElement>, imageMap: Map<ImgType, HTMLImageElement>) => {
    const promises: Array<Promise<HTMLImageElement>> = [];
    images.forEach((value, key) => {
        const promise: Promise<HTMLImageElement> = new Promise((resolve, reject) => {
            const img = new Image();
            img.src = value as string;
            img.onload = () => {
                imageMap.set(key, img);
                resolve(img);
            }
        })
        promises.push(promise);
    })
    return Promise.all(promises);
}

export { LoadImage }