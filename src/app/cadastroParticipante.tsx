import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { inscreverNoSorteio } from '../api/inscricoesService';
import { cadastrarParticipante } from '../api/participantesService';
import { validarCPF } from '../utils/validarCpf';
export default function CadastroParticipante() {
  const { sorteioId } = useLocalSearchParams();
  const router = useRouter();

  const [loadingCep, setLoadingCep] = useState(false);

  const [form, setForm] = useState({
    nome_completo: '',
    email: '',
    telefone: '',
    cpf: '',
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: '',
    numero: ''
  });
  const formatarCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };
  const formatarTelefone = (value: string) => {
    const numeros = value.replace(/\D/g, '');

    if (numeros.length <= 10) {
      return numeros
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }

    return numeros
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };
  const handleCepChange = async (value: string) => {
  const masked = value.replace(/\D/g, '');

  setForm(prev => ({ ...prev, cep: masked }));

  if (masked.length === 8) {
    setLoadingCep(true);

    const endereco = await buscarEnderecoPorCep(masked);

    if (!endereco) {
      Alert.alert('CEP inválido', 'Não foi possível localizar o endereço.');
      setLoadingCep(false);
      return;
    }

    setForm(prev => ({
      ...prev,
      logradouro: endereco.logradouro,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado
    }));

    setLoadingCep(false);
  }
};

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };
  //FUNCOES
    const validarFormulario = () => {
    if (
        !form.nome_completo ||
        !form.email ||
        !form.telefone ||
        !form.cpf ||
        !form.cep ||
        !form.logradouro ||
        !form.bairro ||
        !form.cidade ||
        !form.estado ||
        !form.numero
    ) {
        Alert.alert('Erro', 'Preencha todos os campos');
        return false;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
        Alert.alert('Erro', 'Email inválido');
        return false;
    }
    if (form.telefone.length < 10) {
        Alert.alert('Erro', 'Telefone inválido');
        return false;
    }
    if (!validarCPF(form.cpf)) {
      Alert.alert('Erro', 'CPF inválido');
      return false;
    }

    return true;
    };
    async function buscarEnderecoPorCep(cep: string) {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) return null;

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data.erro) return null;

    return {
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
    };
  }

  const handleCadastrar = async () => {
    const cpfNumeros = form.cpf.replace(/\D/g, '');

    if (!validarFormulario()) return;
    try {
        const participante = await cadastrarParticipante({
            nome_completo: form.nome_completo,
            telefone: form.telefone,
            email: form.email,
            cpf: cpfNumeros,
            cep: form.cep,
            logradouro: form.logradouro,
            bairro: form.bairro,
            cidade: form.cidade,
            estado: form.estado,
            numero: form.numero,
        });

        if (!participante?.id) {
        throw new Error('ID do participante não retornado');
        }

        await inscreverNoSorteio(
        participante.id,
        Number(sorteioId)
        );
        
        await AsyncStorage.setItem(
        'participante',
        JSON.stringify({
            id: participante.id,
            email: form.email,
            telefone: form.telefone,
            cpf: form.cpf,
            cep: form.cep,
            logradouro: form.logradouro,
            bairro: form.bairro,
            cidade: form.cidade,
            estado: form.estado,
            numero: form.numero
        })
        );

        setForm({
        nome_completo: '',
        email: '',
        telefone: '',
        cpf: '',
        cep: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: '',
        numero: ''
        });

        Alert.alert('Sucesso', 'Você está participando do sorteio!');

        router.replace('/47');

        } catch (error: any) {

        const status = error?.response?.status;
        const apiErro = error?.response?.data?.erro;

        if (status === 403 && apiErro === 'INSCRICOES_ENCERRADAS') {
          Alert.alert(
            'Inscrições encerradas',
            'O período de inscrições para este sorteio já foi finalizado.'
          );
          router.back();
          return;
        }
        // CPF já cadastrado
        if (status === 409 && apiErro === 'CPF_JA_CADASTRADO') {
          Alert.alert(
            'CPF já cadastrado',
            'Este CPF já pertence a outro participante. Caso seja você, utilize o mesmo email.'
          );
          return;
        }

        // Já inscrito
        if (status === 409) {
          Alert.alert(
            'Aviso',
            'Você já está participando deste sorteio.'
          );
          router.replace('/47');
          return;
        }

        console.error('Erro cadastro:', error?.response?.data || error);

        Alert.alert(
          'Erro',
          'Não foi possível concluir a inscrição. Tente novamente.'
        );
      }

    };

  return (
    <KeyboardAwareScrollView keyboardDismissMode='interactive' 
    contentContainerStyle={{ flexGrow: 1 }} 
    enableOnAndroid={true} extraScrollHeight={150} 
    enableAutomaticScroll={false}> 
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' }}>
          Cadastro para o Sorteio
        </Text>

        <TextInput
          placeholder="Nome completo"
          value={form.nome_completo}
          onChangeText={(v) => handleChange('nome_completo', v)}
          style={styles.inputStyle}
        />

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(v) => handleChange('email', v)}
          style={styles.inputStyle}
        />

        <TextInput
          placeholder="Telefone"
          keyboardType="phone-pad"
          value={form.telefone}
          onChangeText={(v) => handleChange('telefone', formatarTelefone(v))}
          maxLength={15}
          style={styles.inputStyle}
        />
        
        <TextInput
          placeholder="CPF"
          keyboardType="numeric"
          value={form.cpf}
          onChangeText={(v) => handleChange('cpf', formatarCpf(v))}
          maxLength={14}
          style={styles.inputStyle}
        />

        <TextInput
          placeholder="CEP"
          keyboardType="numeric"
          maxLength={8}
          value={form.cep}
          onChangeText={handleCepChange}
          style={styles.input}
        />

        {loadingCep && <ActivityIndicator color="#FF8000" />}

        <TextInput
          placeholder="Endereço"
          value={form.logradouro}
          editable={false}
          style={[styles.input, styles.disabled]}
        />

        <TextInput
          placeholder="Bairro"
          value={form.bairro}
          editable={false}
          style={[styles.input, styles.disabled]}
        />

        <TextInput
          placeholder="Cidade"
          value={form.cidade}
          editable={false}
          style={[styles.input, styles.disabled]}
        />

        <TextInput
          placeholder="Estado"
          value={form.estado}
          editable={false}
          style={[styles.input, styles.disabled]}
        />

        <TextInput
          placeholder="Número"
          value={form.numero}
          onChangeText={(v) => setForm(prev => ({ ...prev, numero: v }))}
          keyboardType="numeric"
          style={styles.input}
        />
          <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
            <Text style={styles.buttonText}>Confirmar Participação</Text>
          </TouchableOpacity>    
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  inputStyle:{
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  disabled: {
    backgroundColor: '#f2f2f2',
    color: '#777',
  },

});