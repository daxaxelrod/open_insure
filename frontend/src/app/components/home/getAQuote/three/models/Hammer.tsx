// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

export default function Hammer() {
    const { scene } = useGLTF("hammer.glb", true, true, (model) => {});

    const hammerRef = useRef();
    const { viewport, mouse } = useThree();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    scene.scale.set(0.4, 0.4, 0.4);

    // Update hammer position based on mouse position
    useFrame(() => {
        const hammer = hammerRef.current;
        if (hammer) {
            const hammer = hammerRef.current;
            if (hammer) {
                const { x, y } = mouse;
                const { width, height } = viewport;
                const mouseX = (x / width) * 2 - 1;
                const mouseY = -(y / height) * 2 + 1;
                hammer.position.x = -x;
                hammer.position.y = y;
            }
            // console.log("hammer", hammer, left, top, width, height);

            // hammer.position.x = mouseX;
            // hammer.position.y = mouseY;
        }
    });

    return (
        // @ts-ignore
        <group ref={hammerRef} receiveShadow>
            <primitive object={scene} />
        </group>
    );
}
