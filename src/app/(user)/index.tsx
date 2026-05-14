
import users from '@/assets/data/users';
import { Text, View } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

const user = users[0];

export default function HomePage() {
  const router = useRouter();

  if (!user) {
    return <Text>User not found</Text>;
  }


  return (
    <ScrollView contentContainerStyle={styles.screenView} showsVerticalScrollIndicator={false}>
      {/* App Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.appName}>ALGORight</Text>
        <Pressable onPress={() => router.replace('../(auth)/sign-in')}>
          <Ionicons name="log-out-outline" size={24} color={Colors.potato.text} />
        </Pressable>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Text style={styles.name}> {user.name} </Text>
        <View style={styles.rowContainer}>
          <Text style={styles.value}> Ex: {user.xp}</Text>
          <Text style={styles.value}> Level: {user.level}</Text>
        </View>
      </View>

      {/* Navigation Menu */}
      <View style={styles.gridContainer}>
        <Pressable
          style={({ pressed }) => [styles.navCard, pressed && styles.cardPressed]}
          onPress={() => router.navigate("./visualizer")}>
          <Text style={styles.navCardText}> Algorithm Visualizer </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navCard, pressed && styles.cardPressed]}
          onPress={() => console.log("pressed")}>
          <Text style={styles.navCardText}> Learning </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navCard, pressed && styles.cardPressed]}
          onPress={() => console.log("pressed")}>
          <Text style={styles.navCardText}> Daily Quiz </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navCard, pressed && styles.cardPressed]}
          onPress={() => console.log("pressed")}>
          <Text style={styles.navCardText}> Challenges </Text>
        </Pressable>

      </View>
    </ScrollView>

  );

}

const styles = StyleSheet.create({
  screenView: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.potato.text,
  },
  profileCard: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: Colors.potato.background,
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: Colors.potato.darker,
  },
  value: {
    color: Colors.potato.darker,
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 'auto',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'transparent',
  },
  navCard: {
    backgroundColor: Colors.potato.background,
    width: '48%',
    height: 85,
    borderRadius: 15,
    marginVertical: 5,          // Distinct vertical margin spacing between grid rows
    alignItems: 'center',       // Centers wording dead-center horizontally
    justifyContent: 'center',   // Centers wording dead-center vertically
    paddingHorizontal: 12,      // Safe zone padding if text wraps into two lines

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.8,
  },
  navCardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.potato.darker,
    textAlign: 'center',
  },
});
