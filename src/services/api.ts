import axios from 'axios';

const api = axios.create({
  baseURL: 'https://grupogtf.com.br/89fm/apisorteio',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;