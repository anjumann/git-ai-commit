#!/usr/bin/env node
import { intro, outro, spinner } from "@clack/prompts";
import { getGitCommitFromDiff, prompt } from "./lib.js";
import { program } from "commander";
import { apiKey, config, model } from "./utils.js";



intro(`Welcome to Git AI Commit CLI!`);

program.version('0.0.1').description('AI Git Commit CLI');

program.action( async() => {
  const s = spinner();
  s.start('Thinking...');
  
  await getGitCommitFromDiff();
  
  s.stop('Done!');
  
});



program.parse(process.argv);
