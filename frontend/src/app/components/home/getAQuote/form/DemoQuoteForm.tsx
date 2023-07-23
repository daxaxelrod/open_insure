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
import React, { useContext, useState } from "react";
import appleProducts from "../../../../constants/appleProducts";
import { public_getHypotheticalQuote } from "../../../../../networking/premiums";
import { PublicQuoteContext } from "../../../contexts/PublicQuoteContext";

export default function DemoQuoteForm() {
    const { setQuote } = useContext(PublicQuoteContext);

    const [pending, setPending] = useState(false);
    const [form] = Form.useForm();
    const [appleOptions, setAppleOptions] =
        useState<{ value: string; label: string }[]>(appleProducts);
    const [api, contextHolder] = notification.useNotification();

    const onFormChange = (changedValues: any, allValues: any) => {};

    const handleIphoneAutoComplete = (value: string) => {
        let res: { value: string; label: string }[] = [];
        if (!value) {
            res = [];
        } else {
            res = appleOptions.filter((product) =>
                product.label.toLowerCase().includes(value.toLowerCase())
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
                    <Input placeholder="Apple, Samsung" />
                </Form.Item>
                <Form.Item label="Model">
                    {formMakeField?.toLowerCase()?.includes("apple") ? (
                        <AutoComplete
                            style={{ width: 200 }}
                            placeholder="Search iPhone"
                            options={appleOptions}
                        />
                    ) : (
                        <Input placeholder="Iphone 14, Galaxy S23" />
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
