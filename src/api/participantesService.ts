import axios from 'axios';

const API_URL = 'https://grupogtf.com.br/89fm/apisorteio'; // trocar dps para o link da api publicada

export type CadastroParticipanteResponse = {
  id: number;
  ja_existente?: boolean;
};

export async function cadastrarParticipante(dados: {
  nome_completo: string;
  telefone: string;
  email?: string;
  cpf: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  numero: string;
}): Promise<CadastroParticipanteResponse> {
  const response = await axios.post(
    `${API_URL}/participantes/cadastrar.php`,
    dados,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}
