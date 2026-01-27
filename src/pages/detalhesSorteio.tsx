import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { getSorteioById, Sorteio } from '../api/sorteiosServices';

export default function DetalhesSorteio() {
  const { id } = useLocalSearchParams();
  const [sorteio, setSorteio] = useState<Sorteio | null>(null);

  useEffect(() => {
    if (id) {
      getSorteioById(id as string).then(setSorteio);
    }
  }, [id]);

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