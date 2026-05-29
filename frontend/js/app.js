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