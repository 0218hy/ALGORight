import Colors from '@/src/constants/Colors';
import React, { useState } from 'react';
import {
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
  topicTagSlug: 'All',
};

export default function FilterForm() {
  const [formData, setFormData] = useState<FilterFormData>(DEFAULT_FILTERS);

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

  const handleReset = () => {
    setFormData(DEFAULT_FILTERS);
    console.log('Filters reset to defaults:', DEFAULT_FILTERS);
  };

  const handleSubmit = () => {
    console.log('Form Submitted. Current Parameters:', formData);
  };

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
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Filter Problems</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reload</Text>
        </TouchableOpacity>
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
    marginTop: 12,
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
});
