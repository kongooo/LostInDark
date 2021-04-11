const LoadImage = (images: Array<any>) => {
    const promises: Array<Promise<HTMLImageElement>> = [];
    images.forEach(src => {
        const promise: Promise<HTMLImageElement> = new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                resolve(img);
            }
        })
        promises.push(promise);
    })
    return Promise.all(promises);
}

export { LoadImage }