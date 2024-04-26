import fs from 'fs';
import { configFileLocation } from './constants/constant.js'
import { prompt } from './lib.js';
import { select } from '@clack/prompts';

// Load configuration from config & setting json file
let config = {};
if (fs.existsSync(configFileLocation)) {
    config = JSON.parse(fs.readFileSync(configFileLocation));
}

// Change GROQ API Key in config.json
async function changeApiKey() {
    const groq_api_key = await text({
        message: 'Enter your Groq API key: ( you can get it free from https://console.groq.com/keys ): ',
        placeholder: 'gsk_...',
        validate(value) {
            if (value.length === 0) return `Value is required!`;
        },
    });

    config.groq_api_key = groq_api_key;

    fs.writeFileSync(configFileLocation, JSON.stringify(config));
    console.log('Config saved!');
    prompt();

}

async function changeModel() {
   
    const model = await select({
        message: 'Enter your prefered model: ',
        options: [
            { label: 'llama3-70b-8192', value: 'llama3-70b-8192' },
            { label: 'llama3-8b-8192', value: 'llama3-8b-8192' },
            { label: 'mixtral-8x7b-32768', value: 'mixtral-8x7b-32768' },
            { label: ' gemma-7b-it', value: 'gemma-7b-it' },
        ]
    
    })

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
const model = config.model;

export { changeApiKey, showConfig, changeModel, config, apiKey, model };