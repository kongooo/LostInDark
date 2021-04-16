import { mat4, quat, vec3 } from 'gl-matrix';

const deg2Rad = Math.PI / 180;

class Camera {

    FOV: number = 60;
    zNear: number = 0.3;
    zFar: number = 1000;
    position: vec3 = vec3.fromValues(0, 8, 20);
    rotation: quat = quat.create();

    constructor() {
        quat.setAxisAngle(this.rotation, vec3.fromValues(1, 0, 0), -45 * deg2Rad);
    }

    getProjectionMatrix = (gl: WebGLRenderingContext) => {
        const filedOfView = this.FOV * Math.PI / 180;
        const aspect = gl.canvas.width / gl.canvas.height;
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix,
            filedOfView,
            aspect,
            this.zNear,
            this.zFar
        )
        return projectionMatrix;
    }


    getViewMatrix = () => {
        const localToWorldMat = mat4.create();
        mat4.fromRotationTranslation(localToWorldMat, this.rotation, this.position);
        mat4.invert(localToWorldMat, localToWorldMat);
        return localToWorldMat;
    }
}




export default Camera;