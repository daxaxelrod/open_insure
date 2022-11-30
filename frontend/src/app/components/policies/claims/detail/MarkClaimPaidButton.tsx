import React from "react";
import { Button, Typography } from "antd";
import { Claim, User } from "../../../../../redux/reducers/commonTypes";
import colors from "../../../../constants/colors";
import { Link } from "react-router-dom";

const { Paragraph } = Typography;

const MarkClaimPaidButton = ({
    claim,
    claimantProfile,
    handleMarkClaimPaid,
}: {
    claim: Claim;
    claimantProfile: User;
    handleMarkClaimPaid: () => void;
}) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "1rem",
                width: "50%",
            }}
        >
            <Paragraph style={{ color: colors.gray7 }}>
                You are the Escrow agent for this policy. The group has marked
                this as paid, you now how permission to send $
                {claim.amount / 100} to{" "}
                <Link to={`/members/${claimantProfile.id}`}>
                    {claimantProfile.first_name} {claimantProfile.last_name}
                </Link>
            </Paragraph>
            <Button type="primary" onClick={handleMarkClaimPaid}>
                Mark claim paid
            </Button>
        </div>
    );
};

export default MarkClaimPaidButton;
