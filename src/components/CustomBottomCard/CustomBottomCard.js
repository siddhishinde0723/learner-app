import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import React from 'react';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import { Layout, Text } from '@ui-kitten/components';
import { useTranslation } from '../../context/LanguageContext';

import GlobalText from "@components/GlobalText/GlobalText";

const CustomBottomCard = ({ onPress }) => {
  //multi language setup
  const { t } = useTranslation();

  return (
    <View>
      <View style={styles.overlap}>
        <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
          <GlobalText
            category="p2"
            style={{
              marginBottom: 10,
              color: '#635E57',
              fontFamily: 'Poppins-Regular',
              textAlign: 'center',
            }}
          >
            {t('language_help')}
          </GlobalText>
          <PrimaryButton onPress={onPress} text={t('continue')}></PrimaryButton>
        </Layout>
      </View>
    </View>
  );
};
CustomBottomCard.propTypes = {
  onPress: PropTypes.func,
};
const styles = StyleSheet.create({
  overlap: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    bottom: 0,
    left: 0,
    right: 0,
    top: 5,
    padding: 5,
  },
});
export default CustomBottomCard;
