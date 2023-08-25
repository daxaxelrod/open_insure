import React from "react";
import styled from "styled-components";

const Overlay = styled.div<{ blur: number }>((props) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 10,

    background: "rgba(255, 255, 255, 0.16)",
    borderRadius: 16,
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: `blur(${props.blur}px)`,
    border: "1px solid rgba(255, 255, 255, 0.39)",
}));

export default function GlassOverlay({ blur = 9 }: { blur?: number }) {
    return <Overlay blur={blur} />;
}
