#!/usr/bin/env node

/**
 * Agentic CLI - Command-line interface for test generation and project management
 */

import { Command } from 'commander';
import { generateUnitTests, expandTests, generateIntegrationTests } from '../lib/testGenerator.js';
import { createProject, loadProject, listProjects } from '../lib/projectManager.js';
import chalk from 'chalk';
import ora from 'ora';

const program = new Command();

program
  .name('agentic')
  .description('Agentic Studio CLI - AI-powered development and test generation')
  .version('2.5.0');

// Unit Test Generation
program
  .command('generate-tests')
  .alias('test')
  .description('Generate unit tests for a function or file')
  .option('-f, --func <function>', 'Function name to test')
  .option('-p, --path <path>', 'Path to file containing the function')
  .option('-o, --output <path>', 'Output path for test file')
  .action(async (options) => {
    const spinner = ora('Analyzing code and generating tests...').start();
    
    try {
      if (!options.func && !options.path) {
        spinner.fail('Please provide either --func or --path');
        process.exit(1);
      }

      const result = await generateUnitTests({
        functionName: options.func,
        filePath: options.path,
        outputPath: options.output
      });

      spinner.succeed(chalk.green('Tests generated successfully!'));
      console.log(chalk.blue('\nGenerated test file:'), result.testFilePath);
      console.log(chalk.gray(`Tests created: ${result.testCount}`));
      
      if (result.coverage) {
        console.log(chalk.gray(`Estimated coverage: ${result.coverage}%`));
      }
    } catch (error) {
      spinner.fail(chalk.red('Test generation failed'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Expand existing tests
program
  .command('expand-tests')
  .description('Expand existing test suite with additional test cases')
  .option('-p, --path <path>', 'Path to existing test file or directory', 'tests/')
  .option('-c, --coverage <number>', 'Target coverage percentage', '90')
  .action(async (options) => {
    const spinner = ora('Analyzing test coverage and expanding tests...').start();
    
    try {
      const result = await expandTests({
        testPath: options.path,
        targetCoverage: parseInt(options.coverage)
      });

      spinner.succeed(chalk.green('Tests expanded successfully!'));
      console.log(chalk.blue(`\nTests added: ${result.testsAdded}`));
      console.log(chalk.gray(`Coverage improved: ${result.coverageBefore}% → ${result.coverageAfter}%`));
    } catch (error) {
      spinner.fail(chalk.red('Test expansion failed'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Integration test generation
program
  .command('integration-tests')
  .description('Generate integration tests by capturing HTTP/API requests')
  .option('-m, --mode <mode>', 'Mode: capture or test', 'capture')
  .option('-p, --port <port>', 'Port to monitor', '3000')
  .action(async (options) => {
    const spinner = ora(`Running in ${options.mode} mode...`).start();
    
    try {
      const result = await generateIntegrationTests({
        mode: options.mode,
        port: parseInt(options.port)
      });

      spinner.succeed(chalk.green(`Integration test ${options.mode} completed!`));
      
      if (options.mode === 'capture') {
        console.log(chalk.blue(`\nRequests captured: ${result.requestCount}`));
        console.log(chalk.gray(`Test scenarios created: ${result.scenarioCount}`));
      } else {
        console.log(chalk.blue(`\nTests executed: ${result.testCount}`));
        console.log(chalk.green(`Passed: ${result.passed}`), chalk.red(`Failed: ${result.failed}`));
      }
    } catch (error) {
      spinner.fail(chalk.red('Integration test operation failed'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Project Management
program
  .command('init')
  .description('Initialize a new Agentic project')
  .option('-n, --name <name>', 'Project name')
  .option('-t, --template <template>', 'Template type (react, node, fullstack)', 'react')
  .action(async (options) => {
    const spinner = ora('Creating new project...').start();
    
    try {
      const result = await createProject({
        name: options.name,
        template: options.template
      });

      spinner.succeed(chalk.green('Project created successfully!'));
      console.log(chalk.blue('\nProject directory:'), result.path);
      console.log(chalk.gray('\nNext steps:'));
      console.log(chalk.gray(`  cd ${result.name}`));
      console.log(chalk.gray('  npm install'));
      console.log(chalk.gray('  npm run dev'));
    } catch (error) {
      spinner.fail(chalk.red('Project creation failed'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program
  .command('projects')
  .description('List all Agentic projects')
  .action(async () => {
    try {
      const projects = await listProjects();
      
      if (projects.length === 0) {
        console.log(chalk.yellow('No projects found.'));
        console.log(chalk.gray('Create one with: agentic init'));
        return;
      }

      console.log(chalk.bold('\nAgentic Projects:\n'));
      projects.forEach((project, index) => {
        console.log(chalk.blue(`${index + 1}. ${project.name}`));
        console.log(chalk.gray(`   Path: ${project.path}`));
        console.log(chalk.gray(`   Modified: ${project.lastModified}\n`));
      });
    } catch (error) {
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Dev server
program
  .command('dev')
  .description('Start the Agentic Studio IDE interface')
  .option('-p, --port <port>', 'Port number', '5173')
  .action((options) => {
    console.log(chalk.bold.blue('\n🚀 Starting Agentic Studio...\n'));
    console.log(chalk.gray(`   Local:   http://localhost:${options.port}`));
    console.log(chalk.gray('   Press Ctrl+C to stop\n'));
    
    // Import and start vite dev server programmatically
    import('../vite.config.js').then(async () => {
      const { spawn } = await import('child_process');
      const vite = spawn('npm', ['run', 'dev'], { 
        stdio: 'inherit',
        shell: true 
      });
      
      vite.on('error', (error) => {
        console.error(chalk.red('Failed to start dev server:'), error.message);
        process.exit(1);
      });
    });
  });

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
