import { ImgType } from "./interface";
declare const LoadImage: (images: Map<ImgType, string | HTMLImageElement>, imageMap: Map<ImgType, HTMLImageElement>) => Promise<HTMLImageElement[]>;
export { LoadImage };
