// ==========================================================================
// SERVIDOR MASTERTASK - CONFIGURAÇÃO DO EXPRESS
// ==========================================================================

// 1. Importando o framework Express
import express from 'express';

// Array global que armazenará as tarefas na memória do servidor durante esta fase do projeto
let bancoDeTarefas = [];

// 2. Inicializando a aplicação Express
const app = express();

// CONFIGURAÇÃO CRÍTICA: Habilita o Express a ler e interpretar corpos de requisições em formato JSON
app.use(express.json());

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

// 2. ROTA DE LEITURA INDIVIDUAL (GET /tarefas/:id) - COM VALIDAÇÃO (DESAFIO)
app.get('/tarefas/:id', function(requisicao, resposta) {
    // Capturando o parâmetro dinâmico enviado na URL
    const idTarefa = requisicao.params.id;
    
    console.log(`Log do Servidor: Processando busca para o ID: ${idTarefa}`);

    // RESOLUÇÃO DO DESAFIO: Validação preventiva do parâmetro recebido
    if (idTarefa === "0") {
        /* Se o cliente tentar buscar o ID 0, nós interrompemos o fluxo 
           e retornamos explicitamente o Status HTTP 400 (Bad Request) 
           junto com um objeto estruturado detalhando o erro. */
        return resposta.status(400).json({
            erro: "Requisição Inválida (Bad Request)",
            mensagem: "O identificador informado deve ser maior que zero. O ID 0 não existe no sistema.",
            timestamp: new Date().toISOString()
        });
    }

    // Fluxo normal caso o ID seja diferente de 0
    resposta.json({ 
        sucesso: true,
        mensagem: `Aqui serão retornados os dados reais da tarefa com identificador: ${idTarefa}.` 
    });
});

// 3. ROTA DE CRIAÇÃO (POST /tarefas) - IMPLEMENTAÇÃO REAL
app.post('/tarefas', function(requisicao, resposta) {
    // Extraindo as propriedades enviadas pelo cliente de dentro do corpo da requisição
    const { titulo, descricao, prazo, categoria, prioridade } = requisicao.body;

    // Validação básica de segurança preventiva
    if (!titulo || !prazo) {
        return resposta.status(400).json({
            erro: "Dados incompletos",
            mensagem: "Os campos 'titulo' e 'prazo' são obrigatórios para registrar uma tarefa."
        });
    }

    // Montando o objeto estruturado que será salvo no nosso array
    const novaTarefa = {
        id: Date.now(), // Gera um ID numérico único baseado no timestamp atual do servidor
        titulo: titulo,
        descricao: descricao || "",
        prazo: prazo,
        categoria: categoria || "geral",
        prioridade: prioridade || "baixa",
        concluida: false // Toda tarefa nasce pendente no sistema
    };

    // Salvando o objeto criado dentro do nosso array global em memória
    bancoDeTarefas.push(novaTarefa);

    console.log("Log do Servidor: Nova tarefa adicionada com sucesso!", novaTarefa);
    console.log(`Total de tarefas armazenadas no servidor: ${bancoDeTarefas.length}`);

    // Respondendo ao cliente com o Status 201 (Created) e devolvendo a tarefa criada com seu respectivo ID
    resposta.status(201).json({
        sucesso: true,
        mensagem: "Tarefa cadastrada com sucesso na memória do servidor!",
        dado: novaTarefa
    });
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