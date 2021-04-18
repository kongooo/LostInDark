import { ImgType, ItemType } from "./interface";

const LoadImage = (images: Map<ImgType | ItemType, string | HTMLImageElement>, imageMap: Map<ImgType | ItemType, HTMLImageElement>) => {
    const promises: Array<Promise<HTMLImageElement>> = [];
    images.forEach((value, key) => {
        const promise: Promise<HTMLImageElement> = new Promise((resolve, reject) => {
            const img = new Image();
            img.src = value as string;
            img.width = 50;
            img.height = 50;
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