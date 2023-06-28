//
import React, { useRef } from "react";
import { useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";
export default function CellPhone() {
    const { scene } = useGLTF("iphone.glb", true, true, (model) => {
        // console.log("model", model);
    });
    const phoneRef = useRef();

    return (
        // @ts-ignore
        <group ref={phoneRef} receiveShadow>
            <primitive object={scene} />
        </group>
    );
}
