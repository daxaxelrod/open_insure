import { useLoader, useThree } from "@react-three/fiber";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { AudioLoader, PositionalAudio, AudioListener } from "three";

export default forwardRef(function SpacialAudio(
    {
        url,
        refDistance,
    }: {
        url: string;
        refDistance: number;
    },
    ref
) {
    const sound = useRef<PositionalAudio | null>(null);
    const { camera } = useThree();
    const [listener] = useState(() => new AudioListener());
    const buffer = useLoader(AudioLoader, url);

    const playSound = () => {
        if (sound.current) {
            if (sound.current.isPlaying) {
                sound.current.stop();
            }
            sound.current.setBuffer(buffer);
            sound.current.setRefDistance(refDistance > 0 ? refDistance : 1);
            sound.current.setLoop(false);
            sound.current.play();
        }
    };

    useImperativeHandle(ref, () => ({
        playSound,
    }));

    useEffect(() => {
        camera.add(listener);
        return () => {
            camera.remove(listener);
        };
    }, []);

    return <positionalAudio ref={sound} args={[listener]} />;
});
