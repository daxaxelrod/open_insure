import React from 'react'
import { CoverageTypes } from '../../../../redux/reducers/commonTypes'
import {ReactComponent as modern_design} from '../../../../assets/images/policy-icons/undraw_modern_design_re_dlp8.svg';
import {ReactComponent as apartment_rent} from '../../../../assets/images/policy-icons/undraw_apartment_rent_o-0-ut.svg';
import {ReactComponent as around_the_world} from '../../../../assets/images/policy-icons/undraw_around_the_world_re_rb1p.svg';
import {ReactComponent as dog_walking} from '../../../../assets/images/policy-icons/undraw_dog_walking_re_l61p.svg';


const images = {
    'm_property': modern_design,
    'renters': apartment_rent,
    'travel': around_the_world,
    'pet_care': dog_walking
    // undraw_apartment_rent_o-0-ut.svg
    // undraw_dog_walking_re_l61p.svg
    // undraw_modern_design_re_dlp8.svg
    // undraw_send_gift_re_t5ni.svg
    // undraw_around_the_world_re_rb1p.svg
    // undraw_home_settings_re_pkya.svg
    // undraw_my_password_re_ydq7.svg
    // undraw_special_event_-4-aj8.svg
} 

export default function PolicyIcon({ type } : { type: CoverageTypes }) {

    let Component = images[type];
  return (
    
        <div style={{height: 140, width: 120}}>
            <Component style={{height: 140, width: "100%"}}/>
        </div>
    
  )
}
