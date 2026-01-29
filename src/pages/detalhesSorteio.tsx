import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function DetalhesSorteio() {
  const { id } = useLocalSearchParams();
  const [sorteio, setSorteio] = useState<any>(null);

  useEffect(() => {
    axios
      .get(
        `https://grupogtf.com.br/89fm/apisorteio/sorteios/buscar.php?id=${id}`
      )
      .then((res) => setSorteio(res.data));
  }, []);

  if (!sorteio) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>
        {sorteio.nome_sorteio}
      </Text>
      <Text>{sorteio.descricao}</Text>
      <Text>📅 {sorteio.data_sorteio}</Text>
      <Text>Status: {sorteio.estado}</Text>
    </View>
  );
}