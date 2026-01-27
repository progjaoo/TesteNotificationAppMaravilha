import axios from 'axios';

const API_URL = 'https://grupogtf.com.br/89fm/apisorteio'; // trocar dps para o link da api publicada

export async function inscreverNoSorteio(
  participanteId: number,
  sorteioId: number
): Promise<{ success: boolean; message: string }> {
  const response = await axios.post(
    `${API_URL}/inscricoes/inscrever.php`,
    {
      participante_id: participanteId,
      sorteio_id: sorteioId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}
