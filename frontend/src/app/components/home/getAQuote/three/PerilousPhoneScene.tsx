import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ModelLoader from "./models/ModelLoader";
import CellPhone from "./models/CellPhone";
import Hammer from "./models/Hammer";

// a scene with the phone at the center.
// when you hover, a hammer appears and smashes the phone with every click.
// each smash should play a sound and shake the camera a bit

export default function PerilousPhoneScene() {
    return (
        <>
            <Canvas onCreated={(state) => state.gl.setClearColor("red")}>
                <Suspense fallback={<ModelLoader />}>
                    <CellPhone />
                    <Hammer />
                </Suspense>

                <ambientLight />
                <pointLight position={[10, 10, 10]} />
            </Canvas>
        </>
    );
}
