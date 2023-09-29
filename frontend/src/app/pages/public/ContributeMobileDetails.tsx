import React, { useEffect } from "react";
import PolicyLineStats from "../../components/users/guesses/stats/PolicyLineStats";
import { useNavigate } from "react-router-dom";
import { PolicyLineStats as PolicyLineStatsType } from "../../../redux/reducers/types/actuaryTypes";
import { useAppSelector } from "../../../redux/hooks";

export default function ContributeMobileDetails() {
    const navigate = useNavigate();

    const getStatsPending = useAppSelector(
        (state) => state.actuary.getPolicyLineStatsPending
    );

    const stats: PolicyLineStatsType = useAppSelector(
        (state) => state.actuary.activePolicyLineStats
    );

    useEffect(() => {
        setTimeout(() => {
            if (!stats && !getStatsPending) {
                navigate("/contribute");
            }
        }, 3000);
    }, []);

    return <PolicyLineStats isOnSecondStep={true} />;
}
