import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { IconRegistry, Icon } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';

const EyeIcon = ({ setHidden, hidden }) => (
  <TouchableOpacity
    onPress={() => {
      setHidden(!hidden);
    }}
  >
    <Icon name={hidden ? 'eye-off-outline' : 'eye-outline'} />
  </TouchableOpacity>
);

const CustomPasswordTextField = ({
  position = 'static',
  key,
  field,
  control,
  errors = {},
}) => {
  const [hidden, setHidden] = useState(true);
  const { t } = useTranslation();

  return (
    <Controller
      key={key}
      control={control}
      name={field.name}
      render={({ field: { onChange, value, onBlur } }) => (
        <View style={styles.container}>
          <IconRegistry icons={EvaIconsPack} />
          <TextInput
            allowFontScaling={false}
            style={[
              styles.input,
              { position: position },
              { borderColor: errors[field.name] ? 'red' : '#DADADA' },
            ]}
            onBlur={onBlur}
            value={value}
            onChangeText={onChange}
            secureTextEntry={hidden}
            autoCapitalize="none" // Disable auto-capitalization
          />
          <View style={styles.overlap}>
            <Text
              allowFontScaling={false}
              style={[
                styles.text,
                { color: errors[field.name] ? 'red' : '#4D4639' },
              ]}
            >
              {t(field.label)}
            </Text>
          </View>
          <View style={styles.overlap2}>
            <EyeIcon setHidden={setHidden} hidden={hidden} />
          </View>
          {errors[field.name] && (
            <Text
              allowFontScaling={false}
              style={{
                color: 'red',
                alignSelf: 'flex-start',
                marginBottom: 10,
                marginTop: -20,
                fontFamily: 'Poppins-Regular',
              }}
            >
              {errors[field.name].message}
            </Text>
          )}
        </View>
      )}
    />
  );
};

CustomPasswordTextField.propTypes = {
  position: PropTypes.string,
  key: PropTypes.any,
  field: PropTypes.object,
  control: PropTypes.object,
  errors: PropTypes.object,
};

EyeIcon.propTypes = {
  setHidden: PropTypes.func,
  hidden: PropTypes.bool,
};

export default CustomPasswordTextField;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'flex-start',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    height: 55,
    borderRadius: 7,
    borderColor: '#DADADA',
    borderWidth: 1.4,
    color: 'black',
    paddingLeft: 20,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  overlap2: {
    width: 32,
    height: 32,
    // borderColor:'black',
    // borderWidth:2,
    top: 15,
    left: '88%',
    position: 'absolute',
    // top: -76,
    // left: -120,
    backgroundColor: 'white',
  },
  overlap: {
    top: -65,
    left: 13,
    // top: -76,
    // left: -120,
    backgroundColor: 'white',
  },
  text: {
    color: '#4D4639',
    paddingLeft: 2,
    fontFamily: 'Poppins-Regular',
    paddingRight: 2,
  },
});
