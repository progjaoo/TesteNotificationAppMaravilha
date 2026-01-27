// api/consultasService.ts
const API_URL = 'https://grupogtf.com.br/89fm/apisorteio';

export async function listarSorteiosFinalizados() {
  const res = await fetch(`${API_URL}/sorteios/finalizados_publico.php`);
  return res.json();
}

export async function consultarPorCpf(cpf: string) {
  const res = await fetch(
    `${API_URL}/participantes/consultar_por_cpf.php?cpf=${cpf}`
  );
  return res.json();
}