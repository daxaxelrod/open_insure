import React from "react";
import { InviteData } from "../../../redux/reducers/commonTypes";
import { Alert, Avatar } from "antd";
import { getUserPhotoUrl } from "../policies/utils/photoUtils";

export default function PublicInviteTokenBanner({
    inviteData,
}: {
    inviteData: InviteData;
}) {
    return (
        <Alert
            style={{ marginBottom: 16 }}
            message={
                <div>
                    {inviteData?.invitor?.picture ? (
                        <Avatar
                            src={getUserPhotoUrl(inviteData?.invitor?.picture)}
                            alt={inviteData?.invitor?.first_name}
                            style={{ marginRight: 8 }}
                        />
                    ) : null}
                    {inviteData?.invitor?.first_name} has invited you to join{" "}
                    {inviteData?.pod?.name}
                </div>
            }
            description="Sign up to view more details about this policy."
            type="success"
        />
    );
}
