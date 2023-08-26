import React from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    PerspectiveCamera,
    PresentationControls,
    Text,
} from "@react-three/drei";

import { LossCostByAge } from "../../../../../redux/reducers/types/actuaryTypes";

export default function LossByCountByAgeInteractiveChart({
    data,
}: {
    data: LossCostByAge[];
}) {
    const xMax = Math.max(...data.map((item) => item.average_age_of_loss));
    const yMax = Math.max(...data.map((item) => item.total_value_lost));

    return (
        <Canvas
            orthographic
            camera={{ zoom: 10, position: [0, 0, 100] }}
            style={{ width: "100%", height: 300 }}
        >
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <axesHelper args={[]} />

            {/* X-axis */}
            <mesh position={[xMax / 2, -1, 0]}>
                <boxBufferGeometry args={[xMax, 0.1, 0.1]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <Text
                position={[xMax / 2, -2, 0]}
                fontSize={1}
                color="black"
                anchorX="center"
                anchorY="middle"
            >
                Average Age of Loss
            </Text>

            {/* Y-axis */}
            <mesh position={[-1, yMax / 2, 0]}>
                <boxBufferGeometry args={[0.1, yMax, 0.1]} />
                <meshStandardMaterial color="green" />
            </mesh>
            <Text
                position={[-2, yMax / 2, 0]}
                fontSize={1}
                color="black"
                rotation={[0, 0, -Math.PI / 2]}
            >
                Total Value Lost
            </Text>

            {/* Scatter plot points */}
            {data.map((item, index) => (
                <mesh
                    key={index}
                    position={[
                        item.average_age_of_loss,
                        item.total_value_lost,
                        0,
                    ]}
                >
                    <sphereBufferGeometry args={[1]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
            ))}

            <PresentationControls global />
        </Canvas>
    );
}
