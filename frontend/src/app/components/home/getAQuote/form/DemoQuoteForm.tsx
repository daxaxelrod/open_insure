import { Button, Cascader, Form, Input, Radio, Select, Switch } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import React, { useState } from "react";

export default function DemoQuoteForm() {
    const [quote, setQuote] = useState();

    const onFormChange = (changedValues: any, allValues: any) => {};

    return (
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="vertical"
            onValuesChange={onFormChange}
            size={"middle"}
        >
            <Form.Item label="Form Size" name="size">
                <Radio.Group>
                    <Radio.Button value="small">Small</Radio.Button>
                    <Radio.Button value="default">Default</Radio.Button>
                    <Radio.Button value="large">Large</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="Input">
                <Input />
            </Form.Item>
            <Form.Item label="Select">
                <Select>
                    <Select.Option value="demo">Demo</Select.Option>
                </Select>
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
                <Button>Get Quote</Button>
            </Form.Item>
        </Form>
    );
}
