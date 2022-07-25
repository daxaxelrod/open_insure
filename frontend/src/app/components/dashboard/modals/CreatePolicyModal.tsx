import React, { Dispatch, SetStateAction, useState } from 'react'
import { Button, Form, Input,  Modal, Divider, Typography, InputNumber, Select, DatePicker, Space, Checkbox, Row } from 'antd';
import {
  DownSquareOutlined,
  UpSquareOutlined
} from '@ant-design/icons';
import { createPod } from '../../../../redux/actions/pods';
import { useAppDispatch } from '../../../../redux/hooks';
import { createPolicy } from '../../../../redux/actions/policies';
const { Title, Paragraph } = Typography;
const { TextArea } = Input;


export default function CreatePolicyModal({ isVisible, setIsVisible }: { isVisible: boolean, setIsVisible: Dispatch<SetStateAction<boolean>> }) {

  let createPolicyPending = false;
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();


  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        dispatch(createPolicy({
          ...values,
          coverage_start_date: values.coverage_start_date.format(),
          premium_pool_type: 'perpetual_pool',
          governance_type: 'direct_democracy',
        }));
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

  const toggleAdvanced = () => {
    setShowAdvancedSettings(v => !v);
  }




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
        <Form.Item label="Policy Name" name="name" required>
          <Input placeholder="Phone Insurance" />
        </Form.Item>
        <Form.Item label="Description" name="description" required>
          <TextArea placeholder="A group of friends insuring themselves against..." />
        </Form.Item>
        <Form.Item label="Policy type" name="coverage_type" initialValue={'m_property'} required>
          <Select >
            <Select.Option value="m_property">Minor Property</Select.Option>
            <Select.Option value="renters">Renter's Insurance</Select.Option>
          </Select>
        </Form.Item>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Space size={16}>
            <Form.Item label="Coverage start date" name="coverage_start_date" required>
              <DatePicker format={'MMMM Do, YYYY'} />
            </Form.Item>
            <Form.Item label="Coverage length" 
                       tooltip="How long coverage lasts from start date" 
                       required
                       name="coverage_duration" initialValue={12}>
              <InputNumber min={3} max={36} />
            </Form.Item>
          </Space>
        </div>


        <Divider />
        <Row justify='space-between'>
          <Title level={4}>Advanced Settings</Title>
          <div onClick={toggleAdvanced} style={{cursor: 'pointer', padding: '2px 10px',
             display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
            {
              showAdvancedSettings ? <DownSquareOutlined /> : <UpSquareOutlined />
            }
          </div>
        </Row>
        {showAdvancedSettings && (
          <div>
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
            <Form.Item label="Maximum number of policy members"
              name={"max_pod_size"}
              tooltip='Leave blank to allow an unlimited number of people to join.'>
              <InputNumber min={2} />
            </Form.Item>
            <Form.Item label="Allow members to join after policy start"
              name={"allow_joiners_after_policy_start"}
              tooltip='Allow people to join the policy after the start date'>
              <Checkbox />
            </Form.Item>
          </div>
        )}
      </Form>
    </Modal>
  )
}


