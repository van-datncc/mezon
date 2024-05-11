import React from 'react';
import { SwitchProps, Switch } from 'react-native';
import { Colors } from '@mezon/mobile-ui';

export const MezonSwitch = (props: SwitchProps) => {
  const {
    value,
    onValueChange
  } = props;

  return (
    <Switch
        {...props}
        value={value}
        trackColor={{false: '#676b73', true: '#5a62f4'}}
        thumbColor={Colors.white}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
    />
  );
};