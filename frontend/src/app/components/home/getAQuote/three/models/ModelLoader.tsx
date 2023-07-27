import { Html, useProgress } from "@react-three/drei";

export default function ModelLoader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div
                style={{
                    minWidth: 120,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 100,
                }}
            >
                {Math.round(progress * 100) / 100}% loaded
            </div>
        </Html>
    );
}
