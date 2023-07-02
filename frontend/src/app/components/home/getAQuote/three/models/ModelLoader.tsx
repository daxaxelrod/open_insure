import { Html, useProgress } from "@react-three/drei";

export default function ModelLoader() {
    const { progress } = useProgress();
    return <Html center>{Math.round(progress * 100) / 100} % loaded</Html>;
}
