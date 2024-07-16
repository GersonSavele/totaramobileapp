/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import { ThemeContext } from '@totara/theme';
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';

import { ButtonIndicator } from './components/Indicator';
import { Title } from './components/Title';
import { getButtonStyles } from './styles';
import type { ButtonProps } from './types';

const Button = ({ children, text, icon, style, mode, variant, ...rest }: ButtonProps) => {
  const theme = useContext(ThemeContext);
  const disabledModes = ['loading', 'disabled'] as const;
  const disabled = disabledModes.includes(mode);

  const styles = getButtonStyles({ variant, disabled, theme });

  return (
    <TouchableOpacity {...rest} style={[styles[variant ?? 'primary'], style]} disabled={disabled}>
      {text ? <Title mode={mode} text={text} style={styles.title} /> : <>{children}</>}
      <ButtonIndicator mode={mode} icon={icon} color={theme.colorText} size={theme.textSmall.fontSize} />
    </TouchableOpacity>
  );
};

export default Button;
