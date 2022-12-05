import React from "react";
import { Typography } from "antd";
import { User } from "../../../../../redux/reducers/commonTypes";
import colors from "../../../../constants/colors";
import { Link } from "react-router-dom";
import { getUserPhotoUrl } from "../../utils/photoUtils";

const Paragraph = Typography.Paragraph;

export default function ClaimantShortDisplay({
    claimant, // the actual profile
    linkToProfile = false,
    smallTextSize = false,
}: {
    claimant?: User;
    linkToProfile?: boolean;
    smallTextSize?: boolean;
}) {
    return (
        <Paragraph
            style={{
                color: colors.gray8,
                fontSize: smallTextSize ? ".9rem" : "1.2rem",
                marginBottom: ".5rem",
            }}
        >
            {claimant?.picture ? (
                <img
                    src={getUserPhotoUrl(claimant?.picture)}
                    style={{
                        height: 25,
                        width: 25,
                        borderRadius: 15,
                        marginRight: 5,
                    }}
                    alt="user avatar"
                />
            ) : null}
            {linkToProfile ? (
                <Link to={`/members/${claimant?.id}`}>
                    {claimant?.first_name} {claimant?.last_name?.slice(0, 1)}
                </Link>
            ) : (
                `${claimant?.first_name} ${claimant?.last_name?.slice(0, 1)}`
            )}
        </Paragraph>
    );
}
