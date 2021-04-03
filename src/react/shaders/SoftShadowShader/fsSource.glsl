#version 300 es

precision mediump float;

in vec4 v_ABposition;
in vec2 v_texCoord;
in vec2 v_pos;

uniform sampler2D u_map;

uniform vec2 u_lightPos;
uniform float u_lightSize;

out vec4 outPutColor;

//顺时针旋转向量某角度
vec2 rotate(vec2 vector, float theta) {
    vec2 normVector = normalize(vector);
    float curTheta = acos(normVector.x);
    if (normVector.y < 0.0) curTheta = -curTheta;
    return vec2(cos(curTheta - theta), sin(curTheta - theta));
}

//向量取反
vec2 reverse(vec2 vector) {
    return vec2(-vector.x, -vector.y);
}

//计算圆外某一点到圆的切线
vec4 calCircleTangent(vec2 circlePos, vec2 point, float radius) {
    vec2 AOVector = circlePos - point;
    float AOdistance = distance(circlePos, point);
    float theta = asin(radius / AOdistance);
    vec2 leftVector = normalize(reverse(rotate(AOVector, -theta)));
    vec2 rightVector = normalize(reverse(rotate(AOVector, theta)));
    return vec4(leftVector, rightVector);
}

float calTheta(vec2 vector) {
    float theta = acos(vector.x);
    if (vector.y < 0.0) theta = -theta;
    else if (vector.y == 0.0 && vector.x < 0.0) theta = -3.1415926;
    return theta;
}

float cross(vec2 aVector, vec2 bVector) {
    return aVector.x * bVector.y - aVector.y * bVector.x;
}

float angle(vec2 aVector, vec2 bVector) {
    return abs(abs(calTheta(aVector)) - abs(calTheta(bVector)));
}

void main() {
    float alpha = texture(u_map, v_texCoord).a;
    vec2 P = v_pos;
    vec4 color = vec4(0.0);

    vec2 A = vec2(v_ABposition.x, v_ABposition.y);
    vec2 B = vec2(v_ABposition.z, v_ABposition.w);
    vec4 Atangent = calCircleTangent(u_lightPos, A, u_lightSize);
    vec4 Btangent = calCircleTangent(u_lightPos, B, u_lightSize);
    vec4 Ptangent = calCircleTangent(u_lightPos, P, u_lightSize);
    vec2 AtangentLeft = vec2(Atangent.x, Atangent.y);
    vec2 AtangentRight = vec2(Atangent.z, Atangent.w);
    vec2 BtangentLeft = vec2(Btangent.x, Btangent.y);
    vec2 BtangentRight = vec2(Btangent.z, Btangent.w);
    vec2 PtangentLeft = vec2(Ptangent.x, Ptangent.y);
    vec2 PtangentRight = vec2(Ptangent.z, Ptangent.w);
    vec2 APvector = P - A;
    vec2 BPvector = P - B;

    float PO = distance(P, u_lightPos);
    //无遮挡时的光照角度
    float theta = 2.0 * asin(u_lightSize / PO);

    vec2 PAvector = normalize(A - P);
    vec2 PBvector = normalize(B - P);

    //完全被遮挡，遮挡率为1
    if(cross(APvector, AtangentLeft) <= 0.0 && cross(BPvector, BtangentRight) >= 0.0) {
        color = vec4(1.0);
    } else if(cross(APvector, AtangentLeft) > 0.0) {
        vec2 PDvector = reverse(PtangentRight); 
        float APD = angle(PAvector, PDvector);
        color = vec4(APD / theta);
    } else if(cross(BPvector, BtangentRight) < 0.0) {
        vec2 PCvector = reverse(PtangentLeft); 
        float BPC = angle(PBvector, PCvector);
        color = vec4(BPC / theta);
    } else if(cross(PAvector, PtangentRight) < 0.0 && cross(PAvector, PtangentLeft) > 0.0 && cross(PBvector, PtangentRight) < 0.0 && cross(PBvector, PtangentLeft) > 0.0) {
        float ABP = angle(PAvector, PBvector);
        color = vec4(ABP / theta);
    }


    //除去障碍物部分
    if(alpha == 0.0) {
        color = vec4(0.0);
    }

    outPutColor = color;
}