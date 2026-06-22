
import Colors from '@/src/constants/Colors';
import { fetchLeetcodeFromApi, getLeetcodeQuestionsFromDB, LeetCodeQuestion } from '@/src/lib/queries/challenge';
import { Href, useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type TopicTag = 'All' | 'Sorting';

interface FilterFormData {
  difficulty: Difficulty;
  topicTagSlug: TopicTag;
}

const DEFAULT_FILTERS: FilterFormData = {
  difficulty: 'Easy',
  topicTagSlug: 'Sorting',
};

export default function ChallengeScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<FilterFormData>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState<boolean>(false);
  const [questionsList, setQuestionsList] = useState<LeetCodeQuestion[]>([]);

  // Difficulty
  const [openDifficulty, setOpenDifficulty] = useState(false);
  const [difficultyItems, setDifficultyItems] = useState([
    { label: 'Easy', value: 'Easy' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Hard', value: 'Hard' }
  ]);
  const setDifficultyValue = (callback: any) => {
    setFormData((prev) => ({
      ...prev,
      difficulty: typeof callback === 'function' ? callback(prev.difficulty) : callback,
    }));
  };

  // Tags
  const [openTopic, setOpenTopic] = useState(false);
  const [topicItems, setTopicItems] = useState([
    { label: 'All Tags', value: 'All' },
    { label: 'Sorting', value: 'Sorting' }
  ]);
  const setTopicValue = (callback: any) => {
    setFormData((prev) => ({
      ...prev,
      topicTagSlug: typeof callback === 'function' ? callback(prev.topicTagSlug) : callback,
    }));
  };

  useFocusEffect(
    useCallback(() => {
      handleFilterSubmit();
    }, [formData.difficulty, formData.topicTagSlug])
  );

  const handleFilterSubmit = async () => {
    try {
      setLoading(true);
      const data = await getLeetcodeQuestionsFromDB(formData.difficulty, formData.topicTagSlug);
      setQuestionsList(data);
    } catch (err) {
      Alert.alert("Error", "Failed to retrieve matching challenges.");
    } finally {
      setLoading(false);
    }
  }

  const handleGenerateNew = async () => {
    try {
      setLoading(true);
      const newSlug = await fetchLeetcodeFromApi(formData.difficulty, formData.topicTagSlug);

      if (newSlug) {
        const routePath = `/challenge/${newSlug}` as Href;
        router.push(routePath);
      } else {
        Alert.alert("Not Found", "No questions match this criteria on LeetCode.");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong generating the challenge.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuestion = (slug: string) => {
    const routePath = `/challenge/${slug}` as Href;
    router.push(routePath);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Difficulty */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Difficulty</Text>
        <DropDownPicker
          open={openDifficulty}
          value={formData.difficulty}
          items={difficultyItems}
          setOpen={setOpenDifficulty}
          setValue={setDifficultyValue}
          setItems={setDifficultyItems}
          listMode='SCROLLVIEW'
          zIndex={3000}
          zIndexInverse={1000}
        />
      </View>

      {/* Topic Tag */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Topic Tag</Text>
        <DropDownPicker
          open={openTopic}
          value={formData.topicTagSlug}
          items={topicItems}
          setOpen={setOpenTopic}
          setValue={setTopicValue}
          setItems={setTopicItems}
          listMode='SCROLLVIEW'
          zIndex={2000} // given by document 
          zIndexInverse={2000}
        />

      </View>

      {/* Control Buttons */}
      <View style={styles.actionGroup}>
        <TouchableOpacity style={styles.submitButton} onPress={handleFilterSubmit}>
          <Text style={styles.submitButtonText}>Filter Problems</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={handleGenerateNew}>
          <Text style={styles.resetButtonText}>Generate New</Text>
        </TouchableOpacity>
      </View>

      {/* Question Map */}
      <View style={styles.listWrapper}>
        <Text style={styles.listTitle}>Matching Challenges</Text>

        {questionsList.length === 0 ? (
          <Text style={styles.fallbackText}>No items loaded. Select filters or generate a fresh challenge above.</Text>
        ) : (
          questionsList.map((item, index) => {
            return (
              <TouchableOpacity
                key={item.leetcode_slug + index}
                style={styles.questionListItem}
                onPress={() => handleSelectQuestion(item.leetcode_slug)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.questionTitleText}>{item.title}</Text>
                  <Text style={styles.questionSubtitleText}>
                    {formData.topicTagSlug} • {formData.difficulty}
                  </Text>
                </View>
                <Text style={styles.chevron}>→</Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.potato.background,
    borderRadius: 8,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    color: Colors.potato.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: Colors.potato.background,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#555555',
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    color: Colors.potato.text,
    height: 50,
    width: '100%',
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  submitButton: {
    flex: 2,
    backgroundColor: Colors.potato.darker,
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#3c3c3c',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#555555',
  },
  resetButtonText: {
    color: '#eff0f6',
    fontWeight: 'bold',
    fontSize: 15,
  },
  listWrapper: {
    marginTop: 28,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.potato.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  questionListItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  questionTitleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
  },
  questionSubtitleText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  chevron: {
    fontSize: 18,
    color: '#bbb',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  fallbackText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    marginVertical: 30,
    fontStyle: 'italic',
  }
});
