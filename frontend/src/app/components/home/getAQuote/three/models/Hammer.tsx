// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF, Image } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import SpacialAudio from "../SpacialAudio";
import { Raycaster, Vector3 } from "three";
import ReactGA from "react-ga4";

const Y_OFFSET = 5;

export default function Hammer() {
    const [clicked, setClicked] = useState(false);
    const { scene } = useGLTF("hammer.glb", true, true, (model) => {});
    scene.position.set(0, Y_OFFSET, 5);

    const hammerRef = useRef();
    const audioRef = useRef();
    const audioRef2 = useRef();
    const audioRef3 = useRef();
    const audioRef4 = useRef();
    const audioRef5 = useRef();
    const { viewport, mouse, gl, scene: fullScene } = useThree();
    const [contactPoints, setContactPoints] = useState([]);

    const raycaster = useMemo(() => new Raycaster(), []);

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

                hammer.position.x = x * 10;
                hammer.position.y = y * 10 - Y_OFFSET;
            }
        }
    });

    const smashHammer = () => {
        const hammer = hammerRef.current;
        if (hammer) {
            const tipOfHammer = hammer.position
                .clone()
                .add(new Vector3(0, Y_OFFSET + 4.1, 0));
            raycaster.set(tipOfHammer, new Vector3(0, 0, -1).normalize());

            const intersections = raycaster.intersectObjects(
                fullScene.children.filter(
                    (child) => child.name !== "contact-point"
                )
            );

            if (intersections.length > 0) {
                const audios = [audioRef, audioRef2, audioRef3];
                const randomAudio =
                    audios[Math.floor(Math.random() * audios.length)];
                setTimeout(() => {
                    randomAudio?.current?.playSound();
                }, 200);
                setTimeout(() => {
                    const newTipOfHammer = hammer.position
                        .clone()
                        .add(new Vector3(0, Y_OFFSET + 4.1, 0));

                    setContactPoints((points) =>
                        points.concat(
                            intersections.map((i) =>
                                i.point
                                    .clone()
                                    .add(new Vector3(0, 0, 2))
                                    .sub(tipOfHammer)
                                    .add(newTipOfHammer)
                            )
                        )
                    );
                }, 500);
            } else {
                // play whoosh sound
                const audios = [audioRef4, audioRef5];
                const randomAudio =
                    audios[Math.floor(Math.random() * audios.length)];
                setTimeout(() => {
                    randomAudio?.current?.playSound();
                }, 300);
            }

            ReactGA.event({
                category: "Landing",
                action: "Hammer Smash",
                value: intersections.length > 0 ? 1 : 0,
                nonInteraction: false, // optional, true/false
            });

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
        <>
            <animated.group ref={hammerRef} receiveShadow {...rotation}>
                <SpacialAudio
                    ref={audioRef}
                    refDistance={
                        hammerRef.current
                            ? 5 - Math.abs(hammerRef.current.position.x)
                            : 5
                    }
                    volumeOverride={4}
                    url={"./audio/338694__natemarler__glass-bottle-break.wav"}
                />
                <SpacialAudio
                    ref={audioRef2}
                    refDistance={
                        hammerRef.current
                            ? 5 - Math.abs(hammerRef.current.position.x)
                            : 5
                    }
                    volumeOverride={4}
                    url={"./audio/221528__unfa__glass-break.wav"}
                />

                <SpacialAudio
                    ref={audioRef3}
                    refDistance={
                        hammerRef.current
                            ? 5 - Math.abs(hammerRef.current.position.x)
                            : 5
                    }
                    volumeOverride={4}
                    url={"./audio/500604__elenzack__breaking-glass_2.wav"}
                />

                <SpacialAudio
                    ref={audioRef4}
                    refDistance={
                        hammerRef.current
                            ? 5 - Math.abs(hammerRef.current.position.x)
                            : 5
                    }
                    volumeOverride={55}
                    url={"./audio/whoosh1.wav"}
                />

                <SpacialAudio
                    ref={audioRef5}
                    refDistance={
                        hammerRef.current
                            ? 5 - Math.abs(hammerRef.current.position.x)
                            : 5
                    }
                    volumeOverride={55}
                    url={"./audio/whoosh2.wav"}
                />

                <animated.primitive object={scene} />
            </animated.group>
            {contactPoints.map((point, idx) => (
                <ContactPoint point={point} key={`contact-point-${idx}`} />
            ))}
        </>
    );
}

const ContactPoint = ({ point }) => {
    const randomRotation = useMemo(() => (Math.random() * Math.PI) / 2, []);
    return (
        <mesh name={`contact-point`} position={point}>
            <Image
                scale={2}
                rotation={[0, 0, randomRotation]}
                url="./crackedGlass.png"
                transparent
                opacity={0.8}
            />
            <meshPhongMaterial attach="material" color="white" />
        </mesh>
    );
};
