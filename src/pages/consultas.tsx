import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { consultarPorCpf, listarSorteiosFinalizados } from '../api/consultasService';

export default function Consultas() {
  const [sorteios, setSorteios] = useState<any[]>([]);
  const [cpf, setCpf] = useState('');
  const [meusSorteios, setMeusSorteios] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarSorteios();
  }, []);

  async function carregarSorteios() {
    const data = await listarSorteiosFinalizados();
    setSorteios(data);
    try {
    const data = await listarSorteiosFinalizados();
    setSorteios(data);
    } finally {
      setLoading(false);
    }
  }

  async function buscarPorCpf() {
    if (cpf.length !== 11) {
      Alert.alert('Erro', 'CPF deve conter 11 números');
      return;
    }

    const data = await consultarPorCpf(cpf);

    if (!data.length) {
      Alert.alert('Nenhum resultado', 'Nenhum sorteio encontrado para este CPF');
      return;
    }

    setMeusSorteios(data);
    setModalVisible(true);
  }

  function copiarCodigo(codigo: string) {
    Clipboard.setStringAsync(codigo);
    Alert.alert('Copiado!', 'Código copiado para a área de transferência');
  }
  function formatarCpf(valor: string) {
  return valor
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

  return (

  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
  >
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {loading && (
  <>
          {[1, 2, 3].map((_, i) => (
            <View key={i} style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonContent}>
                <View style={styles.skeletonLine} />
                <View style={styles.skeletonLineSmall} />
                <View style={styles.skeletonLineSmall} />
              </View>
            </View>
          ))}
        </>
      )}
    {!loading && (
      <FlatList
        data={sorteios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
        const translateY = new Animated.Value(20);
        const opacity = new Animated.Value(0);

        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 400,
            delay: index * 80,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 400,
            delay: index * 80,
            useNativeDriver: true,
          }),
        ]).start();

        return (
          <Animated.View
            style={[
              styles.card,
              { opacity, transform: [{ translateY }] },
            ]}
          >
            {/* IMAGEM + FALLBACK */}
            <Image
              source={{
                uri: item.imagem
                  ? item.imagem
                  : 'https://via.placeholder.com/300x300?text=Sorteio',
              }}
              style={styles.cardImage}
              resizeMode="cover"
              onError={() => {}}
            />

            {/* BADGE */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.nome_sorteio}</Text>

              <View style={styles.cardRow}>
                <Ionicons name="calendar-outline" size={14} color="#666" />
                <Text style={styles.cardText}>Data do Sorteio: {new Date(item.data_sorteio).toLocaleDateString('pt-BR')}</Text>
              </View>

              <View style={styles.cardRow}>
                <Ionicons name="trophy-outline" size={14} color="#FF8000" />
                <Text style={styles.cardText}>Ganhador(a): {item.vencedor_nome || '—'}</Text>
              </View>
              <View style={styles.badgeInline}>
              <Text style={styles.badgeText}>FINALIZADO</Text>
            </View>
            </View>
            
          </Animated.View>
        );
      }}

        scrollEnabled={false}
      />
      )}
      <View style={styles.cpfBox}>
        <Text style={styles.subtitle}>Consultar meus números</Text>

        <TextInput
        placeholder="Digite seu CPF"
        keyboardType="numeric"
        value={formatarCpf(cpf)}
        onChangeText={(t) => setCpf(t.replace(/\D/g, ''))}
        maxLength={14}
        style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={buscarPorCpf}>
          <Text style={styles.buttonText}>Consultar</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Meus Sorteios</Text>
            <FlatList
              data={meusSorteios}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.modalCard}>
                  <Text style={{ fontWeight: 'bold' }}>{item.nome_sorteio}</Text>
                  <Text>Data do Sorteio: {new Date(item.data_sorteio).toLocaleDateString('pt-BR')}</Text>

                  <View style={styles.codeRow}>
                    <Text style={styles.code}>Seu Código: {item.codigo_sorteado}</Text>
                    <TouchableOpacity
                      onPress={() => copiarCodigo(item.codigo_sorteado)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                    <Ionicons
                        name="copy-outline"
                        size={22}
                        color="#FF8000"
                    />
                    </TouchableOpacity>

                  </View>
                </View>
              )}
            />

            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  </KeyboardAvoidingView>
);


}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
    card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,

    // Android shadow
    elevation: 6,
  },

  cardImage: {
    width: 90,
    height: '100%',
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
    cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#444',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardContent: {
  flex: 1,
  padding: 12,
  justifyContent: 'center',
  },
  cpfBox: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FF8000',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
    modalCard: {
    marginBottom: 14,
    padding: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#FF8000',
    borderRadius: 10,
    backgroundColor: '#FFF7EF',
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },
  code: {
    fontWeight: 'bold',
  },
  copyButton: {
    backgroundColor: '#FF8000',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  badgeInline: {
  alignSelf: 'flex-start',
  marginTop: 10,
  backgroundColor: '#469536',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 6,
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  skeletonCard: {
  flexDirection: 'row',
  backgroundColor: '#eaeaea',
  borderRadius: 10,
  marginBottom: 12,
  overflow: 'hidden',
  },
  skeletonImage: {
    width: 90,
    height: 80,
    backgroundColor: '#ddd',
  },
  skeletonContent: {
    flex: 1,
    padding: 12,
  },
  skeletonLine: {
    height: 14,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonLineSmall: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginBottom: 6,
  },
});