import axios from 'axios';

const api = axios.create({
  baseURL: 'https://grupogtf.com.br/89fm/apisorteio', //UTILIZANDO NGROK
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;