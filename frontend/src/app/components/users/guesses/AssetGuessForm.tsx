import React, { useEffect } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { getAvailablePolicyLines } from "../../../../redux/actions/guesses";
import { Wizard } from "react-use-wizard";
import { AnimatePresence } from "framer-motion";
import AnimatedStep from "./AnimatedStep";
import PolicyLineStep from "./PolicyLineStep";
import AssetForm from "./AssetForm";
import LossForm from "./LossForm";

export default function AssetGuessForm() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getAvailablePolicyLines());
    }, []);

    const previousStep = React.useRef<number>(0);

    return (
        <div>
            <AssetGuessFormHeader />

            <Wizard wrapper={<AnimatePresence initial={false} mode="wait" />}>
                <AnimatedStep previousStep={previousStep}>
                    <PolicyLineStep number={1} withCallback={false} />
                </AnimatedStep>
                <AnimatedStep previousStep={previousStep}>
                    <AssetForm />
                </AnimatedStep>
                <AnimatedStep previousStep={previousStep}>
                    <LossForm />
                </AnimatedStep>
            </Wizard>
        </div>
    );
}
