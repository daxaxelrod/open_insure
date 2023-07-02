// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
    config,
    useChain,
    useSpringRef,
    useTransition,
} from "@react-spring/three";

export default function Hammer() {
    const [clicked, setClicked] = useState(false);
    const { scene } = useGLTF("hammer.glb", true, true, (model) => {});
    scene.position.set(0, 0, 5);

    const hammerRef = useRef();
    const { viewport, mouse, gl } = useThree();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const rotationApi = useSpringRef();
    const rotation = useTransition(rotationApi, {
        ref: rotationApi,
        config: config.stiff,
        from: { rotation: [0, 0, 0] },
        to: {
            rotation: [0.5, 0, 0],
        },
    });
    const backRotation = useTransition(rotationApi, {
        ref: rotationApi,
        config: config.stiff,
        from: { rotation: [0.5, 0, 0] },
        to: {
            rotation: [0, 0, 0],
        },
    });

    // useChain(
    //     clicked ? [rotation, backRotation] : [backRotation, rotation],
    //     [0, 0.5]
    // );

    // Update hammer position based on mouse position
    useFrame(() => {
        const hammer = hammerRef.current;

        if (hammer) {
            const hammer = hammerRef.current;
            if (hammer) {
                const { x, y } = mouse;
                const { width, height } = viewport;

                hammer.position.x = x * 1.5;
                hammer.position.y = y * 1.5;
            }
            // console.log("hammer", hammer, left, top, width, height);

            // hammer.position.x = mouseX;
            // hammer.position.y = mouseY;
        }
    });

    const smashHammer = () => {
        const hammer = hammerRef.current;
        if (hammer) {
            setClicked(true);
            hammer.rotation.x = hammer.rotation.x === 0.5 ? 0`` : 0.5;
        }
    };

    useEffect(() => {
        // Attach the click event listener to the canvas element
        gl.domElement.addEventListener("click", smashHammer);

        // Clean up the event listener on component unmount
        return () => {
            gl.domElement.removeEventListener("click", smashHammer);
        };
    }, [gl]);

    return (
        // @ts-ignore
        <group ref={hammerRef} receiveShadow>
            <primitive object={scene} />
        </group>
    );
}
