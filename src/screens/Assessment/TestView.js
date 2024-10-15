import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Layout/Header';
import AssessmentHeader from './AssessmentHeader';
import { useTranslation } from '../../context/LanguageContext';
import {
  getDataFromStorage,
  getLastMatchingData,
} from '../../utils/JsHelper/Helper';
import SubjectBox from '../../components/TestBox.js/SubjectBox.';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
import globalStyles from '../../utils/Helper/Style';
import { useFocusEffect } from '@react-navigation/native';

const instructions = [
  {
    id: 1,
    title: 'instruction1',
  },
  {
    id: 2,
    title: 'instruction2',
  },
  {
    id: 3,
    title: 'instruction3',
  },
  {
    id: 4,
    title: 'instruction4',
  },
  {
    id: 5,
    title: 'instruction5',
  },
];

function mergeDataWithQuestionSet(questionSet, datatest) {
  datatest.forEach((dataItem) => {
    // Find the matching object in questionSet based on IL_UNIQUE_ID and contentId
    const matchingQuestionSetItem = questionSet.find(
      (question) => question.IL_UNIQUE_ID === dataItem.contentId
    );

    // If a match is found, add the properties from datatest to the questionSet item
    if (matchingQuestionSetItem) {
      matchingQuestionSetItem.totalMaxScore = dataItem.totalMaxScore;
      matchingQuestionSetItem.timeSpent = dataItem.timeSpent;
      matchingQuestionSetItem.totalScore = dataItem.totalScore;
      matchingQuestionSetItem.lastAttemptedOn = dataItem.lastAttemptedOn;
      matchingQuestionSetItem.createdOn = dataItem.createdOn;
    }
  });

  return questionSet;
}

const TestView = ({ route }) => {
  const { title } = route.params;
  const { t } = useTranslation();

  const [questionsets, setQuestionsets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [percentage, setPercentage] = useState('');
  const [completedCount, setCompletedCount] = useState(0);

  /*useEffect(() => {
    fetchData();
  }, []);*/

  useFocusEffect(
    useCallback(() => {
      console.log('########## in focus assessments');

      fetchData();
    }, []) // Make sure to include the dependencies
  );

  const fetchData = async () => {
    const data = await getDataFromStorage('QuestionSet');

    const parseData = JSON.parse(data);
    // Extract DO_id from assessmentList (content)

    const uniqueAssessmentsId = [
      ...new Set(parseData?.map((item) => item.IL_UNIQUE_ID)),
    ];

    // Get data of exam if given

    const assessmentStatusData = JSON.parse(
      await getDataFromStorage('assessmentStatusData')
    );

    // console.log(JSON.stringify(assessmentStatusData));
    setStatus(assessmentStatusData?.[0]?.status || 'not_started');
    setPercentage(assessmentStatusData?.[0]?.percentage || '');
    setCompletedCount(assessmentStatusData?.[0]?.assessments.length || 0);
    const datatest = await getLastMatchingData(
      assessmentStatusData,
      uniqueAssessmentsId
    );

    const finalData = mergeDataWithQuestionSet(parseData, datatest);
    setQuestionsets(finalData);
    // console.log(JSON.stringify(finalData));
    setLoading(false);
  };

  return loading ? (
    <ActiveLoading />
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <ScrollView style={{ flex: 1 }}>
        <AssessmentHeader
          testText={title}
          status={status}
          percentage={percentage}
          completedCount={completedCount}
          questionsets={questionsets}
        />
        <View style={styles.container}>
          <Text allowFontScaling={false} style={globalStyles.text}>
            {t('assessment_instructions')}
          </Text>
          {questionsets?.map((item, index) => {
            return (
              <SubjectBox
                key={item?.subject}
                disabled={!item?.lastAttemptedOn}
                name={item?.subject?.[0]?.toUpperCase()}
                data={item}
              />
            );
          })}
          <View style={styles.note}>
            <Text
              allowFontScaling={false}
              style={[globalStyles.text, { fontWeight: '700' }]}
            >
              {t('assessment_note')}
            </Text>
          </View>
          <Text
            allowFontScaling={false}
            style={[
              globalStyles.subHeading,
              { fontWeight: '700', paddingVertical: 20 },
            ]}
          >
            {t('general_instructions')}
          </Text>
          {instructions?.map((item) => {
            return (
              <View key={item.id.toString()} style={styles.itemContainer}>
                <Text allowFontScaling={false} style={styles.bullet}>
                  {'\u2022'}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[globalStyles.subHeading]}
                >
                  {t(item.title)}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

TestView.propTypes = {
  route: PropTypes.any,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 5,
    backgroundColor: '#FBF4E4',
  },
  note: {
    padding: 10,
    backgroundColor: '#FFDEA1',
    borderRadius: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20, // match the padding of container
  },
  bullet: {
    fontSize: 32,
    marginRight: 10,
    color: '#000',
    top: -10,
  },
});

export default TestView;
