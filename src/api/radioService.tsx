export interface RadioInfo {
  status: string;
  musica_atual: string;
  proxima_musica?: string;
  capa_musica?: string;
  titulo?: string;
  genero?: string;
}

const API_URL = 'https://radiovox.conectastm.com/api-json/Vkc1d1FrNUZNVUpRVkRBOStS';

export async function getRadioInfo(): Promise<RadioInfo | null> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar dados da rádio');

    const data = await response.json();

    let musica = '-';
    if (typeof data.musica_atual === 'string' && data.musica_atual.trim() !== '') {
      musica = data.musica_atual;
    } else if (typeof data.musica_atual === 'object' && data.musica_atual !== null) {
      const { titulo, artista } = data.musica_atual;
      musica = titulo ? titulo : '-';
    }

    return {
      ...data,
      musica_atual: musica,
    };
  } catch (error) {
    console.error('Erro na API da rádio:', error);
    return null;
  }
}

