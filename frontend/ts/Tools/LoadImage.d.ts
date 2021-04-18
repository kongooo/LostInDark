import { ImgType, ItemType } from "./interface";
declare const LoadImage: (images: Map<ImgType | ItemType, string | HTMLImageElement>, imageMap: Map<ImgType | ItemType, HTMLImageElement>) => Promise<HTMLImageElement[]>;
export { LoadImage };
