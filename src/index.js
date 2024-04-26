#!/usr/bin/env node


import fs from 'fs';
import inquirer from 'inquirer';
import { changeApiKey, changeModel, showConfig } from './utils.js';
import { chatCompletion } from './lib.js';

// Load configuration from config & setting json file
let config = {};
let setting = {};
if (fs.existsSync('./config/config.json')) {
  config = JSON.parse(fs.readFileSync('./config/config.json'));
}
if (fs.existsSync('./config/setting.json')) {
  setting = JSON.parse(fs.readFileSync('./config/setting.json'));
}





// Interactive command prompt
async function prompt() {
  const { choice } = await inquirer.prompt({
    type: 'list',
    name: 'choice',
    message: 'What would you like to do?',
    choices: [
      { name: 'Chat', value: 'chat' },
      { name: 'Change Model', value: 'model_change' },
      { name: 'Change GROQ API Key', value: 'change_key' },
      { name: 'Show Config', value: 'show_config' },
      { name: 'Quit', value: 'quit' }
    ]
  });

  if (choice === 'chat') {
    await chat();
  } else if (choice === 'change_key') {
    await changeApiKey();
  } else if (choice === 'model_change') {
    await changeModel();
  } else if (choice === 'show_config') {
    await showConfig();
  } else if (choice === 'quit') {
    console.log('Goodbye!');
    process.exit(0);
  }
}



async function chat() {
  console.log(chatCompletion);
  prompt()
}


prompt();

export { prompt };