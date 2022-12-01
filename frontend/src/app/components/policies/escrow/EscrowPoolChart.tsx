import React, { useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getPolicyPremiums } from "../../../../redux/actions/premiums";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useParams } from "react-router-dom";
import moment from "moment-timezone";
import { Policy, Premium } from "../../../../redux/reducers/commonTypes";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const projectedBalanceColor = "#69c0ff";
const actualBalanceColor = "#73d13d";

export default function EscrowPoolChart({}) {
    const { id } = useParams();
    const policyId = parseInt(id || "");
    const dispatch = useAppDispatch();
    const premiums = useAppSelector(
        (state) => state.premiums.premiums?.[policyId]
    );
    const getPolicyPremiumsPending = useAppSelector(
        (state) => state.premiums.getPolicyPremiumsPending
    );

    const policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find((p: Policy) => p?.id === policyId)
    );

    let paidPolicyClaims = policy.claims.filter((c) => c.paid_on !== null);

    // todo! Account for paid claims draw

    useEffect(() => {
        if (!premiums && !getPolicyPremiumsPending && policyId) {
            dispatch(getPolicyPremiums(policyId));
        }
    }, [premiums, getPolicyPremiumsPending, policyId]);

    let sortedPremiums =
        premiums?.sort((a: Premium, b: Premium) => {
            return moment(a.due_date).unix() - moment(b.due_date).unix();
        }) || [];

    let premiumsBinnedByDueDate: Record<string, Premium[]> =
        sortedPremiums.reduce((acc: any, premium: Premium) => {
            let dueDate = moment(premium.due_date).format("MMM DD, YYYY");
            let dateKeys = Object.keys(acc);
            if (dateKeys.includes(dueDate)) {
                acc[dueDate].push(premium);
            } else {
                acc[dueDate] = [premium];
            }
            return acc;
        }, {});

    const options = {};

    console.log({ paidPolicyClaims });

    const paidPremiumsPerMonth = Object.keys(premiumsBinnedByDueDate)
        // .filter((date: string) => {
        //     // filter out premiums later than now
        //     let premiumDueDateInQuestion = moment(date, "MMM DD, YYYY")
        //     return premiumDueDateInQuestion.isSameOrBefore(now);
        // })
        .map((date: string, index: number, array) => {
            let paidClaimsInMonth = paidPolicyClaims.filter((c) => {
                return (
                    c.paid_on && moment(c.paid_on).isSame(moment(date), "month")
                );
            });
            let netPaidClaimsInMonth = paidClaimsInMonth.reduce(
                (acc, claim) => {
                    return acc + claim.amount / 100;
                },
                0
            );

            let premiumsOnDueDate = premiumsBinnedByDueDate[date];
            let netPremiumsPaidInMonth = premiumsOnDueDate
                .filter((premium: Premium) => {
                    return premium.paid;
                })
                .reduce((acc: number, premium: Premium) => {
                    return (acc += premium.amount / 100);
                }, 0);
            return netPremiumsPaidInMonth - netPaidClaimsInMonth;
        });

    const cummulativePaidPremiums = paidPremiumsPerMonth.reduce(
        (acc: number[], totalPaidInForMonth: number, index) => {
            let intermediateSum = paidPremiumsPerMonth
                .slice(0, index)
                .reduce((existingAcc: number, val: number) => {
                    return (existingAcc += val);
                }, 0);

            acc.push(intermediateSum + totalPaidInForMonth);
            return acc;
        },
        []
    );

    console.log("cummulativePaidPremiums", cummulativePaidPremiums);

    // paidPolicyClaims;

    const data = {
        labels: Object.keys(premiumsBinnedByDueDate).map((dateStr) => {
            return moment(dateStr, "MMM DD, YYYY").format("MMM 'YY");
        }),
        datasets: [
            {
                id: 1,
                label: "Escrow Balance",
                data: cummulativePaidPremiums,
                backgroundColor: projectedBalanceColor,
                borderColor: projectedBalanceColor,
            },
        ],
    };

    return <Line datasetIdKey="id" data={data} />;
}
