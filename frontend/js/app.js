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

/* Array global que funcionará como o "Banco de Dados" temporário do nosso Frontend.
   Ele começa vazio e vai acumulando os objetos de tarefas criados. */
let tarefas = [];

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
// FUNÇÃO: RENDERIZAR TAREFAS NA TELA
// ==========================================================================
function renderizarTarefas() {
    // 1. Limpa o conteúdo atual da lista para não duplicar itens antigos
    listaTarefasElemento.innerHTML = "";

    // 2. Verifica se a lista está vazia para exibir um feedback visual
    if (tarefas.length === 0) {
        listaTarefasElemento.innerHTML = `<p class="lista-vazia">Nenhuma tarefa cadastrada ainda. Comece adicionando uma acima! 🎯</p>`;
        return; // Interrompe a função aqui caso não existam tarefas
    }

    // 3. Percorre o array de tarefas e reconstrói o HTML de cada card
    tarefas.forEach(function(tarefa) {
        // Criamos o HTML do card de forma idêntica ao nosso design pattern anterior
        const cardHTML = `
            <li class="tarefa-item">
                <div class="tarefa-info">
                    <h3>${tarefa.titulo}</h3>
                    <p>${tarefa.descricao || "Sem descrição fornecida."}</p>
                    <div class="meta-container">
                        <span class="badge-categoria">${tarefa.categoria}</span>
                        <span class="badge-prioridade prioridade-${tarefa.prioridade}">⚠ ${tarefa.prioridade}</span>
                        <span class="prazo-data">📅 Prazo: ${tarefa.prazo}</span>
                    </div>
                </div>
                <div class="tarefa-acoes">
                    <button class="btn-concluir" aria-label="Concluir tarefa">✔ Concluir</button>
                    <button class="btn-excluir" aria-label="Excluir tarefa">❌ Excluir</button>
                </div>
            </li>
        `;

        // Acumula o novo card de forma incremental dentro da nossa UL do HTML
        listaTarefasElemento.innerHTML += cardHTML;
    });
}