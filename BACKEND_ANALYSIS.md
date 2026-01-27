# Análise do Backend (PHP) - Push Notifications

Esta análise descreve as melhorias necessárias nos scripts PHP para garantir que as notificações sejam enviadas corretamente e de forma eficiente.

## 1. `Criar.php` - Falta de `sorteio_id`
O script chama o `enviar.php` via `file_get_contents`, mas não passa o `sorteio_id`. Sem isso, o aplicativo não consegue saber para qual sorteio deve navegar quando o usuário clica na notificação.

**Correção sugerida:**
```php
// No Criar.php, ao chamar o enviar.php:
file_get_contents(
  "http://127.0.0.1/apisorteio/push/enviar.php",
  false,
  stream_context_create([
    'http' => [
      'method'  => 'POST',
      'header'  => "Content-Type: application/json\r\n",
      'content' => json_encode([
        'mensagem' => $mensagem,
        'sorteio_id' => $sorteioId // <-- Adicionar isso
      ])
    ]
  ])
);
```

## 2. `Enviar.php` - Batching (Loteamento)
A API do Expo aceita no máximo 100 notificações por requisição. Se houver mais de 100 dispositivos, o envio atual pode falhar ou ser ignorado.

**Correção sugerida:**
Use `array_chunk` para dividir os tokens em grupos de 100.

```php
$chunks = array_chunk($tokens, 100);

foreach ($chunks as $chunk) {
    $payload = [];
    foreach ($chunk as $token) {
        $payload[] = [
            'to'    => $token,
            'sound' => 'default',
            'title' => '📢 Rádio 89 Maravilha',
            'body'  => $mensagem,
            'data'  => [
                'tipo' => 'NOVO_SORTEIO',
                'sorteio_id' => $sorteioId
            ]
        ];
    }
    // Envia o curl aqui dentro do loop para cada chunk
}
```

## 3. `Enviar.php` - Tratamento de Erros e Limpeza de Tokens
Atualmente, o script não verifica se algum token se tornou inválido (ex: o usuário desinstalou o app). O Expo retorna erros como `DeviceNotRegistered` quando isso acontece.

**Sugestão:**
Verifique a resposta do Expo e marque os tokens como `ativo = 0` na tabela `dispositivos_push` caso receba um erro de que o dispositivo não está mais registrado.

## 4. Redundância em `Criar.php`
O script `Criar.php` chama `enviarPushNovoSorteio()` e logo em seguida faz uma chamada HTTP para `enviar.php`. Se ambas as funções fazem o envio via Expo, você está enviando notificações duplicadas para todos os usuários. Recomenda-se manter apenas uma forma de envio.
