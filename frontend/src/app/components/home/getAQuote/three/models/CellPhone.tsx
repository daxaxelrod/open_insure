//
import React, { useRef } from "react";
import { useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";
export default function CellPhone() {
    const { scene } = useGLTF("iphone.glb", true, true, (model) => {
        // console.log("model", model);
    });
    scene.scale.set(70, 70, 70);
    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);
    const phoneRef = useRef();

    return (
        // @ts-ignore
        <group ref={phoneRef} receiveShadow>
            <primitive object={scene} />
        </group>
    );
}
