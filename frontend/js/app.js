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

// ==========================================================================
// 2. INTERCEPTAÇÃO DE EVENTOS (EVENT LISTENERS)
// ==========================================================================

formTarefa.addEventListener("submit", function(event) {
    // IMPEDIR O COMPORTAMENTO PADRÃO: Evita que a página recarregue e limpe tudo
    event.preventDefault();

    // Capturando os valores reais digitados pelo usuário através da propriedade .value
    const valorTitulo = inputTitulo.value;
    const valorDescricao = inputDescricao.value;
    const valorPrazo = inputPrazo.value;
    const valorCategoria = inputCategoria.value;

    // Exibindo os dados capturados para validar a operação
    console.log("--- Nova Tarefa Capturada do Formulário ---");
    console.log("Título:", valorTitulo);
    console.log("Descrição:", valorDescricao);
    console.log("Prazo:", valorPrazo);
    console.log("Categoria:", valorCategoria);

    // Exibe um feedback visual simples para o usuário
    alert(`Sucesso! A tarefa "${valorTitulo}" foi capturada.`);

    // Executa a função para limpar os campos (Passo 3)
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
    
    // Devolve o cursor piscando para o campo de título automaticamente
    inputTitulo.focus();
}

