// ==========================================================================
// SERVIDOR MASTERTASK - CONFIGURAÇÃO DO EXPRESS
// ==========================================================================

// 1. Importando o framework Express
import express from 'express';

// 2. Inicializando a aplicação Express
const app = express();

// 3. Definindo a porta lógica onde o servidor vai operar
const PORTA = 3000;

// 4. CRIANDO A PRIMEIRA ROTA (Rota Raiz / Home)
app.get('/', function(requisicao, resposta) {
    /* O método .send() envia uma resposta de texto simples ou HTML 
       de volta para o navegador do cliente */
    resposta.send("🚀 API do Gerenciador de Tarefas rodando com Express com sucesso!");
});

// 5. Ligando o servidor para escutar as requisições na porta definida
app.listen(PORTA, function() {
    console.log(`==================================================`);
    console.log(` Servidor rodando com sucesso na porta ${PORTA}!`);
    console.log(` Acesse em: http://localhost:${PORTA} `);
    console.log(`==================================================`);
});