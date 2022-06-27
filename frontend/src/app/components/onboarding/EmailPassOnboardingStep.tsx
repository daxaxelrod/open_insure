import React from 'react'
import { Button, Checkbox, Form, Input } from 'antd';

import { useWizard } from 'react-use-wizard';
import { useDispatch } from 'react-redux';

export default function EmailPassOnboardingStep({ }) {

  const { handleStep, previousStep, nextStep, isLastStep } = useWizard();
  const dispatch = useDispatch();

  handleStep(() => {
    // when we have multiple steps, this will just be a patch to the user

    alert('Going to step 2');
  });

  return (
    <Form
      name="onboarding-email-form"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={nextStep}
      onFinishFailed={() => {
        console.log("Failed");
      }}
    >
      <Form.Item label="Full Name" style={{ marginBottom: 0 }}>
        <Form.Item
          name="first_name"
          rules={[{ required: true }]}
          style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
        >
          <Input placeholder="First name" />
        </Form.Item>
        <Form.Item
          name="last_name"
          rules={[{ required: true }]}
          style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
        >
          <Input placeholder="Last name" />
        </Form.Item>
      </Form.Item>


      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
      >
        <Input placeholder='email'/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password autoComplete="current-password" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" onClick={ isLastStep ? nextStep}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
