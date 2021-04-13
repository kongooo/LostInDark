import { mat4, quat, vec3 } from 'gl-matrix';
declare class Camera {
    FOV: number;
    zNear: number;
    zFar: number;
    position: vec3;
    rotation: quat;
    constructor();
    getProjectionMatrix: (gl: WebGLRenderingContext) => mat4;
    getViewMatrix: () => mat4;
}
export default Camera;
