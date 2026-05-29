// ==========================================================================
// SERVIDOR MASTERTASK - INICIALIZAÇÃO BASE
// ==========================================================================

console.log("=== SISTEMA INICIALIZADO VIA NODE.JS ===");

// Acessando informações do sistema operacional através do objeto global 'process'
const versaoNode = process.version;
const plataformaOS = process.platform;

console.log(`Versão do Node.js em execução: ${versaoNode}`);
console.log(`Sistema Operacional do Servidor: ${plataformaOS}`);