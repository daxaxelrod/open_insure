import React from 'react'
import { Wizard } from 'react-use-wizard';
import EmailPassOnboardingStep from '../components/onboarding/EmailPassOnboardingStep';


export default function Home() {
  return (
    <div>
      <div>Register</div>
      <Wizard>
        <EmailPassOnboardingStep />
        
        
      </Wizard>

    </div>
  )
}
