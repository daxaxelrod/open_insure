import React, { Dispatch, SetStateAction, useState } from 'react'
import { Button, Form, Input, Radio, Modal, Divider, Typography, InputNumber, Select } from 'antd';

const { Title, Paragraph } = Typography;

export default function CreatePolicyModal({ isVisible, setIsVisible }: { isVisible: boolean, setIsVisible: Dispatch<SetStateAction<boolean>> }) {

  let createPolicyPending = false;
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [form] = Form.useForm();
  

  const handleOk = () => {
    
      form
        .validateFields()
        .then(values => {
          // createPod(values);
          // createPolicy(values);
        })
        .catch(info => {
          console.log('Validate Failed:', info);
        });
  }

  const handleCancel = () => {
    setIsVisible(false)
  }

  const onFormChange = ({ }: any) => {
  };



  return (
    <Modal
      title="Create a policy"
      visible={isVisible}
      onOk={handleOk}
      okText="Create"
      confirmLoading={createPolicyPending}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        layout='vertical'
        onValuesChange={onFormChange}>
        <Form.Item label="Form Layout" name="layout">
          <Radio.Group>
            <Radio.Button value="horizontal">Horizontal</Radio.Button>
            <Radio.Button value="vertical">Vertical</Radio.Button>
            <Radio.Button value="inline">Inline</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Policy Name" name="policyName">
          <Input placeholder="Phone Insurance" />
        </Form.Item>
        <Form.Item label="Policy type" name="coverage_type" initialValue={'m_property'}>
          <Select >
            <Select.Option value="m_property">Minor Property</Select.Option>
            <Select.Option value="renters">Renter's Insurance</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Governance Type" name="governance_type" initialValue={'direct_democracy'} hidden>
          <Select>
            <Select.Option value="direct_democracy">Direct Democracy</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Premium pool type" name="premium_pool_type" initialValue={'perpetual_pool'} hidden>
          <Select>
            <Select.Option value="perpetual_pool">Perpetual Pool</Select.Option>
            {/* <Select.Option value="perpetual_pool">Capped Pool</Select.Option> */}
          </Select>
        </Form.Item>

        <Divider />
        <Title level={4}>Advanced Settings</Title>
        <Form.Item label="Maximum number of policy members" tooltip='Leave blank to allow an unlimited number of people to join.'>
          <InputNumber min={2}  />
        </Form.Item>
      </Form>
    </Modal>
  )
}


