# 📘 DOCUMENTAÇÃO DO APLICATIVO — MaravilhaApp

## 🏷️ 1. Visão Geral

**Nome:** MaravilhaApp  
**Versão:** 1.0.0  
**Plataforma:** React Native (Expo)  
**Finalidade:** Aplicativo móvel oficial da **Rádio Maravilha 89.1 FM**, com suporte a **transmissão ao vivo**, **vídeo**, **redes sociais** e **informações institucionais**.

### 🎯 Principais Recursos:
- 🎧 Player de rádio ao vivo (áudio e vídeo)  
- 🔗 Integração com API da rádio (stream e metadados)  
- 📂 Drawer Navigation para acesso às seções  
- 📰 Seções estáticas: *Sobre Nós*, *Redes Sociais*  
- 🎨 Layout responsivo com tema **laranja e branco**  
- 🧭 Ícones otimizados com *Expo Icons*  
- ⚡ Performance aprimorada com *Expo Router* e *React Compiler*  

---

## 📁 2. Estrutura de Pastas

```plaintext
MaravilhaApp/
├── .expo/
├── .vscode/
├── assets/               # Logos, ícones e imagens do app
│   └── images/
├── node_modules/
├── src/
│   ├── api/              # Comunicação com APIs externas
│   │   └── radioService.tsx
│   ├── app/              # Páginas principais do roteamento (expo-router)
│   │   ├── index.tsx     # Tela principal com player e bottom sheet
│   │   ├── [id].tsx      # Páginas dinâmicas (Informações, Sobre, Redes)
│   │   └── _layout.tsx   # Estrutura e Drawer Navigation
│   ├── components/       # Componentes reutilizáveis
│   │   └── SocialLinks.tsx
│   ├── pages/            # Páginas estáticas
│   │   ├── redesSociais.tsx
│   │   ├── sobreNos.tsx
│   │   └── informacoes.tsx
│   └── styles/           # Estilos centralizados
│       ├── index.styles.ts
│       ├── redesSociais.styles.ts
│       └── ...
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
└── README.md

⚙️ 3. Tecnologias Utilizadas
| Categoria       | Tecnologia                                           | Descrição                                   |
| --------------- | ---------------------------------------------------- | ------------------------------------------- |
| **Framework**   | React Native (Expo)                                  | Desenvolvimento multiplataforma Android/iOS |
| **Navegação**   | Expo Router / DrawerNavigator                        | Roteamento e menu lateral                   |
| **Player**      | Expo AV                                              | Controle e reprodução de áudio              |
| **Vídeo**       | React Native WebView                                 | Player de vídeo integrado                   |
| **UI e Ícones** | @expo/vector-icons, Ionicons, MaterialCommunityIcons | Ícones e interface visual                   |
| **Fonte**       | SpaceMono-Regular.ttf                                | Tipografia personalizada                    |
| **API**         | Fetch API + JSON Parsing                             | Consumo da API de streaming                 |
| **Animações**   | Animated API                                         | Bottom Sheet e transições suaves            |

🎵 4. Principais Funcionalidades
4.1 Tela Principal (index.tsx)

Exibe player de áudio com metadados da música atual.

Atualiza automaticamente a cada 20 segundos.

Bottom Sheet arrastável para expandir/minimizar.

Alternância entre Ouvir (áudio) e Assistir (vídeo).

Botão de compartilhamento social.

Links diretos para site e redes sociais.

4.2 Drawer Navigation (_layout.tsx)

Menu lateral com logo da rádio.

Itens: Rádio Maravilha, Redes Sociais, Sobre Nós.

Tema visual em #FF8000 (laranja).

Navegação dinâmica via expo-router.

4.3 API de Rádio (radioService.tsx)

Endpoint:
https://radiovox.conectastm.com/api-json/Vkc1d1FrNUZNVUpRVkRBOStS

Retorna: status, música atual, capa, gênero.

Fallback automático se a música estiver indisponível.

4.4 Páginas Estáticas

Redes Sociais: Links diretos para WhatsApp, Instagram, YouTube.

Sobre Nós: Missão e valores da rádio.

Informações: Programações e dados institucionais.

💅 5. Padrões de Código e Estilo

✅ Componentes funcionais com React Hooks (useState, useEffect, useRef)

✅ Tipagem forte com TypeScript

✅ Estilos centralizados (pasta styles/)

✅ Responsividade com Dimensions e Platform.select

✅ Acessibilidade com:

accessibilityRole e accessibilityLabel

Botões com hitSlop expandido

✅ Boas práticas de UX:

Feedback visual de carregamento

Botões grandes e ícones consistentes

🧰 6. Requisitos de Ambiente
📦 Dependências principais
expo install expo-av react-native-webview @react-navigation/drawer expo-font
npm install expo-router

▶️ Execução local
npm install
npx expo start

📱 Build (EAS)
eas build -p android
eas build -p ios
