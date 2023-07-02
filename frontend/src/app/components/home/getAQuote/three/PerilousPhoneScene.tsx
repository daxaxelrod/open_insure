import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ModelLoader from "./models/ModelLoader";
import CellPhone from "./models/CellPhone";
import Hammer from "./models/Hammer";
import { GizmoHelper, GizmoViewport } from "@react-three/drei";
import * as THREE from "three";
// a scene with the phone at the center.
// when you hover, a hammer appears and smashes the phone with every click.
// each smash should play a sound and shake the camera a bit

export default function PerilousPhoneScene() {
    return (
        <Canvas
            // onCreated={(state) => state.gl.setClearColor("red")}
            style={{
                height: "500px",
            }}
        >
            <gridHelper args={[20, 20, 0xff0000, "teal"]} />

            <Suspense fallback={<ModelLoader />}>
                <CellPhone />
                <Hammer />
            </Suspense>
            <GizmoHelper
                alignment="bottom-right" // widget alignment within scene
                margin={[80, 80]} // widget margins (X, Y)
                onUpdate={() => {}}
                onTarget={() => {
                    return new THREE.Vector3(0, 0, 0);
                }}
            >
                <GizmoViewport
                    axisColors={["red", "green", "blue"]}
                    labelColor="black"
                />
                {/* alternative: <GizmoViewcube /> */}
            </GizmoHelper>

            <ambientLight intensity={10} />
            <pointLight position={[5, 5, 5]} />
            <spotLight position={[10, 10, 10]} angle={0.45} penumbra={1} />
        </Canvas>
    );
}
