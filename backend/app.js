// ==========================================================================
// SERVIDOR MASTERTASK - INICIALIZAÇÃO BASE (COM CORES)
// ==========================================================================

// Importando a biblioteca de terceiros instalada via NPM
import colors from 'colors';

// Utilizando métodos de extensão que a biblioteca adiciona automaticamente às Strings
console.log("=== SISTEMA INICIALIZADO VIA NODE.JS ===".rainbow);
console.log("Sucesso: O ambiente backend foi configurado corretamente.".green.bold);

const versaoNode = process.version;
const plataformaOS = process.platform;

console.log(`Versão do Node.js em execução: ${versaoNode.cyan}`);
console.log(`Sistema Operacional do Servidor: ${plataformaOS.yellow}`);