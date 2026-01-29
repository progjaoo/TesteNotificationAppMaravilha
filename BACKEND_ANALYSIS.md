# Análise do Backend e Guia de Notificações para Produção

Esta análise descreve as melhorias necessárias nos scripts PHP e as configurações obrigatórias no ambiente Expo/Firebase para garantir que as notificações sejam entregues em aplicativos buildados (APK/IPA).

## 1. `Criar.php` - Fluxo de Dados
O script chama o `enviar.php` e passa o `sorteio_id`. Isso está correto.

## 2. `Enviar.php` - Batching e Payload
A API do Expo aceita no máximo 100 notificações por requisição. Você implementou o `array_chunk`, o que é excelente.

**Importante sobre o campo `data`:**
O campo `data` deve conter o `sorteio_id` para que o aplicativo saiba para onde navegar.

---

# 🚀 CHECKLIST DE PRODUÇÃO (NOTIFICAÇÕES NO APK/APP)

Se as notificações funcionam no **Expo Go** mas não no **APK instalado**, o problema é quase sempre de **Credenciais de Autorização**.

### A. Firebase Cloud Messaging (FCM) - OBRIGATÓRIO PARA ANDROID
Quando você usa o Expo Go, a Expo usa as chaves dela. No seu APK próprio, você precisa das suas chaves.

1. **google-services.json**: Certifique-se que o arquivo baixado do Firebase está na raiz do projeto.
2. **FCM Server Key (Legacy)** ou **Service Account Key (HTTP v1)**:
   - Vá ao [Console da Expo](https://expo.dev/).
   - Vá em seu projeto -> **Credentials**.
   - No Android, certifique-se de que a **FCM Server Key** ou o **Google Service Account Key** foi enviado.
   - Sem isso, a Expo não tem "permissão" do Google para enviar mensagens para o seu APK.

### B. Apple Push Notification Service (APNs) - OBRIGATÓRIO PARA iOS
1. **GoogleService-Info.plist**: Deve estar na raiz do projeto.
2. **Push Key (.p8)**: No console da Expo (Credentials -> iOS), você deve ter gerado e enviado uma chave de notificações da Apple.

### C. Como debugar a entrega?
A API da Expo retorna um "Receipt ID". Você pode usar esse ID para verificar se o Google/Apple aceitou a mensagem.
- Use a ferramenta [Expo Push Debugger](https://expo.dev/notifications) para colar o seu token e ver se há erros de credenciais.

### D. Ícone de Notificação (Android)
No `app.json`, você pode configurar um ícone específico para as notificações (deve ser branco com fundo transparente):
```json
"notification": {
  "icon": "./assets/notification-icon.png",
  "color": "#FF8000"
}
```

### E. Canal de Notificação
No Android 8+, as mensagens **não aparecem** sem um canal. No código do App, eu já configurei o canal `default`. No seu PHP, você está enviando com o som `default`, o que deve funcionar se o canal existir no celular.

---

**Resumo da Solução Aplicada no Código do App:**
- Implementação do **Notifee** para exibir alertas mesmo com o app aberto.
- Criação de um `index.js` para capturar eventos em segundo plano.
- Sincronização de rotas para `/detalhesSorteio?id=...`.
