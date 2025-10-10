import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Programacao() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎶 Programação da Semana</Text>

      <View style={styles.card}>
        <Text style={styles.day}>Segunda a Sexta</Text>
        <Text style={styles.text}>06h às 09h — Manhã com William Jorge</Text>
        <Text style={styles.text}>09h às 12h — Tarde Maravilha</Text>
        <Text style={styles.text}>12h às 15h — Programa do Eddie</Text>
        <Text style={styles.text}>15h às 18h — Happy Hour Maravilha</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.day}>Sábado e Domingo</Text>
        <Text style={styles.text}>08h às 12h — Manhã Maravilha</Text>
        <Text style={styles.text}>12h às 18h — Ao Vivo com Gandra</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FF8000', marginBottom: 20 },
  card: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  day: { fontWeight: 'bold', fontSize: 18, color: '#E65100', marginBottom: 6 },
  text: { fontSize: 15, color: '#333', lineHeight: 22 },
});
