import fs from 'fs';
import inquirer from 'inquirer';
import { prompt } from './index.js';
import { configFileLocation } from './constants/constant.js'

// Load configuration from config & setting json file
let config = {};
if (fs.existsSync(configFileLocation)) {
    config = JSON.parse(fs.readFileSync(configFileLocation));
}

// Change GROQ API Key in config.json
async function changeApiKey() {
    const { groq_api_key } = await inquirer.prompt({
        type: 'input',
        name: 'groq_api_key',
        message: 'Enter your Groq API key:'
    });

    config.groq_api_key = groq_api_key;

    fs.writeFileSync(configFileLocation, JSON.stringify(config));
    console.log('Config saved!');
    prompt();

}

async function changeModel() {
    const { model } = await inquirer.prompt({
        type: 'list',
        name: 'model',
        message: 'Enter your prefered model: ',
        choices: [
            { name: 'llama3-70b-8192', value: 'llama3-70b-8192' },
            { name: 'llama3-8b-8192', value: 'llama3-8b-8192' },
            { name: 'mixtral-8x7b-32768', value: 'mixtral-8x7b-32768' },
            { name: ' gemma-7b-it', value: ' gemma-7b-it' },
        ]
    });

    config.model = model;

    fs.writeFileSync(configFileLocation, JSON.stringify(config));
    console.log('Config saved!');
    prompt();

}


async function showConfig() {
    console.log('Current config: ', config);
    prompt();
}

const apiKey = config.groq_api_key;

export { changeApiKey, showConfig, changeModel, config , apiKey };