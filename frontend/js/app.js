// ==========================================================================
// 1. MAPEAMENTO E SELEÇÃO DE ELEMENTOS DO DOM
// ==========================================================================

// Selecionamos o formulário completo usando o ID
const formTarefa = document.querySelector("#form-tarefa");

// Selecionamos cada input individualmente para capturar seus valores depois
const inputTitulo = document.querySelector("#titulo");
const inputDescricao = document.querySelector("#descricao");
const inputPrazo = document.querySelector("#prazo");
const inputCategoria = document.querySelector("#categoria");
const inputPrioridade = document.querySelector("#prioridade");

// Seletor da lista onde os cards serão injetados
const listaTarefasElemento = document.querySelector("#lista-tarefas");

/* Em vez de começar sempre com um array vazio, tentamos buscar o que está 
   salvo no LocalStorage. Se não houver nada (primeiro acesso), iniciamos vazio. */
let tarefas = carregarDoLocalStorage();

// ==========================================================================
// FUNÇÃO: CARREGAR TAREFAS DO LOCALSTORAGE
// ==========================================================================
function carregarDoLocalStorage() {
    const dadosSalvos = localStorage.getItem("tarefas_master");
    
    if (dadosSalvos) {
        /* Se encontramos texto salvo, usamos o JSON.parse para converter 
           aquela string de volta para um Array de Objetos JavaScript real. */
        return JSON.parse(dadosSalvos);
    } else {
        // Caso não exista nada salvo, retorna um array vazio padrão
        return [];
    }
}

// ==========================================================================
// 2. INTERCEPTAÇÃO DE EVENTOS (EVENT LISTENERS)
// ==========================================================================

formTarefa.addEventListener("submit", function(event) {
    event.preventDefault();

    // Cria o objeto contendo as propriedades estruturadas e um ID único baseado na data/hora
    const novaTarefa = {
        id: Date.now(), // Gera um número único e seguro baseado nos milissegundos atuais
        titulo: inputTitulo.value,
        descricao: inputDescricao.value,
        prazo: inputPrazo.value,
        categoria: inputCategoria.value,
        prioridade: inputPrioridade.value,
        concluida: false
    };

    // Adiciona o novo objeto criado no fim da nossa lista na memória
    tarefas.push(novaTarefa);

    // Salva a lista atualizada no disco rígido do navegador
    salvarNoLocalStorage();

    // Renderiza a lista atualizada imediatamente na tela para o usuário ver
    renderizarTarefas();

    // Limpa o formulário para a próxima digitação
    limparFormulario();
});

// ==========================================================================
// 3. FUNÇÕES DE SUPORTE
// ==========================================================================

function limparFormulario() {
    inputTitulo.value = "";
    inputDescricao.value = "";
    inputPrazo.value = "";
    inputCategoria.value = "trabalho"; // Reseta para a primeira opção padrão
    inputPrioridade.value = "baixa"; // Reseta para a primeira opção padrão
    
    // Devolve o cursor piscando para o campo de título automaticamente
    inputTitulo.focus();
}

// ==========================================================================
// FUNÇÃO: RENDERIZAR TAREFAS NA TELA (ATUALIZADA COM DESAFIO)
// ==========================================================================
function renderizarTarefas() {
    // 1. Limpa o conteúdo atual da lista para não duplicar itens antigos
    listaTarefasElemento.innerHTML = "...";

    // 2. Verifica se a lista está vazia para exibir a mensagem estilizada
    if (tarefas.length === 0) {
        listaTarefasElemento.innerHTML = `<p class="lista-vazia">Nenhuma tarefa cadastrada ainda. Comece adicionando uma acima! 🎯</p>`;
        return; 
    }

    // 3. Percorre o array de tarefas e reconstrói o HTML de cada card
    tarefas.forEach(function(tarefa) {
        // RESOLUÇÃO DO DESAFIO: .toUpperCase() aplicado diretamente na interpolação da prioridade
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

        // Acumula o novo card dentro da nossa UL do HTML
        listaTarefasElemento.innerHTML += cardHTML;
    });
}

// ==========================================================================
// FUNÇÃO: SALVAR TAREFAS NO LOCALSTORAGE
// ==========================================================================
function salvarNoLocalStorage() {
    /* Como o localStorage só aceita texto puro, usamos o JSON.stringify 
       para converter nosso array de objetos em uma grande String formatada. */
    const tarefasEmTexto = JSON.stringify(tarefas);
    
    // Gravamos na chave "tarefas_master" do navegador
    localStorage.setItem("tarefas_master", tarefasEmTexto);
}

// ==========================================================================
// EXECUÇÃO INICIAL
// ==========================================================================

/* Chamamos a função uma vez logo que a página carrega. Como o array de tarefas 
   está vazio, ela vai injetar imediatamente o nosso card de 'lista vazia'. */
renderizarTarefas();