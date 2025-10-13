import { StyleSheet, Text, View } from 'react-native';

export default function RedesSociais() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ℹ️ Informações</Text>
      <Text style={styles.text}>📞 Telefone: (21) 99999-9999</Text>
      <Text style={styles.text}>📧 Email: contato@radiomaravilha.com</Text>
      <Text style={styles.text}>📍 Endereço: Rua das Flores, 123 - Rio de Janeiro</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FF8000', marginBottom: 20 },
  text: { fontSize: 16, color: '#333', marginBottom: 8 },
  button: {
    backgroundColor: '#FF8000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
