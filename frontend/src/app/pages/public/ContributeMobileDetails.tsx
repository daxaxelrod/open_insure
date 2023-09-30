import React, { useEffect } from "react";
import PolicyLineStats from "../../components/users/guesses/stats/PolicyLineStats";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { Button } from "antd";

export default function ContributeMobileDetails() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const getStatsPending = useAppSelector(
        (state) => state.actuary.getPolicyLineStatsPending
    );

    const activeGuess = useAppSelector(
        (state) => state.actuary.activePropertyLifeDatePoint
    );

    const hasContributed = !!activeGuess;

    useEffect(() => {
        setTimeout(() => {
            if (!hasContributed && !getStatsPending) {
                navigate("/contribute");
            }
        }, 3000);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <PolicyLineStats isOnSecondStep={true} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    justifyContent: "center",
                }}
            >
                <Button
                    style={{
                        margin: "2rem 16px",
                    }}
                    type="primary"
                    onClick={() => {
                        navigate("/join");
                    }}
                >
                    Join
                </Button>
            </div>
        </>
    );
}
