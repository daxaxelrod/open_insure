import React from "react";
import { Breadcrumb, Col, Row, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { Policy } from "../../../redux/reducers/commonTypes";
import ClaimCreationForm from "../../components/policies/claims/detail/create/ClaimCreationForm";
import ClaimListErrorBar from "../../components/policies/claims/detail/create/ClaimListErrorBar";
import ClaimCreationHelp from "../../components/policies/claims/detail/create/ClaimCreationHelp";

const { Title } = Typography;

export default function ClaimCreate() {
    const { id } = useParams();
    const policyId = parseInt(id || "");

    const policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find((p: Policy) => p?.id === policyId)
    );

    return (
        <div>
            <Row>
                <Breadcrumb>
                    <Link to={`/policy/${id}`}>
                        <Breadcrumb.Item>
                            <ArrowLeftOutlined /> {policy?.name}
                        </Breadcrumb.Item>
                    </Link>
                </Breadcrumb>
            </Row>
            <Row>
                <Title level={4} style={{ marginTop: ".75rem" }}>
                    Create a claim
                </Title>
            </Row>
            <Row>
                <Col span={14}>
                    <ClaimListErrorBar />
                    <ClaimCreationForm policy={policy} />
                </Col>
                <Col span={8} offset={1}>
                    <ClaimCreationHelp />
                    {/* <div style={{ margin: "1.5rem 0" }}>
                        <div>maybe policy claims history?</div>
                        <div>claim likelehood?</div>
                    </div> */}
                </Col>
            </Row>
        </div>
    );
}
