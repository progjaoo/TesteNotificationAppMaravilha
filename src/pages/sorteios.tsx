import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getSorteios, Sorteio } from '../api/sorteiosServices';
import SorteioCard from '../components/SorteioCard';

export default function Sorteios() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [sorteios, setSorteios] = useState<Sorteio[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [sorteioSelecionado, setSorteioSelecionado] =
    useState<Sorteio | null>(null);

  const carregarSorteios = async () => {
    try {
      setLoading(true);
      const data = await getSorteios();
      setSorteios(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os sorteios');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarSorteios();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      carregarSorteios();
    }, [])
  );

  if (loading) {
    return (
      <ScrollView style={{ padding: 16 }}>
        {[1, 2, 3].map((_, i) => (
          <View
            key={i}
            style={{
              height: 120,
              backgroundColor: '#eaeaea',
              borderRadius: 12,
              marginBottom: 12,
            }}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF8000']}
          />
        }
        contentContainerStyle={{ padding: 5 }}
      >
        {sorteios.map((sorteio) => (
          <SorteioCard
            key={sorteio.id}
            nome={sorteio.nome_sorteio}
            data={sorteio.data_sorteio}
            data_final_cadastro={sorteio.data_final_cadastro}
            estado={sorteio.estado}
            imagem={sorteio.imagem}

            onPressCard={() => {
              setSorteioSelecionado(sorteio);
              setModalVisible(true);
            }}

            onPressParticipar={() => {
              const hoje = new Date();
              const dataFinal = new Date(sorteio.data_final_cadastro);

              hoje.setHours(0, 0, 0, 0);
              dataFinal.setHours(0, 0, 0, 0);

              if (hoje > dataFinal) {
                Alert.alert(
                  'Inscrições encerradas',
                  'Este sorteio não aceita mais inscrições.'
                );
                return;
              }

              router.push({
                pathname: '/cadastroParticipante',
                params: { sorteioId: sorteio.id },
              });
            }}
          />
        ))}
      </ScrollView>

      {/* ================= MODAL / BOTTOM SHEET ================= */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContent}
          >
            <View style={styles.handle} />

            <Text style={styles.modalTitle}>
              {sorteioSelecionado?.nome_sorteio}
            </Text>

            <View style={styles.infoItem}>
              <Ionicons name="document-text-outline" size={22} color="#000" />
              <Text style={styles.infoText}>
                {sorteioSelecionado?.descricao}
              </Text>
            </View>


            <View style={styles.infoItem}>
              <Ionicons name="gift-outline" size={22} color="#000" />
              <Text style={styles.infoText}>
                Sorteio em:{' '}
                {sorteioSelecionado &&
                  new Date(
                    sorteioSelecionado.data_sorteio
                  ).toLocaleDateString('pt-BR')}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={22} color="#000" />
              <Text style={styles.infoText}>
                Inscrições até:{' '}
                {sorteioSelecionado &&
                  new Date(
                    sorteioSelecionado.data_final_cadastro
                  ).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  infoItem: {
  marginTop: 6,
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 10,
  marginBottom: 14,
  paddingHorizontal: 6,
},

infoIcon: {
  fontSize: 20,
  marginTop: 2,
},

infoText: {

  flex: 1,
  fontSize: 16,
  color: '#444',
  lineHeight: 22,
},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    minHeight: '28%',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalTitleDesc: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
    color: '#555',
  },
  modalText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 6,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FF8000',
    paddingVertical: 12,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
});
