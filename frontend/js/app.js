// ==========================================================================
// 1. DECLARAÇÃO DE VARIÁVEIS COM LET E CONST
// ==========================================================================

// Usamos 'const' para dados que nunca mudam de identificação
const nomeAplicacao = "TaskMaster";

// Usamos 'let' para dados que podem ser alterados/atualizados no sistema
let totalTarefasConcluidas = 0;

// Testando alterações
totalTarefasConcluidas = 1; // Permitido! Alterou o valor na memória.

// Se tentássemos fazer: nomeAplicacao = "OutroNome"; -> O JavaScript geraria um erro crítico!

console.log("Nome da Aplicação:", nomeAplicacao);
console.log("Tarefas concluídas até agora:", totalTarefasConcluidas);

// ==========================================================================
// 2. MODELAGEM DE DADOS UTILIZANDO OBJETOS
// ==========================================================================

const tarefaExemplo = {
    id: 1,
    titulo: "Estudar JavaScript Moderno",
    descricao: "Revisar conceitos de let, const, objetos e arrays.",
    prazo: "2026-06-05",
    categoria: "Estudos",
    concluida: false // Tipo Boolean: indica se a tarefa foi feita ou não
};

// Acessando propriedades do objeto usando a notação de ponto (.)
console.log("Título da Tarefa:", tarefaExemplo.titulo);
console.log("Está concluída?", tarefaExemplo.concluida);

// ==========================================================================
// 3. COLEÇÃO DE DADOS UTILIZANDO ARRAYS
// ==========================================================================

// Um array (lista) de objetos literais
const listaDeTarefasMock = [
    {
        id: 1,
        titulo: "Configurar o Codespaces",
        prazo: "2026-05-28",
        categoria: "Trabalho",
        concluida: true
    },
    {
        id: 2,
        titulo: "Estudar CSS Grid e Flexbox",
        prazo: "2026-06-02",
        categoria: "Estudos",
        concluida: false
    }
];

// Verificando a lista completa no console do desenvolvedor
console.log("Minha Lista de Tarefas Atual:", listaDeTarefasMock);

// Descobrindo o tamanho da lista dinamicamente
console.log("Quantidade de tarefas na lista:", listaDeTarefasMock.length);

// ==========================================================================
// RESOLUÇÃO DO DESAFIO: ADICIONANDO NOVOS ELEMENTOS AO ARRAY
// ==========================================================================

// 1. Criando um novo objeto de tarefa (simulando a captura de um formulário)
const novaTarefa = {
    id: 3,
    titulo: "Praticar o desafio de JavaScript",
    descricao: "Criar um objeto e inseri-lo no array de tarefas utilizando o método push.",
    prazo: "2026-05-30",
    categoria: "Pessoal",
    concluida: false
};

// 2. Inserindo o novo objeto diretamente no final do nosso array existente
listaDeTarefasMock.push(novaTarefa);

/* Por que usar push? 
   O método .push() é uma função nativa dos arrays em JavaScript. Ele adiciona 
   um ou mais elementos ao final do array e atualiza o tamanho da lista automaticamente.
*/

// 3. Exibindo os resultados no console para validação
console.log("--- RESULTADO DO DESAFIO ---");
console.log("A nova tarefa foi adicionada com sucesso!");
console.log("Lista de tarefas atualizada:", listaDeTarefasMock);
console.log("Novo tamanho total da lista:", listaDeTarefasMock.length);