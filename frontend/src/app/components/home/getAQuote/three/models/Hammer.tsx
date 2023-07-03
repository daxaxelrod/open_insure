// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { animated, config, useSpring, useSpringRef } from "@react-spring/three";
import SpacialAudio from "../SpacialAudio";

const Y_OFFSET = 5;

export default function Hammer() {
    const [clicked, setClicked] = useState(false);
    const { scene } = useGLTF("hammer.glb", true, true, (model) => {});
    scene.position.set(0, Y_OFFSET, 5);

    const hammerRef = useRef();
    const audioRef = useRef();
    const audioRef2 = useRef();
    const audioRef3 = useRef();
    const { viewport, mouse, gl } = useThree();
    // const canvasRef = useRef<HTMLCanvasElement>(null);

    // const rotationApi = useSpringRef();
    const rotation = useSpring({
        config: {
            tension: clicked ? 300 : 800,
        },
        from: {
            position: [0, Y_OFFSET, clicked ? 0 : 5],
            rotation: clicked ? [0, 0, 0] : [0.5, 0, 0],
        },
        to: {
            position: [0, Y_OFFSET, clicked ? 5 : 0],
            rotation: clicked ? [0.5, 0, 0] : [0, 0, 0],
        },
        onRest: () => {
            if (clicked) {
                setClicked(false);
            }
        },
    });

    // Update hammer position based on mouse position
    useFrame(() => {
        const hammer = hammerRef.current;

        if (hammer) {
            const hammer = hammerRef.current;
            if (hammer) {
                const { x, y } = mouse;
                const { width, height } = viewport;

                hammer.position.x = x * 3;
                hammer.position.y = y * 5 - Y_OFFSET;
            }
        }
    });

    const smashHammer = () => {
        const hammer = hammerRef.current;
        if (hammer) {
            console.log("smash");

            const audios = [audioRef, audioRef2, audioRef3];
            const randomAudio =
                audios[Math.floor(Math.random() * audios.length)];
            setTimeout(() => {
                randomAudio?.current?.playSound();
            }, 300);
            setClicked(true);
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
        <animated.group ref={hammerRef} receiveShadow {...rotation}>
            <SpacialAudio
                ref={audioRef}
                refDistance={
                    hammerRef.current ? hammerRef.current.position.z : 5
                }
                url={"./audio/338694__natemarler__glass-bottle-break.wav"}
            />
            <SpacialAudio
                ref={audioRef2}
                refDistance={
                    hammerRef.current ? hammerRef.current.position.z : 5
                }
                url={"./audio/221528__unfa__glass-break.wav"}
            />

            <SpacialAudio
                ref={audioRef3}
                refDistance={
                    hammerRef.current ? hammerRef.current.position.z : 5
                }
                url={"./audio/500604__elenzack__breaking-glass_2.wav"}
            />

            <animated.primitive object={scene} />
        </animated.group>
    );
}
