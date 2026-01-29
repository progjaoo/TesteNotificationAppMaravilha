# Rádio 89 Maravilha FM - Documentação do Aplicativo

Este documento fornece uma visão técnica completa do aplicativo Rádio 89 Maravilha FM, desenvolvido com React Native e Expo. Ele serve como base de conhecimento para desenvolvedores e agentes de IA entenderem a arquitetura, o fluxo de dados e as integrações do projeto.

## 📻 Visão Geral
O aplicativo permite que os usuários ouçam a transmissão ao vivo da Rádio 89 Maravilha FM, assistam conteúdos via WebView, participem de sorteios e consultem resultados. Não há sistema de login para os ouvintes; a identificação para sorteios é feita via CPF/Email e o registro de notificações é feito de forma anônima por dispositivo.

---

## 🛠️ Stack Tecnológica
- **Framework**: Expo (SDK 54) / React Native
- **Navegação**: Expo Router (File-based routing) com Drawer Navigation
- **Notificações**: Expo Notifications + Notifee (para alertas em foreground e background)
- **Áudio**: Expo-AV (Streaming de rádio)
- **Estilização**: React Native StyleSheet
- **API**: Axios para comunicação com backend PHP/MySQL

---

## 📂 Estrutura de Arquivos

### 📁 Raiz do Projeto
- `app.json`: Configuração central do Expo, permissões Android/iOS, plugins (Notifee, Notifications) e links para arquivos do Firebase.
- `index.js`: Ponto de entrada personalizado para registrar o `notifee.onBackgroundEvent` e inicializar o Expo Router.
- `package.json`: Dependências do projeto e scripts (build, lint, start).
- `eas.json`: Perfis de build (development, preview/apk, production).
- `BACKEND_ANALYSIS.md`: Guia de referência para os scripts PHP do servidor.

### 📁 `src/app/` (Expo Router - Rotas)
- `_layout.tsx`: Layout principal. Configura o Drawer Navigation e inicializa os hooks de notificações (`useNotificationListener`, `useNotificationNavigation`) e registro de push (`initPush`).
- `index.tsx`: Tela principal (Player). Contém a lógica do Bottom Sheet, controles de áudio (Play/Pause), troca entre abas "Ouvir/Assistir" e banner de sorteios abertos.
- `detalhesSorteio.tsx`: Rota que exibe informações de um sorteio específico (id passado via query param).
- `cadastroParticipante.tsx`: Formulário de inscrição para sorteios.
- `[id].tsx`: Rota dinâmica usada para páginas auxiliares (Sobre Nós, Redes Sociais, etc).

### 📁 `src/pages/` (Componentes de Tela)
*Contém a implementação real das telas que são renderizadas pelas rotas do Expo Router.*
- `detalhesSorteio.tsx`: Lógica de busca de dados de um sorteio específico via API.
- `sorteios.tsx`: Lista todos os sorteios disponíveis buscados no backend.
- `consultas.tsx`: Permite ao usuário consultar sua participação.
- `sobrenos.tsx`, `redesSociais.tsx`: Conteúdo estático e links externos.
- `splash.tsx`: Tela de carregamento inicial.

### 📁 `src/services/` (Lógica de Negócio e APIs)
- `api.ts`: Instância central do Axios configurada com a `baseURL` da rádio.
- `notifications.ts`: **Coração das Notificações**.
    - `registerForPushNotificationsAsync`: Solicita permissão e obtém o Expo Push Token.
    - `useNotificationListener`: Hook que escuta mensagens no foreground e as exibe usando o **Notifee**.
    - `useNotificationNavigation`: Hook que trata o clique na notificação e redireciona para a tela de detalhes.
- `push.ts`: Gerencia o registro do token no banco de dados via `AsyncStorage` para evitar envios duplicados.

### 📁 `src/api/` (Endpoints Específicos)
- `sorteiosServices.ts`: Funções para listar e buscar detalhes de sorteios.
- `radioService.tsx`: Busca metadados da rádio (nome da música, artista, capa) via API.
- `participantesService.ts`, `inscricoesService.ts`: Lógica de persistência no banco para sorteios.

---

## 🔔 Fluxo de Notificações Push

O sistema foi desenhado para ser resiliente em produção (APK/Standalone):

1.  **Registro**: O App gera um `Expo Push Token` e o envia para `push/register.php` junto com a plataforma (ANDROID/IOS).
2.  **Backend (PHP)**:
    - Ao criar um sorteio (`Criar.php`), o servidor chama o script `enviar.php`.
    - O `enviar.php` busca todos os tokens ativos e envia um POST para a API da Expo (`exp.host`).
3.  **Entrega**: A Expo repassa a mensagem para o **Firebase (FCM)** ou **Apple (APNs)**.
4.  **Recepção no App**:
    - **Foreground**: `useNotificationListener` intercepta e o **Notifee** exibe um alerta customizado.
    - **Background/Killed**: O sistema exibe a notificação nativa. Ao clicar, o `index.js` ou `useNotificationNavigation` processa o `sorteio_id` e abre a tela correta.

---

## 🎵 Sistema de Áudio (Transmissão)
- **URL**: `https://stm19.srvstm.com:7080/stream`
- **Implementação**: Usa `Audio.Sound` do `expo-av`.
- **Background**: Configurado via `Audio.setAudioModeAsync` no `index.tsx` e permissões `UIBackgroundModes: ["audio"]` no `app.json`.

---

## 🚀 Guia de Produção (Checklist)

Para que as notificações funcionem no APK/App final, é **obrigatório**:
1.  **Android**: Ter o `google-services.json` na raiz e configurado no `app.json` sob `"android.googleServicesFile"`.
2.  **iOS**: Ter o `GoogleService-Info.plist` na raiz e configurado no `app.json` sob `"ios.googleServicesFile"`.
3.  **Credentials**: As chaves do Firebase (Server Key) e Apple (Push Key) devem ser carregadas no console da Expo via `eas credentials`.

---

## 🔗 Endpoints da API (Backend PHP)
O backend deve estar hospedado em `https://grupogtf.com.br/89fm/apisorteio/` com a seguinte estrutura:
- `push/register.php`: Recebe `token` e `plataforma` (POST).
- `push/enviar.php`: Dispara as notificações para o Expo (POST).
- `sorteios/aberto.php`: Verifica se há sorteios ativos.
- `sorteios/listar.php`: Retorna todos os sorteios.
- `sorteios/buscar.php?id=X`: Detalhes de um sorteio específico.
