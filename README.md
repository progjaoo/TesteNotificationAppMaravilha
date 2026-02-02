# Rádio 89 Maravilha FM - Documentação do Aplicativo

Este documento fornece uma visão técnica completa do aplicativo Rádio 89 Maravilha FM, desenvolvido com React Native e Expo.

## 📻 Visão Geral
O aplicativo permite que os usuários ouçam a transmissão ao vivo da Rádio 89 Maravilha FM, assistam conteúdos via WebView, participem de sorteios e consultem resultados. Não há sistema de login para os ouvintes; a identificação para sorteios é feita via CPF/Email e o registro de notificações é feito de forma anônima por dispositivo.

---

## 🛠️ Stack Tecnológica
- **Framework**: Expo (SDK 54) / React Native
- **Navegação**: Expo Router (File-based routing) com Drawer Navigation
- **Notificações**: Expo Notifications + Notifee (para alertas em foreground e background)
- **Áudio**: **Expo-Audio** (Substituto do Expo-AV para melhor suporte a Media Session)
- **Estilização**: React Native StyleSheet
- **API**: Axios / Fetch para comunicação com backend PHP/MySQL

---

## 📂 Estrutura de Arquivos Principais

### 📁 Raiz do Projeto
- `app.json`: Configuração central. Inclui plugins `expo-audio` e `@notifee/react-native`. Contém permissões de áudio em background e links para arquivos Firebase (`google-services.json`).
- `index.js`: Ponto de entrada customizado. Registra `notifee.onBackgroundEvent` antes de inicializar o `expo-router/entry`.
- `package.json`: Gerenciamento de dependências.

### 📁 `src/app/` (Expo Router)
- `_layout.tsx`: Configura o Drawer e inicializa listeners de notificação.
- `index.tsx`: Tela do Player. Utiliza `useAudioPlayer` do `expo-audio`. Implementa `setActiveForLockScreen(true)` e `updateLockScreenMetadata` para integração com a Central de Controle do sistema.
- `detalhesSorteio.tsx`: Exibe informações detalhadas de um sorteio.

---

## 🔔 Sistema de Notificações Push

O sistema utiliza uma abordagem híbrida para garantir entrega e interatividade:
1. **Expo Notifications**: Responsável por obter o token e receber a carga útil (payload) do servidor.
2. **Notifee**: Utilizado para exibir a notificação no **foreground** (quando o app está aberto) e gerenciar eventos de clique de forma mais robusta.

**Importante para Produção:**
- As notificações **SÓ funcionam em dispositivos físicos** e após a geração de um build nativo (APK/AAB/IPA).
- O arquivo `google-services.json` deve estar presente para Android.

---

## 🎵 Áudio e Media Session (Lock Screen)
Diferente do Expo-AV tradicional, este app utiliza a nova biblioteca **expo-audio**:
- Permite que o streaming continue em segundo plano.
- Sincroniza automaticamente com os controles de mídia do Android e iOS (Play/Pause/Título da música na tela de bloqueio).
- Configuração de metadados via `player.updateLockScreenMetadata`.

---

## 🚀 Como Rodar o Projeto

1. Instale as dependências: `npm install`
2. Para testar em desenvolvimento (Expo Go tem suporte limitado a áudio/notificações nativas): `npx expo start`
3. **Recomendado**: Gere um build de desenvolvimento para testar as funções nativas:
   - `npx eas build --profile development --platform android`
4. Para gerar o APK final:
   - `npx eas build -p android --profile preview`

---

## 🔗 Endpoints da API (Backend PHP)
- `push/register.php`: Registro de tokens.
- `push/enviar.php`: Disparo de notificações.
- `sorteios/aberto.php`: Verificação de sorteios ativos.
- `radioService.ts`: Integração com o servidor de streaming para metadados (ICY Metadata).
