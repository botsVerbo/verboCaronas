import { spawn } from 'child_process';

const bot = spawn('node', ['./verboCaronas/index.js']);

bot.stdout.on('data', (data) => {
  console.log(`Saída do projeto 2: ${data}`);
});

bot.stderr.on('data', (data) => {
  console.error(`Erro do projeto 2: ${data}`);
});

bot.on('close', (code) => {
  console.log(`Projeto 2 encerrado com código ${code}`);
});
