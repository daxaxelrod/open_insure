import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import ModelLoader from "./models/ModelLoader";
import CellPhone from "./models/CellPhone";
import Hammer from "./models/Hammer";
import HitMeButton from "./HitMeButton";
import useIsTouchDevice from "../../../hooks/useIsTouchDevice";

// a scene with the phone at the center.
// when you hover, a hammer appears and smashes the phone with every click.
// each smash should play a sound and shake the camera a bit

export default function PerilousPhoneScene() {
    const [interacted, setInteracted] = useState(false);

    return (
        <Canvas
            style={{
                height: "650px",
            }}
            onMouseEnter={() => {
                if (!interacted) setInteracted(true);
            }}
            onTouchStartCapture={() => {
                if (!interacted) setInteracted(true);
            }}
            camera={{ position: [0, 0, 20] }}
        >
            <Suspense fallback={<ModelLoader />}>
                <CellPhone />
                <Hammer />
            </Suspense>
            {!interacted && <HitMeButton />}

            <ambientLight intensity={5} />
            <pointLight position={[5, 5, -5]} />
            <pointLight position={[5, 5, 3]} />
            <pointLight position={[-5, 5, 3]} />
            <spotLight position={[0, -10, 100]} penumbra={1} intensity={0.03} />
        </Canvas>
    );
}
