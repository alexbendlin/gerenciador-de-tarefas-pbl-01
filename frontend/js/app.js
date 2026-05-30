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
// 2. INTERCEPTAÇÃO DE EVENTOS - CADASTRO DE TAREFA (MÉTODO POST)
// ==========================================================================
/* Transformamos a função do evento em assíncrona adicionando o 'async' antes de function */
formTarefa.addEventListener("submit", async function(event) {
    event.preventDefault();

    console.log("Formulário acionado. Preparando envio de nova tarefa...");

    // 1. Captura e monta o objeto com os dados atuais dos inputs
    const novaTarefa = {
        titulo: inputTitulo.value,
        descricao: inputDescricao.value,
        prazo: inputPrazo.value,
        categoria: inputCategoria.value,
        prioridade: inputPrioridade.value
    };

    try {
        // 2. Dispara a requisição POST para a API configurando as opções do Fetch
        const respostaRede = await fetch(`${URL_API}/tarefas`, {
            method: "POST", // Define explicitamente o método HTTP de criação
            headers: {
                // A etiqueta do pacote: avisa ao Express que estamos enviando JSON
                "Content-Type": "application/json" 
            },
            // Transforma o objeto JavaScript em uma string de texto JSON puro para a rede
            body: JSON.stringify(novaTarefa) 
        });

        // Segurança: Se o servidor rejeitar (ex: validação do título falhou), cai no catch
        if (!respostaRede.ok) {
            throw new Error(`Falha ao cadastrar no servidor. Status: ${respostaRede.status}`);
        }

        // 3. Captura o JSON de sucesso retornado pela nossa API
        const resultadoApi = await respostaRede.json();
        console.log("Tarefa cadastrada e persistida com sucesso no Backend:", resultadoApi);

        /* 4. FLUXO DE SUCESSO: Em vez de empurrar o objeto local manualmente, 
           re-executamos a busca oficial para trazer a lista atualizada direto da API */
        await buscarTarefasDoServidor();

        // 5. Limpa os campos do formulário para o próximo uso
        limparFormulario();

    } catch (erro) {
        console.error("❌ Erro ao tentar cadastrar nova tarefa:", erro.message);
        alert(`Não foi possível salvar a tarefa.\nDetalhe: ${erro.message}`);
    }
});

// Vincula o clique do botão à nossa nova função assíncrona
if (btnDocente) {
    btnDocente.addEventListener("click", exibirDadosDocente);
}

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
        const cardHTML = `
            <li class="tarefa-item">
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
                    <button class="btn-concluir" aria-label="Concluir tarefa">✔ Concluir</button>
                    <button class="btn-excluir" aria-label="Excluir tarefa">❌ Excluir</button>
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
// EXECUÇÃO INICIAL (ATUALIZADA)
// ==========================================================================

/* Em vez de renderizar uma lista estática vazia, agora disparamos a busca 
   assíncrona na API assim que a página termina de carregar no navegador */
buscarTarefasDoServidor();