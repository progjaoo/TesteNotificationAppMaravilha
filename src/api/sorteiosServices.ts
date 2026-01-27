import axios from 'axios';

const API_URL = 'https://grupogtf.com.br/89fm/apisorteio'; // trocar dps para o link da api publicada

export interface Sorteio {
  id: number;
  nome_sorteio: string;
  descricao?: string;
  data_sorteio: string;
  data_final_cadastro: string;
  estado: string;
  imagem?: string;
}

export async function getSorteios(): Promise<Sorteio[]> {
  const response = await axios.get(`${API_URL}/sorteios/listar.php`);
  return response.data;
}