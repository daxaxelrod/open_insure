import React from 'react'
import { Link } from 'react-router-dom';
import { Typography } from 'antd';

import { Wizard } from 'react-use-wizard';
import EmailPassOnboardingStep from '../components/onboarding/EmailPassOnboardingStep';

const { Paragraph } = Typography;

export default function Home() {
  return (
    <div>
      <div>Register</div>
      <Wizard>
        <EmailPassOnboardingStep />
      </Wizard>
      <Paragraph>Already have an account? <Link to={"/login"}>Log in</Link></Paragraph>

    </div>
  )
}
