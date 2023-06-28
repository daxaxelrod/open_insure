//
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
export default function Hammer() {
    const { scene } = useGLTF("hammer.glb", true, true, (model) => {
        // console.log("model", model);
    });
    const hammerRef = useRef();

    return (
        // @ts-ignore
        <group ref={hammerRef} receiveShadow>
            <primitive object={scene} />
        </group>
    );
}
