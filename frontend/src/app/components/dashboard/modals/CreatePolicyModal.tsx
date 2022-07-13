import React, { Dispatch, SetStateAction } from 'react'
import { Modal } from 'antd'

export default function CreatePolicyModal({ isVisible, setIsVisible } : { isVisible: boolean, setIsVisible: Dispatch<SetStateAction<boolean>> }) {
  
  let createPolicyPending = false;

  const handleOk = () => {
    
  }

  const handleCancel = () => {
    setIsVisible(false)
  }


  return (
    <Modal
      title="Create a policy"
      visible={isVisible}
      onOk={handleOk}
      confirmLoading={createPolicyPending}
      onCancel={handleCancel}
    >
      <p>Some contents...</p>
    </Modal>
  )
}
