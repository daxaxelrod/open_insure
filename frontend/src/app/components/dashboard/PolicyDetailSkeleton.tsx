import { Alert, Button, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PolicyDetailSkeleton() {
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setShowError(true);
        }, 1500);
    }, []);

    return showError ? (
        <Alert
            message="Can't get policy details"
            showIcon
            description="It might be because you don't have permission to view this policy or the policy doesn't exist"
            type="warning"
            action={
                <Button
                    size="large"
                    type="primary"
                    onClick={() => navigate("/home")}
                >
                    Go home
                </Button>
            }
        />
    ) : (
        <Skeleton />
    );
}
