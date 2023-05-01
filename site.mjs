import { spawn } from 'child_process';

const site = spawn('node', ['./admCaronas/index.js']);

site.stdout.on('data', (data) => {
  console.log(`Saída do projeto 1: ${data}`);
});

site.stderr.on('data', (data) => {
  console.error(`Erro do projeto 1: ${data}`);
});

site.on('close', (code) => {
  console.log(`Projeto 1 encerrado com código ${code}`);
});
