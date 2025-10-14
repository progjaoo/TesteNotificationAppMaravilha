import { ScrollView, StyleSheet, Text } from 'react-native';

export default function SobreNos() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sobre Nós</Text>
      <Text style={styles.text}>
        • Somos a Rádio Maravilha{'\n'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FF8000', marginBottom: 10 },
  text: { fontSize: 16, color: '#333', lineHeight: 22 },
});
