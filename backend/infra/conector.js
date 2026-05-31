// ==========================================================================
// INFRAESTRUTURA: CONECTOR REAL E CRIAÇÃO DE TABELAS (SQLITE3)
// ==========================================================================
import sqlite3 from 'sqlite3';
import 'colors';

// Instancia o driver no modo Verbose para capturar logs detalhados de SQL no terminal
const sqlite = sqlite3.verbose();

// Variável global que guardará a instância ativa do banco de dados
export let bancoDadosInstance = null;

export async function conectarBancoDeDados() {
    console.log("\n💾 INFRA - Conectando ao arquivo de banco de dados SQLite...".cyan);

    return new Promise((resolve, reject) => {
        /* Cria ou abre o arquivo 'banco.db' diretamente na raiz da pasta backend.
           O modo OPEN_READWRITE | OPEN_CREATE garante que ele crie o arquivo se não existir */
        const conexao = new sqlite.Database('./banco.db', (erro) => {
            if (erro) {
                console.error("🟥 ERRO - Falha ao abrir o arquivo SQLite:".red, erro.message);
                return reject(erro);
            }

            console.log("🟩 SUCESSO - Arquivo 'banco.db' carregado e pronto para persistência!".green);
            bancoDadosInstance = conexao;

            // Com o arquivo aberto, chamamos a criação da tabela padrão de estudos
            criarTabelaTarefasInicial()
                .then(() => resolve(true))
                .catch((erroTabela) => reject(erroTabela));
        });
    });
}

// Função utilitária interna para criar a tabela usando SQL puro
function criarTabelaTarefasInicial() {
    return new Promise((resolve, reject) => {
        const querySQL = `
            CREATE TABLE IF NOT EXISTS tarefas (
                id TEXT PRIMARY KEY,
                titulo TEXT NOT NULL,
                descricao TEXT,
                prazo TEXT,
                categoria TEXT,
                prioridade TEXT,
                concluida INTEGER DEFAULT 0
            );
        `;

        /* Executa o comando DDL no banco. O SQLite mapeia booleanos como 
           INTEGER (0 para false, 1 para true) */
        bancoDadosInstance.run(querySQL, (erro) => {
            if (erro) {
                console.error("🟥 ERRO - Falha ao estruturar tabela 'tarefas':".red, erro.message);
                return reject(erro);
            }
            console.log("📊 SCHEMA - Tabela 'tarefas' verificada/criada com sucesso no SQLite!".green);
            resolve(true);
        });
    });
}