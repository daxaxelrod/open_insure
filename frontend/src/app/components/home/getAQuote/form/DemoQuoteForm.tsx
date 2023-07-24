import {
    AutoComplete,
    Button,
    Cascader,
    Col,
    Form,
    Input,
    Radio,
    Row,
    Select,
    Switch,
    notification,
} from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import React, { useContext, useState } from "react";
import appleProducts from "../../../../constants/apple/appleProducts";
import { public_getHypotheticalQuote } from "../../../../../networking/premiums";
import { PublicQuoteContext } from "../../../contexts/PublicQuoteContext";
import { CheckOutlined } from "@ant-design/icons";

export default function DemoQuoteForm() {
    const { setQuote } = useContext(PublicQuoteContext);

    const [pending, setPending] = useState(false);
    const [form] = Form.useForm();
    const [appleOptions, setAppleOptions] =
        useState<{ value: string }[]>(appleProducts);
    const [api, contextHolder] = notification.useNotification();

    const onFormChange = (changedValues: any, allValues: any) => {};

    const handleIphoneAutoComplete = (value: string) => {
        let res: { value: string }[] = [];
        if (!value) {
            res = [];
        } else {
            res = appleProducts.filter((product) =>
                product.value.toLowerCase().includes(value.toLowerCase())
            );
        }
        setAppleOptions(res);
    };

    const submitForm = async () => {
        let values = await form.validateFields();
        try {
            let result = await public_getHypotheticalQuote({
                ...values,
                asset_type: "cell_phone",
            });
            if (result.status === 200) {
                setQuote(result.data);
                console.log(result.data);
            }
            setPending(false);
        } catch (error) {
            setPending(false);
            api.error({
                message: "Error",
                description:
                    "There was an issue generating your quote. try getting a quote after you register, that should work",
            });
        }
    };

    const formMakeField = Form.useWatch("make", form);

    return (
        <>
            {contextHolder}

            <Form
                form={form}
                wrapperCol={{ span: 12 }}
                layout="vertical"
                onValuesChange={onFormChange}
                size={"middle"}
                onFinish={submitForm}
                requiredMark={false}
            >
                <Form.Item label="Make" name={"make"}>
                    <Input placeholder="Apple, Samsung" />
                </Form.Item>
                <Form.Item label="Model">
                    {formMakeField?.toLowerCase()?.includes("apple") ? (
                        <AutoComplete
                            onSearch={handleIphoneAutoComplete}
                            placeholder="Search iPhone"
                            options={appleOptions}
                        />
                    ) : (
                        <Input placeholder="Iphone 14, Galaxy S23" required />
                    )}
                </Form.Item>
                <Form.Item
                    label="Condition"
                    name={"condition"}
                    required
                    rules={[
                        {
                            required: true,
                            message: "Condition of the phone required",
                        },
                    ]}
                >
                    <Select showArrow>
                        <Select.Option value={"new"}>Brand New</Select.Option>
                        <Select.Option value={"near_perfect"}>
                            Near Perfect
                        </Select.Option>
                        <Select.Option value={"great"}>Great</Select.Option>
                        <Select.Option value={"good"}>Good</Select.Option>
                        <Select.Option value={"ok"}>Ok</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Market Value"
                    name={"market_value"}
                    rules={[
                        { required: true, message: "Market Value required" },
                    ]}
                >
                    <Input type={"number"} />
                </Form.Item>
                <Row>
                    <Col span={7}>
                        <Form.Item
                            label="Has case"
                            name={"has_case"}
                            valuePropName="checked"
                        >
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={
                                    <div
                                        style={{
                                            color: "#00000000",
                                        }}
                                    >
                                        no
                                    </div>
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Screen protector"
                            name={"has_screen_protector"}
                            valuePropName="checked"
                        >
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={
                                    <div
                                        style={{
                                            color: "#00000000",
                                        }}
                                    >
                                        no
                                    </div>
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button loading={pending} htmlType="submit" type="primary">
                        Get Quote
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
