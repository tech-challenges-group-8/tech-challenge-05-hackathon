import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#4B5563',
  },
  link: {
    marginTop: 16,
    fontSize: 14,
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
});

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>MindEase - App</Text>
        <Text style={styles.subtitle}>
          Welcome to the MindEase mobile application!
        </Text>
        <Text style={styles.link}>
          Check out the example screen to see the domain integration in action.
        </Text>
      </View>
    </View>
  );
}
