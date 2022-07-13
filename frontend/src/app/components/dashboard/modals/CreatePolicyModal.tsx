import React, { Dispatch, SetStateAction } from 'react'
import { Button, Form, Input, Radio, Modal } from 'antd';

export default function CreatePolicyModal({ isVisible, setIsVisible }: { isVisible: boolean, setIsVisible: Dispatch<SetStateAction<boolean>> }) {

  let createPolicyPending = false;
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
        <Form.Item label="Field A">
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item label="Field B">
          <Input placeholder="input placeholder" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
