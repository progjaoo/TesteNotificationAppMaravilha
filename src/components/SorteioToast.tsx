import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface Props {
  nome: string
  descricao: string
  onClose?: () => void
}

export function SorteioToast({ nome, descricao, onClose }: Props) {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{nome}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {descricao}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/sorteios')}
        >
          <Text style={styles.buttonText}>PARTICIPE</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 999,
  },
  content: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
})
