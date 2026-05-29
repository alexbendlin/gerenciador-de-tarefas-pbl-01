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

// ==========================================================================
// ROTA ADICIONAL (RESOLUÇÃO DO DESAFIO)
// ==========================================================================

/* Criando o endpoint '/status' que serve para monitorar a integridade 
   e a saúde do nosso ecossistema de backend */
app.get('/status', function(requisicao, resposta) {
    /* O método .json() é uma evolução do .send(). Ele avisa automaticamente 
       ao navegador do cliente (através do cabeçalho Content-Type: application/json)
       que o dado enviado é um objeto estruturado e não apenas texto puro. */
    resposta.json({
        status: "Operacional",
        versao: "1.0.0",
        ambiente: "GitHub Codespaces",
        dataVerificacao: new Date().toLocaleDateString("pt-BR")
    });
});

// ==========================================================================
// ROTA ADICIONAL: INFORMAÇÕES DO DOCENTE (RESOLUÇÃO DO DESAFIO)
// ==========================================================================

/* Criando o endpoint '/professor' para retornar dados institucionais 
   da disciplina de forma estruturada */
app.get('/professor', function(requisicao, resposta) {
    resposta.json({
        docente: "Alexandre Bendlin",
        disciplina: "Desenvolvimento de Sistemas",
        cargaHorariaTotal: "160 horas",
        metodologia: "Aprendizado Baseado em Projetos (PBL)",
        projetoEvolutivo: "Gerenciador de Tarefas (MasterTask)"
    });
});

// ==========================================================================
// ENDPOINTS RESTFUL DA API DE TAREFAS (ASSINATURAS DO CRUD)
// ==========================================================================

// 1. ROTA DE LEITURA TOTAL (GET /tarefas)
app.get('/tarefas', function(requisicao, resposta) {
    console.log("Requisição recebida: Listar todas as tarefas.");
    resposta.json({ mensagem: "Aqui será retornada a lista completa de tarefas." });
});

// 2. ROTA DE LEITURA INDIVIDUAL (GET /tarefas/:id)
app.get('/tarefas/:id', function(requisicao, resposta) {
    // Capturando o ID dinâmico vindo da URL do navegador
    const idTarefa = requisicao.params.id;
    console.log(`Requisição recebida: Buscar detalhes da tarefa de ID: ${idTarefa}`);
    
    resposta.json({ mensagem: `Aqui serão retornados os dados da tarefa ${idTarefa}.` });
});

// 3. ROTA DE CRIAÇÃO (POST /tarefas)
app.post('/tarefas', function(requisicao, resposta) {
    console.log("Requisição recebida: Inserir uma nova tarefa.");
    resposta.status(201).json({ mensagem: "Tarefa criada com sucesso (Simulação)." });
});

// 4. ROTA DE ATUALIZAÇÃO (PUT /tarefas/:id)
app.put('/tarefas/:id', function(requisicao, resposta) {
    const idTarefa = requisicao.params.id;
    console.log(`Requisição recebida: Alterar dados da tarefa de ID: ${idTarefa}`);
    
    resposta.json({ mensagem: `A tarefa ${idTarefa} foi atualizada com sucesso.` });
});

// 5. ROTA DE EXCLUSÃO (DELETE /tarefas/:id)
app.delete('/tarefas/:id', function(requisicao, resposta) {
    const idTarefa = requisicao.params.id;
    console.log(`Requisição recebida: Excluir a tarefa de ID: ${idTarefa}`);
    
    resposta.json({ mensagem: `A tarefa ${idTarefa} foi removida do sistema.` });
});



// 5. Ligando o servidor para escutar as requisições na porta definida
app.listen(PORTA, function() {
    console.log(`==================================================`);
    console.log(` Servidor rodando com sucesso na porta ${PORTA}!`);
    console.log(` Acesse em: http://localhost:${PORTA} `);
    console.log(`==================================================`);
});