import {
    AutoComplete,
    Button,
    Cascader,
    Form,
    Input,
    Radio,
    Select,
    Switch,
    notification,
} from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import React, { useState } from "react";
import appleProducts from "../../../../constants/appleProducts";

export default function DemoQuoteForm() {
    const [quote, setQuote] = useState();
    const [pending, setPending] = useState(false);
    const [form] = Form.useForm();
    const [options, setOptions] = useState<{ value: string; label: string }[]>(
        []
    );
    const [api, contextHolder] = notification.useNotification();

    const onFormChange = (changedValues: any, allValues: any) => {};

    const handleIphoneAutoComplete = (value: string) => {
        let res: { value: string; label: string }[] = [];
        if (!value) {
            res = [];
        } else {
            res = ["gmail.com", "163.com", "qq.com"].map((domain) => ({
                value,
                label: `${value}@${domain}`,
            }));
        }
        setOptions(res);
    };

    const submitForm = async () => {
        let values = await form.validateFields();
        try {
            let result = await getHypotheticalQuote({
                ...values,
                asset_type: "cell_phone",
            });
            if (result.status === 200) {
                setQuote(result.data);
                setPending(false);
                console.log(result.data);
            }
        } catch (error) {
            api.error({
                message: "Error",
                description: "Waitlist is full, check back in a few days",
            });
        }
    };

    const formMakeField = Form.useWatch("make", form);

    return (
        <>
            {contextHolder}

            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="vertical"
                onValuesChange={onFormChange}
                size={"middle"}
                onFinish={submitForm}
            >
                <Form.Item label="Make" name={"make"}>
                    <Input placeholder="Apple" />
                </Form.Item>
                <Form.Item label="Model">
                    {formMakeField?.toLowerCase()?.includes("apple") ? (
                        <AutoComplete
                            style={{ width: 200 }}
                            onSearch={handleIphoneAutoComplete}
                            placeholder="Enter Iphone"
                            options={appleProducts}
                        />
                    ) : (
                        <Select>
                            <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Cascader">
                    <Cascader
                        options={[
                            {
                                value: "zhejiang",
                                label: "Zhejiang",
                                children: [
                                    { value: "hangzhou", label: "Hangzhou" },
                                ],
                            },
                        ]}
                    />
                </Form.Item>
                <Form.Item label="Switch" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item label="Button">
                    <Button loading={pending} htmlType="submit" type="primary">
                        Get Quote
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
