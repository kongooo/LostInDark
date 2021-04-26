#version 300 es

precision mediump float;

in vec4 v_ABposition;
// in vec2 v_texCoord;
in vec2 v_pos;

//0：正常情况
//-1：B在A上方
//1：A在B上方
in float v_situation; 

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

float cross2(vec2 aVector, vec2 bVector) {
    return aVector.x * bVector.y - aVector.y * bVector.x;
}

float angle(vec2 aVector, vec2 bVector) {
    float theta = acos(dot(aVector, bVector));
    return theta;
}

void main() {
    
    vec2 P = v_pos;
    vec4 color = vec4(0.0);

    vec2 A = vec2(v_ABposition.x, v_ABposition.y);
    vec2 B = vec2(v_ABposition.z, v_ABposition.w);
    vec2 BAvector = normalize(A - B);
    vec2 ABvector = normalize(B - A);
    vec2 PAvector = normalize(A - P);
    vec2 PBvector = normalize(B - P);
    vec2 APvector = reverse(PAvector);
    vec2 BPvector = reverse(PBvector);
    float PO = distance(P, u_lightPos);
    //无遮挡时的光照角度
    float theta = 2.0 * asin(u_lightSize / PO);

    vec4 Atangent = calCircleTangent(u_lightPos, A, u_lightSize);
    vec4 Btangent = calCircleTangent(u_lightPos, B, u_lightSize);
    vec4 Ptangent = calCircleTangent(u_lightPos, P, u_lightSize);
    vec2 AtangentLeft = vec2(Atangent.x, Atangent.y);
    vec2 AtangentRight = vec2(Atangent.z, Atangent.w);
    vec2 BtangentLeft = vec2(Btangent.x, Btangent.y);
    vec2 BtangentRight = vec2(Btangent.z, Btangent.w);
    vec2 PtangentLeft = vec2(Ptangent.x, Ptangent.y);
    vec2 PtangentRight = vec2(Ptangent.z, Ptangent.w);

    vec2 PDvector = reverse(PtangentRight); 
    vec2 PCvector = reverse(PtangentLeft); 

    if(v_situation == 0.0) {

        //完全被遮挡，遮挡率为1
        if(cross2(PAvector, PCvector) <= 0.0 && cross2(PCvector, PDvector) < 0.0 && cross2(PBvector, PDvector) >= 0.0) {
            color = vec4(1.0);
        }
        else if(cross2(PAvector, PCvector) > 0.0) {
            float APD = angle(PAvector, PDvector);
            color = vec4(APD / theta);
        } else if(cross2(PBvector, PDvector) < 0.0) {
            float BPC = angle(PBvector, PCvector);
            color = vec4(BPC / theta);
        }

    }
    //如果A在B上方 
    else if(v_situation == 1.0){

        //如果P在B的阴影中
        if(cross2(BPvector, BtangentLeft) >= 0.0 && cross2(BPvector, BtangentRight) <= 0.0) {
            float ABP = angle(PAvector, PBvector);
            color = vec4(ABP / theta);
            // color = vec4(1.0);
        }
        //如果P在AB的左边 
        else if(cross2(BAvector, BPvector) >= 0.0) {
            float APD = angle(PAvector, PDvector);
            color = vec4(APD / theta);
        }   
        //如果P在B阴影的右边
        else if(cross2(BAvector, BPvector) < 0.0) {
            float APC = angle(PAvector, PCvector);
            color = vec4(APC / theta);
        }

    } 
    //如果B在A上方
    else if(v_situation == -1.0) {

        //如果P在A的阴影中
        if(cross2(APvector, AtangentLeft) >= 0.0 && cross2(BPvector, BtangentRight) <= 0.0) {
            float ABP = angle(PAvector, PBvector);
            color = vec4(ABP / theta);
            // color = vec4(1.0);
        }
        //如果P在AB的左边 
        if(cross2(ABvector, APvector) >= 0.0) {
            float BPD = angle(PBvector, PDvector);
            color = vec4(BPD / theta);
        } 
        // //如果P在A阴影的右边
        else if(cross2(ABvector, APvector) < 0.0) {
            float BPC = angle(PBvector, PCvector);
            color = vec4(BPC / theta);
        }
    }

    //除去障碍物部分
    // if(alpha == 1.0) {
    //     color = vec4(0.0);
    // }

    outPutColor = color;
}