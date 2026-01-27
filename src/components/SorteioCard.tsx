import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  nome: string;
  data: string;
  data_final_cadastro: string;
  estado: string;
  imagem?: string;

  // 👉 clique no CARD (abre modal)
  onPressCard: () => void;

  // 👉 clique no BOTÃO (participar)
  onPressParticipar: () => void;

  participando?: boolean;
}

export default function SorteioCard({
  nome,
  data,
  data_final_cadastro,
  estado,
  imagem,
  onPressCard,
  onPressParticipar,
}: Props) {
  const hoje = new Date();
  const dataFinal = new Date(data_final_cadastro);

  hoje.setHours(0, 0, 0, 0);
  dataFinal.setHours(0, 0, 0, 0);

  const isEncerrado = hoje > dataFinal;

  return (
    // 🔥 CARD CLICÁVEL
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPressCard}
      style={styles.card}
    >
      <Image
        source={
          imagem
            ? { uri: imagem }
            : require('@/assets/sorteio-placeholder.png')
        }
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title}>{nome}</Text>

        <Text style={styles.date}>
          Data do Sorteio:{' '}
          {new Date(data).toLocaleDateString('pt-BR')}
        </Text>

        <Text style={styles.dateFinal}>
          Data final de inscrição:{' '}
          {new Date(data_final_cadastro).toLocaleDateString('pt-BR')}
        </Text>

        {isEncerrado && (
          <View style={styles.badgeEncerrado}>
            <Text style={styles.badgeEncerradoText}>
              Inscrições encerradas
            </Text>
          </View>
        )}

        {/* 🔥 BOTÃO ISOLADO (NÃO DISPARA O CARD) */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.button,
            isEncerrado && { backgroundColor: '#BDBDBD' },
          ]}
          onPress={onPressParticipar}
          disabled={isEncerrado}
        >
          <Text style={styles.buttonText}>
            {isEncerrado ? 'Encerrado' : 'Participar do Sorteio'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 10,
    marginLeft: 9,
    marginRight: 9,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  dateFinal: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#FF8000',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  badgeEncerrado: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  badgeEncerradoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
