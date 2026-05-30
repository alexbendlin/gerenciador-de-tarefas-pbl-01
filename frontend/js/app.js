// ==========================================================================
// 1. MAPEAMENTO E SELEÇÃO DE ELEMENTOS DO DOM
// ==========================================================================

const formTarefa = document.querySelector("#form-tarefa");
const inputTitulo = document.querySelector("#titulo");
const inputDescricao = document.querySelector("#descricao");
const inputPrazo = document.querySelector("#prazo");
const inputCategoria = document.querySelector("#categoria");
const inputPrioridade = document.querySelector("#prioridade");
const listaTarefasElemento = document.querySelector("#lista-tarefas");
const btnDocente = document.querySelector("#btn-docente");

// CONFIGURAÇÃO CRÍTICA: URL do seu Codespaces (Copie da aba Ports da Porta 3000)
const URL_API = "https://urban-parakeet-pxqrg699qwwc5xw-3000.app.github.dev";

// Nossa lista na memória do navegador começa vazia até o Fetch trazer os dados do servidor
let tarefas = [];

// ==========================================================================
// MÓDULO 3: FUNÇÃO ASSÍNCRONA PARA BUSCAR TAREFAS DO BACKEND (MÉTODO GET)
// ==========================================================================
async function buscarTarefasDoServidor() {
    console.log("Iniciando busca de tarefas no servidor remoto...");
    listaTarefasElemento.innerHTML = "<p class='carregando'>Carregando tarefas do servidor...</p>";

    try {
        // 1. Faz a requisição de rede para o endpoint GET /tarefas
        const respostaRede = await fetch(`${URL_API}/tarefas`);

        // Segurança: Valida se o status da resposta está na faixa dos 200 (Sucesso)
        if (!respostaRede.ok) {
            throw new Error(`Erro de comunicação. Status: ${respostaRede.status}`);
        }

        // 2. Transforma o texto bruto JSON vindo do Express em um Array de Objetos JavaScript
        tarefas = await respostaRede.json();
        
        console.log("Dados recebidos com sucesso do backend:", tarefas);

        // 3. Renderiza os cards atualizados na tela com os dados da API
        renderizarTarefas();

    } catch (erro) {
        console.error("❌ Falha crítica de integração:", erro.message);
        
        // Feedback visual amigável na tela caso o backend esteja desligado
        listaTarefasElemento.innerHTML = `
            <p style="color: #ff4a4a; text-align: center; font-weight: bold; padding: 20px;">
                Não foi possível conectar ao servidor de tarefas.<br>
                <span style="font-size: 0.9em; font-weight: normal;">Certifique-se de que o backend está rodando com 'npm run dev'.</span>
            </p>
        `;
    }
}

// ==========================================================================
// 2. INTERCEPTAÇÃO DE EVENTOS - CADASTRO COM CAPTURA DE ERRO DO GUARDIÃO
// ==========================================================================
formTarefa.addEventListener("submit", async function(event) {
    event.preventDefault();

    console.log("Formulário acionado. Preparando envio de nova tarefa...");

    const novaTarefa = {
        titulo: inputTitulo.value,
        descricao: inputDescricao.value,
        prazo: inputPrazo.value,
        categoria: inputCategoria.value,
        prioridade: inputPrioridade.value
    };

    try {
        const respostaRede = await fetch(`${URL_API}/tarefas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novaTarefa)
        });

        // RESOLUÇÃO DO DESAFIO: Se a resposta não for OK, extraímos o JSON de erro do Guardião
        if (!respostaRede.ok) {
            /* Lemos o pacote de erro retornado pelo servidor (que contém o campo 'detalhe') */
            const dadosErro = await respostaRede.json();
            
            /* Lançamos um erro contendo a mensagem exata gerada pelo backend */
            throw new Error(dadosErro.detalhe || "Erro desconhecido no servidor.");
        }

        const resultadoApi = await respostaRede.json();
        console.log("Tarefa cadastrada e persistida com sucesso no Backend:", resultadoApi);

        await buscarTarefasDoServidor();
        limparFormulario();

    } catch (erro) {
        // O bloco catch agora recebe a mensagem amigável vinda direto do servidor!
        console.error("❌ Erro ao tentar cadastrar nova tarefa:", erro.message);
        
        // Exibe o alerta com o texto exato do Guardião: "Falha de cadastro: Campos obrigatórios ausentes."
        alert(`Atenção: ${erro.message}`);
    }
});

// Vincula o clique do botão à nossa nova função assíncrona
if (btnDocente) {
    btnDocente.addEventListener("click", exibirDadosDocente);
}

// ==========================================================================
// INTERCEPTAÇÃO DE EVENTOS: DELEGAÇÃO DE CLIQUES NA LISTA (ATUALIZADA)
// ==========================================================================
listaTarefasElemento.addEventListener("click", function(event) {
    const elementoClicado = event.target;

    // Trata o clique no botão de Concluir (PUT)
    if (elementoClicado.classList.contains("btn-concluir")) {
        const idCapturado = elementoClicado.dataset.id;
        console.log(`Clique de conclusão para o ID: ${idCapturado}`);
        concluirTarefaNoServidor(idCapturado);
    }

    // Trata o clique no botão de Excluir (DELETE)
    if (elementoClicado.classList.contains("btn-excluir")) {
        const idCapturadoExclusao = elementoClicado.dataset.id;
        
        console.log(`Clique de exclusão para o ID: ${idCapturadoExclusao}`);
        
        // Boa prática pedagógica: Adicionar uma confirmação nativa antes de deletar do servidor
        const confirmar = confirm("Tem certeza absoluta que deseja excluir esta tarefa permanentemente?");
        
        if (confirmar) {
            // Se o usuário clicar em OK, dispara o fetch DELETE
            excluirTarefaNoServidor(idCapturadoExclusao);
        }
    }
});

// ==========================================================================
// 3. FUNÇÕES DE SUPORTE E RENDERIZAÇÃO
// ==========================================================================

function limparFormulario() {
    inputTitulo.value = "";
    inputDescricao.value = "";
    inputPrazo.value = "";
    inputCategoria.value = "trabalho"; 
    inputPrioridade.value = "baixa"; 
    inputTitulo.focus();
}

function renderizarTarefas() {
    console.log("Executando renderizarTarefas(). Total de itens na memória:", tarefas.length);

    // 1. Forçamos a limpeza ABSOLUTA do contêiner HTML antes de qualquer decisão
    listaTarefasElemento.innerHTML = "";

    // 2. Se o servidor retornou zero tarefas, injetamos o estado vazio e encerramos
    if (!tarefas || tarefas.length === 0) {
        listaTarefasElemento.innerHTML = `
            <p class="lista-vazia" style="text-align: center; color: #666; padding: 20px; font-weight: 500;">
                Nenhuma tarefa cadastrada ainda. Comece adicionando uma acima! 🎯
            </p>
        `;
        return; 
    }

    // 3. Se houver tarefas, reconstrói os cards normalmente
    tarefas.forEach(function(tarefa) {
        // Criamos uma variável auxiliar simples para verificar se a classe deve existir
        const classeStatus = tarefa.concluida ? "tarefa-item concluida" : "tarefa-item";

        const cardHTML = `
            <li class="${classeStatus}">
                <div class="tarefa-info">
                    <h3>${tarefa.titulo}</h3>
                    <p>${tarefa.descricao || "Sem descrição fornecida."}</p>
                    <div class="meta-container">
                        <span class="badge-categoria">${tarefa.categoria}</span>
                        <span class="badge-prioridade prioridade-${tarefa.prioridade}">⚠ ${tarefa.prioridade.toUpperCase()}</span>
                        <span class="prazo-data">📅 Prazo: ${tarefa.prazo}</span>
                    </div>
                </div>
                <div class="tarefa-acoes">
                    <button class="btn-concluir" data-id="${tarefa.id}" aria-label="Concluir tarefa" ${tarefa.concluida ? 'disabled style="background-color: #aaa;"' : ''}>
                        ${tarefa.concluida ? '✔ Concluída' : '✔ Concluir'}
                    </button>
                    <button class="btn-excluir" data-id="${tarefa.id}" aria-label="Excluir tarefa">❌ Excluir</button>
                </div>
            </li>
        `;
        listaTarefasElemento.innerHTML += cardHTML;
    });
}

// ==========================================================================
// DESAFIO ENCONTRO 17: BUSCAR E EXIBIR DADOS DO DOCENTE DA API (GET)
// ==========================================================================
async function exibirDadosDocente() {
    console.log("Solicitando dados do docente ao backend...");

    try {
        // Dispara a requisição assíncrona para o endpoint utilitário /professor
        const resposta = await fetch(`${URL_API}/professor`);

        // Validação de segurança do status da resposta
        if (!resposta.ok) {
            throw new Error(`Não foi possível ler os dados. Status: ${resposta.status}`);
        }

        // Converte o JSON recebido para objeto JavaScript
        const dadosProfessor = await resposta.json();
        console.log("Dados do professor recebidos:", dadosProfessor);

        // Formata a mensagem com os dados dinâmicos vindos do servidor Express
        const mensagemFormatada = `
======= DADOS DA DISCIPLINA =======
👨‍🏫 Professor: ${dadosProfessor.nome || "Não informado"}
📚 Matéria: ${dadosProfessor.materia || "Não informada"}
🎓 Regime: PBL (Project-Based Learning)
===================================
        `;

        // Exibe o alerta nativo na tela do navegador
        alert(mensagemFormatada);

    } catch (erro) {
        console.error("❌ Erro ao buscar dados do docente:", erro.message);
        alert(`Falha na integração: Não foi possível obter os dados do professor.\nDetalhe: ${erro.message}`);
    }
}

// ==========================================================================
// MÓDULO 3: FUNÇÃO ASSÍNCRONA PARA MARCAR TAREFA COMO CONCLUÍDA (PUT)
// ==========================================================================
async function concluirTarefaNoServidor(idTarefa) {
    console.log(`Disparando atualização PUT para a tarefa ID: ${idTarefa}...`);

    try {
        // Enviamos o ID diretamente na URL, atendendo ao parâmetro de rota do Express
        const respostaRede = await fetch(`${URL_API}/tarefas/${idTarefa}`, {
            method: "PUT", // Método HTTP específico para atualização completa/parcial
            headers: {
                "Content-Type": "application/json"
            },
            // Enviamos a propriedade que queremos modificar no corpo da requisição
            body: JSON.stringify({ concluida: true })
        });

        if (!respostaRede.ok) {
            throw new Error(`Falha ao atualizar tarefa. Status: ${respostaRede.status}`);
        }

        const dadosAtualizados = await respostaRede.json();
        console.log("Servidor confirmou a atualização com sucesso:", dadosAtualizados);

        // Atualização bem-sucedida! Recarregamos a lista oficial vinda da API
        await buscarTarefasDoServidor();

    } catch (erro) {
        console.error("❌ Erro na integração da rota PUT:", erro.message);
        alert(`Não foi possível concluir a tarefa.\nDetalhe: ${erro.message}`);
    }
}

// ==========================================================================
// MÓDULO 3: FUNÇÃO ASSÍNCRONA PARA REMOVER TAREFA COM TRATAMENTO DE REGRA DE NEGÓCIO
// ==========================================================================
async function excluirTarefaNoServidor(idTarefa) {
    console.log(`Disparando requisição DELETE para a tarefa ID: ${idTarefa}...`);

    try {
        const respostaRede = await fetch(`${URL_API}/tarefas/${idTarefa}`, {
            method: "DELETE"
        });

        // SE O SERVIDOR REJEITAR (Ex: Tarefa ainda está pendente)
        if (!respostaRede.ok) {
            // 1. Extrai o JSON de erro enviado pelo Express (que contém a mensagem de bloqueio)
            const dadosErro = await respostaRede.json();
            
            // 2. Lança a mensagem exata do backend para ser capturada pelo catch abaixo
            throw new Error(dadosErro.detalhe || dadosErro.erro || "Falha ao tentar excluir a tarefa.");
        }

        // FLUXO DE SUCESSO (Se o servidor responder status 200/204)
        const dadosConfirmacao = await respostaRede.json();
        console.log("Servidor confirmou a exclusão com sucesso:", dadosConfirmacao);

        // Atualiza a tela trazendo a nova lista oficial
        await buscarTarefasDoServidor();

    } catch (erro) {
        console.error("❌ Bloqueio ou Erro na rota DELETE:", erro.message);
        
        // Exibe para o usuário o motivo exato enviado pelo backend no log
        alert(`Não é possível excluir: ${erro.message}\n\n💡 Dica: Conclua a tarefa primeiro antes de tentar removê-la.`);
    }
}


// ==========================================================================
// EXECUÇÃO INICIAL (ATUALIZADA)
// ==========================================================================

/* Em vez de renderizar uma lista estática vazia, agora disparamos a busca 
   assíncrona na API assim que a página termina de carregar no navegador */
buscarTarefasDoServidor();