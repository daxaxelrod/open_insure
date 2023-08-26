import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
    Billboard,
    OrbitControls,
    PerspectiveCamera,
    PresentationControls,
    Text,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

import { LossCostByAge } from "../../../../../redux/reducers/types/actuaryTypes";

export default function LossByCountByAgeInteractiveChart({
    data,
}: {
    data: LossCostByAge[];
}) {
    const xMax = Math.max(...data.map((item) => item.average_age_of_loss));
    const yMax = Math.max(...data.map((item) => item.total_value_lost));
    const zMax = Math.max(...data.map((item) => item.loss_count));
    const zToXRatio = zMax / xMax;
    const YToXRatio = zMax / yMax;
    const scaledYMax = yMax / YToXRatio;
    const scaledZMax = zMax / zToXRatio;
    const nearClip = 0;
    const farClip = Math.max(xMax, scaledYMax, scaledZMax) * 10;

    return (
        <Canvas
            orthographic
            camera={{
                zoom: 5,
                position: [-zMax, 0, xMax],
                rotation: [-Math.PI / 4, 0, 0],
                near: nearClip,
                far: farClip,
            }}
            style={{ width: "100%", height: 600 }}
        >
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            {/* <axesHelper args={[]} /> */}

            {/* X-axis */}
            <mesh position={[xMax / 2, -1, 0]}>
                <boxBufferGeometry args={[xMax, 1, 1]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <>
                <Text
                    position={[xMax / 2, 5, 0]}
                    fontSize={12}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                >
                    Average Age of Loss
                </Text>
            </>

            {/* Y-axis */}
            <mesh position={[-1, yMax / 2, 0]}>
                <boxBufferGeometry args={[1, yMax, 1]} />
                <meshStandardMaterial color="green" />
            </mesh>
            <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
                <Text
                    position={[6, yMax / 2, 0]}
                    fontSize={12}
                    color="black"
                    rotation={[0, 0, -Math.PI / 2]}
                >
                    Total Value Lost
                </Text>
            </Billboard>

            {/* Z-axis */}
            <mesh position={[-1, -1, scaledZMax / 2]}>
                <boxBufferGeometry args={[1, 1, scaledZMax]} />
                <meshStandardMaterial color="black" />
            </mesh>

            <Text
                position={[-1, 5, scaledZMax / 2]}
                fontSize={12}
                color="black"
                rotation={[0, Math.PI / 2, 0]}
            >
                Loss Count
            </Text>

            {/* Scatter plot points */}
            {data.map((item, index) => (
                <mesh
                    key={index}
                    position={[
                        item.average_age_of_loss,
                        item.total_value_lost,
                        item.loss_count / zToXRatio,
                    ]}
                >
                    <sphereBufferGeometry args={[10]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
            ))}

            <OrbitControls />
        </Canvas>
    );
}
