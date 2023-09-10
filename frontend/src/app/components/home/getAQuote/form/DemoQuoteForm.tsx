import {
    AutoComplete,
    Button,
    Col,
    Form,
    Input,
    Row,
    Select,
    Switch,
    notification,
} from "antd";
import { useContext, useState } from "react";
import appleProducts from "../../../../constants/apple/appleProducts";
import { public_getHypotheticalQuote } from "../../../../../networking/premiums";
import { PublicQuoteContext } from "../../../contexts/PublicQuoteContext";
import { CheckOutlined } from "@ant-design/icons";
import { RuleObject } from "antd/es/form";
import { StoreValue } from "antd/es/form/interface";
import ReactGA from "react-ga4";

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
                ReactGA.event({
                    category: "Landing",
                    action: "Got a quote",
                    nonInteraction: false,
                });
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

    const marketValueValidator = (
        rule: RuleObject,
        value: StoreValue,
        callback: (error?: string) => void
    ) => {
        try {
            value = Number(value);

            if (value === 0) {
                callback();
                return;
            }
            if (value < 10) {
                callback("Even a broken phone is worth at least $10!");
            } else if (value < 0) {
                callback("The market value cannot be negative.");
            } else if (value > 10000) {
                callback("The market value cannot be greater than $10,000.");
            }
        } catch (error) {
            // Handle errors converting the value to a number.
        }
    };

    return (
        <>
            {contextHolder}

            <Form
                form={form}
                wrapperCol={{ lg: 14, md: 24, sm: 24, xs: 24 }}
                layout="vertical"
                onValuesChange={onFormChange}
                size={"middle"}
                onFinish={submitForm}
                requiredMark={false}
            >
                <Form.Item label="Make" name={"make"}>
                    <Input placeholder="Apple, Samsung" autoFocus />
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
                        {
                            type: "number",
                            validator: marketValueValidator,
                        },
                    ]}
                >
                    <Input type={"number"} />
                </Form.Item>
                <Row>
                    <Col span={7}>
                        <Form.Item
                            label="Case?"
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
                            label="Screen protector?"
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
                        Get sample quote
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
