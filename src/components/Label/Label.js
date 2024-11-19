import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../../context/LanguageContext';
import { StyleSheet, Text } from 'react-native';

const Label = ({ text }) => {
  const { t } = useTranslation();

  return (
    <Text allowFontScaling={false} style={styles.text}>
      {t(text)}
    </Text>
  );
};

Label.propTypes = {
  text: PropTypes.string,
};

const styles = StyleSheet.create({
  text: {
    color: '#969088',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});

export default Label;
