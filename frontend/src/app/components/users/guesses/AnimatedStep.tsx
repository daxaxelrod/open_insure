import { motion, Variants } from "framer-motion";
import React, { FC, useEffect } from "react";
import { useWizard } from "react-use-wizard";

const variants: Variants = {
    enter: (direction: number) => {
        return {
            y: direction > 0 ? 40 : -40,
            opacity: 0,
        };
    },
    center: {
        zIndex: 1,
        y: 0,
        opacity: 1,
    },
    exit: (direction: number) => {
        return {
            zIndex: 0,
            y: direction < 0 ? 40 : -40,
            opacity: 0,
        };
    },
};

type Props = {
    children?: React.ReactNode;
    previousStep: React.MutableRefObject<number>;
};

const AnimatedStep: FC<Props> = React.memo(
    ({ children, previousStep: previousStepIndex }) => {
        const { activeStep } = useWizard();

        useEffect(() => {
            return () => {
                previousStepIndex.current = activeStep;
            };
        }, [activeStep, previousStepIndex]);

        return (
            <motion.div
                custom={activeStep - previousStepIndex.current}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                }}
            >
                {children}
            </motion.div>
        );
    }
);

export default AnimatedStep;
