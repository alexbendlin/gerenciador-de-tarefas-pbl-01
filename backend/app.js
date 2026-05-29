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

// 1. ROTA DE LEITURA TOTAL (GET /tarefas) - IMPLEMENTAÇÃO REAL
app.get('/tarefas', function(requisicao, resposta) {
    console.log(`Log do Servidor: Listando tarefas. Total atual: ${bancoDeTarefas.length}`);
    
    // Devolve o array completo em formato JSON com o Status padrão 200 OK
    resposta.json(bancoDeTarefas);
});

// 2. ROTA DE LEITURA INDIVIDUAL (GET /tarefas/:id) - IMPLEMENTAÇÃO REAL
app.get('/tarefas/:id', function(requisicao, resposta) {
    const idParametro = requisicao.params.id;

    // Validação preventiva do ID 0 (mantida da aula 12)
    if (idParametro === "0") {
        return resposta.status(400).json({
            erro: "Requisição Inválida",
            mensagem: "O identificador informado deve ser maior que zero."
        });
    }

    /* CRÍTICO: Convertemos a String da URL para Number, garantindo a correspondência 
       com o tipo de dado salvo no nosso objeto (id: Date.now()) */
    const idBusca = Number(idParametro);

    // Utilizamos o método .find() para varrer a lista atrás do objeto com o ID correspondente
    const tarefaEncontrada = bancoDeTarefas.find(function(tarefa) {
        return tarefa.id === idBusca;
    });

    // Se o .find() não encontrar correspondência, ele retorna undefined (falsy)
    if (!tarefaEncontrada) {
        console.log(`Log do Servidor: Tarefa com ID ${idBusca} não foi localizada.`);
        
        /* Retornamos explicitamente o Status 404 (Not Found) interrompendo o fluxo */
        return resposta.status(404).json({
            erro: "Não Encontrado (Not Found)",
            mensagem: `Não foi encontrada nenhuma tarefa com o identificador ${idBusca}.`
        });
    }

    console.log(`Log do Servidor: Tarefa localizada com sucesso! [${tarefaEncontrada.titulo}]`);

    // Caso encontre, responde o objeto da tarefa com o status 200 OK
    resposta.json(tarefaEncontrada);
});

// ==========================================================================
// ROTA DE FILTRAGEM POR CATEGORIA (GET /tarefas/categoria/:nomeCategoria) - DESAFIO
// ==========================================================================
app.get('/tarefas/categoria/:nomeCategoria', function(requisicao, resposta) {
    // Captura o parâmetro dinâmico da URL
    const categoriaBusca = requisicao.params.nomeCategoria;
    
    console.log(`Log do Servidor: Filtrando tarefas pela categoria: [${categoriaBusca}]`);

    /* Usamos o método .filter() para varrer o array. Diferente do .find() (que para no primeiro),
       o .filter() varre a lista inteira e retorna um NOVO array contendo TODOS os objetos 
       que retornarem 'true' na condição lógica. */
    const tarefasFiltradas = bancoDeTarefas.filter(function(tarefa) {
        // Tratamos ambos os lados para minúsculas para evitar erros de digitação (ex: Estudos vs estudos)
        return tarefa.categoria.toLowerCase() === categoriaBusca.toLowerCase();
    });

    /* Padrão de mercado (Boas práticas RESTful): Se a categoria existe ou não, mas não há 
       itens nela, respondemos com o Status 200 OK devolvendo o array vazio []. 
       Isso avisa ao frontend que a rota funciona, mas não há registros para exibir. */
    resposta.json(tarefasFiltradas);
});

// 3. ROTA DE CRIAÇÃO (POST /tarefas) - COM VALIDAÇÃO DE PRIORIDADE (DESAFIO)
app.post('/tarefas', function(requisicao, resposta) {
    const { titulo, descricao, prazo, categoria, prioridade } = requisicao.body;

    // 1. Validação de campos obrigatórios (existente)
    if (!titulo || !prazo) {
        return resposta.status(400).json({
            erro: "Dados incompletos",
            mensagem: "Os campos 'titulo' e 'prazo' são obrigatórios para registrar uma tarefa."
        });
    }

    // 2. RESOLUÇÃO DO DESAFIO: Validação preventiva da prioridade
    // Definimos um array contendo os únicos termos aceitos pelo nosso sistema
    const prioridadesPermitidas = ["baixa", "média", "alta"];
    
    // Tratamos o dado recebido para letras minúsculas para evitar problemas de case-sensitivity
    const prioridadeTratada = prioridade ? prioridade.toLowerCase() : "baixa";

    // Se o valor enviado não estiver contido dentro da nossa lista de permissões...
    if (!prioridadesPermitidas.includes(prioridadeTratada)) {
        /* Interrompemos o fluxo e devolvemos o Status 400 (Bad Request) explicando 
           quais são as opções aceitáveis para o cliente corrigir o disparo */
        return resposta.status(400).json({
            erro: "Valor inválido para o campo 'prioridade'",
            mensagem: `A prioridade enviada '${prioridade}' não é suportada. Use apenas: 'baixa', 'média' ou 'alta'.`
        });
    }

    // 3. Montando o objeto estruturado caso passe em todas as validações
    const novaTarefa = {
        id: Date.now(), 
        titulo: titulo,
        descricao: descricao || "",
        prazo: prazo,
        categoria: categoria || "geral",
        prioridade: prioridadeTratada, // Salvamos o dado devidamente padronizado
        concluida: false 
    };

    bancoDeTarefas.push(novaTarefa);

    console.log("Log do Servidor: Nova tarefa adicionada com sucesso!", novaTarefa);

    resposta.status(201).json({
        sucesso: true,
        mensagem: "Tarefa cadastrada com sucesso na memória do servidor!",
        dado: novaTarefa
    });
});

// 4. ROTA DE ATUALIZAÇÃO COMPLETA OU DE STATUS (PUT /tarefas/:id)
app.put('/tarefas/:id', function(requisicao, resposta) {
    const idBusca = Number(requisicao.params.id);
    
    // Extraímos os dados que o cliente deseja alterar de dentro do corpo da requisição
    const { titulo, descricao, prazo, categoria, prioridade, concluida } = requisicao.body;

    // Buscamos o índice (posição) do objeto no nosso array de memória
    const indiceTarefa = bancoDeTarefas.findIndex(function(tarefa) {
        return tarefa.id === idBusca;
    });

    // Se o findIndex retornar -1, significa que o ID enviado não existe no sistema
    if (indiceTarefa === -1) {
        console.log(`Log do Servidor: Falha ao atualizar. ID ${idBusca} não encontrado.`);
        return resposta.status(404).json({
            erro: "Não Encontrado",
            mensagem: `Impossível atualizar. Nenhuma tarefa com o ID ${idBusca} foi localizada.`
        });
    }

    // Capturamos o objeto original baseado na posição localizada
    const tarefaOriginal = bancoDeTarefas[indiceTarefa];

    /* Técnica de Atualização Parcial Baseada em Curto-Circuito (||):
       Se o cliente enviou um novo dado, usamos o novo. Se o campo veio vazio ou 
       não foi enviado no JSON, mantemos o valor que já estava salvo originalmente. */
    const tarefaAtualizada = {
        ...tarefaOriginal, // Copia todas as propriedades antigas (incluindo ID estável)
        titulo: titulo !== undefined ? titulo : tarefaOriginal.titulo,
        descricao: descricao !== undefined ? descricao : tarefaOriginal.descricao,
        prazo: prazo !== undefined ? prazo : tarefaOriginal.prazo,
        categoria: categoria !== undefined ? categoria : tarefaOriginal.categoria,
        prioridade: prioridade !== undefined ? prioridade : tarefaOriginal.prioridade,
        concluida: concluida !== undefined ? concluida : tarefaOriginal.concluida
    };

    // Substituímos o objeto velho pelo objeto atualizado exatamente na mesma posição do array
    bancoDeTarefas[indiceTarefa] = tarefaAtualizada;

    console.log(`Log do Servidor: Tarefa [${tarefaAtualizada.titulo}] atualizada com sucesso!`);

    // Retorna o objeto modificado para o cliente com o status 200 OK
    resposta.json({
        sucesso: true,
        mensagem: "Tarefa atualizada com sucesso!",
        dado: tarefaAtualizada
    });
});

// 5. ROTA DE EXCLUSÃO DEFINITIVA (DELETE /tarefas/:id) - COM TRAVA
app.delete('/tarefas/:id', function(requisicao, resposta) {
    const idBusca = Number(requisicao.params.id);

    // Procuramos a posição física da tarefa na lista
    const indiceTarefa = bancoDeTarefas.findIndex(function(tarefa) {
        return tarefa.id === idBusca;
    });

    // 1. Validação de existência (mantida da aula anterior)
    if (indiceTarefa === -1) {
        console.log(`Log do Servidor: Falha ao excluir. ID ${idBusca} não encontrado.`);
        return resposta.status(404).json({
            erro: "Não Encontrado",
            mensagem: `Impossível remover. Nenhuma tarefa com o ID ${idBusca} foi localizada.`
        });
    }

    // Captura a tarefa localizada na memória para checar suas propriedades
    const tarefaAlvo = bancoDeTarefas[indiceTarefa];

    // 2. RESOLUÇÃO DO DESAFIO: Trava de segurança para tarefas pendentes
    if (tarefaAlvo.concluida === false) {
        console.log(`Log do Servidor: Bloqueio de exclusão. A tarefa "${tarefaAlvo.titulo}" ainda está pendente.`);
        
        /* Interrompemos a deleção e retornamos o Status 400 Bad Request explicando 
           a regra de negócio ao cliente */
        return resposta.status(400).json({
            erro: "Regra de Negócio Violada (Bad Request)",
            mensagem: `Não é permitido excluir a tarefa "${tarefaAlvo.titulo}" porque ela ainda está pendente. Conclua a tarefa primeiro antes de removê-la do sistema.`,
            statusTarefa: "pendente"
        });
    }

    // 3. Fluxo de remoção real (só executa se a tarefa estiver marcada como concluída)
    const nomeTarefaExcluida = tarefaAlvo.titulo;
    bancoDeTarefas.splice(indiceTarefa, 1);

    console.log(`Log do Servidor: Tarefa "${nomeTarefaExcluida}" foi deletada da memória.`);
    console.log(`Tarefas restantes no servidor: ${bancoDeTarefas.length}`);

    resposta.json({
        sucesso: true,
        mensagem: `A tarefa "${nomeTarefaExcluida}" foi removida do ecossistema com sucesso.`
    });
});



// 5. Ligando o servidor para escutar as requisições na porta definida
app.listen(PORTA, function() {
    console.log(`==================================================`);
    console.log(` Servidor rodando com sucesso na porta ${PORTA}!`);
    console.log(` Acesse em: http://localhost:${PORTA} `);
    console.log(`==================================================`);
});