import Groq from "groq-sdk";
import { apiKey, config, model } from "./utils.js";
import { changeApiKey, changeModel, showConfig } from './utils.js';

import * as p from '@clack/prompts';

const groq = new Groq({
  apiKey: apiKey
});

export async function getGroqChatCompletion(prompt) {
  try {
    return await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: config.model,
    }).then((res) => res.choices[0]?.message?.content );
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Interactive command prompt
async function prompt() {
  try {
    p.intro("Welcome to Main Menu!");

    const choice = await p.select({
      message: 'What would you like to do?',
      options: [
        { label: 'Chat', value: 'chat' },
        { label: 'Change Model', value: 'model_change' },
        { label: 'Change GROQ API Key', value: 'change_key' },
        { label: 'Show Config', value: 'show_config' },
        { label: 'Quit', value: 'quit' }
      ],
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
    if (p.isCancel(choice)) {
      p.outro("Thanks for using the GROQ CLI!")
    }
  } catch (err) {
    console.error(err);
  }
}

async function chat(promptText) {  
  try {
    const s = p.spinner()
    s.start('Thinking...')
    const res = await getGroqChatCompletion(promptText);
    s.stop("Done!")
    console.log(res);
    prompt()
  } catch (err) {
    console.error(err);
  }
}

export { prompt };

import { execa} from 'execa';

export const getGitCommitFromDiff = async () =>{
  try {
    const IDENTITY = 'You are to act as the author of a commit message in git.';
    const SYSTEM_PROMPT = ` ${IDENTITY} Your mission is to create clean and comprehensive commit messages as per the conventional commit convention and explain WHAT were the changes and mainly WHY the changes were done. I'll send you an output of 'git diff --staged' command, and you are to convert it into a commit message. Do not preface the commit with anything. Conventional commit keywords: fix, feat, build, chore, ci, docs, style, refactor, perf, test. Add a short description of WHY the changes are done after the commit message. Don\'t start it with "This commit", just describe the changes.  Use the present tense. Lines must not be longer than 74 characters. Use English for the commit message.` 

    if(!model){
      p.outro(`Select a model before procceding.`);
      await prompt();
      return;
    }
    if(!apiKey){
      p.outro(`Add an API Key before procceding.`);
      await prompt();
      return;
    }

    const { stdout: diff } = await execa('git', [
      'diff',
      '--staged',
    ]);

    const shouldStage = await p.confirm({
      message: 'Do you want Stage the changes?',
    });

    if (shouldStage){
      await execa('git', [
        'add',
        '.'
      ]);
    }

    if (shouldStage){
      p.outro('Changes Stagged!');
    }
    
    const res = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: diff || "no changes"
        }
      ],
      model: config.model,
    }).then((res) => res.choices[0]?.message?.content ).catch((err) => console.error(err));
    
    console.log(res);
    
    const shouldCommit = await p.confirm({
      message: 'Do you want to commit the changes?',
    });

    if (shouldCommit) {    
      await execa('git', [
        'commit',
        '-m',
        res
      ]);
    }

    if (shouldCommit){
      p.outro('Changes commited!');
    }
  } catch (err) {
    console.error(err);
  }
}