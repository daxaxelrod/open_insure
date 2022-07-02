import React from 'react'
import { Button, Checkbox, Form, Input } from 'antd';

import { useWizard } from 'react-use-wizard';
import { register } from '../../../redux/actions/onboarding';
import { useAppDispatch } from '../../../redux/hooks';

export default function EmailPassOnboardingStep({ }) {

  const { handleStep, previousStep, nextStep, isLastStep } = useWizard();
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();
  const firstName = Form.useWatch('firstName', form);
  const lastName = Form.useWatch('lastName', form);
  const email = Form.useWatch('email', form);
  const password = Form.useWatch('password', form);



  handleStep(() => {
    // when we have multiple steps, this will just be a patch to the user
    alert('Going to step 2');
  });  



  const createUser = () => {
    dispatch(register({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    }));
  }
  

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
          name="firstName"
          rules={[{ required: true }]}
          style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
        >
          <Input placeholder="First name" />
        </Form.Item>
        <Form.Item
          name="lastName"
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
        <Button type="primary" onClick={isLastStep ? createUser : nextStep}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
