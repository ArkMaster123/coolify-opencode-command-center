#!/usr/bin/env node

/**
 * Custom startup script that initializes OpenCode embedded server
 * before starting the Next.js application
 */

const path = require('path');

// Set the working directory to the app root
process.chdir(path.join(__dirname, '..'));

async function initializeOpenCode() {
  console.log('🚀 Initializing OpenCode embedded server...');

  try {
    // Import the OpenCode client
    const { getOpencodeClient } = require('../src/lib/opencode.ts');

    // Initialize the client (this will start the embedded server if needed)
    const result = await getOpencodeClient();

    console.log('✅ OpenCode initialized successfully');
    console.log(`📡 Server URL: ${result.serverUrl}`);

    // Wait a moment for the server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    return result;
  } catch (error) {
    console.error('❌ Failed to initialize OpenCode:', error.message);
    console.error('Full error:', error);

    // Don't exit - let Next.js start anyway (it might work in fallback mode)
    console.log('⚠️  Continuing with Next.js startup despite OpenCode initialization failure');
    return null;
  }
}

async function startNextJs() {
  console.log('🚀 Starting Next.js application...');

  const { spawn } = require('child_process');

  // Start the Next.js standalone server
  const nextProcess = spawn('node', ['.next/standalone/server.js'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'production'
    }
  });

  // Handle process events
  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
    process.exit(code);
  });

  nextProcess.on('error', (error) => {
    console.error('Failed to start Next.js:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    nextProcess.kill('SIGTERM');
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    nextProcess.kill('SIGINT');
  });
}

async function main() {
  console.log('🔧 AI Command Center Startup Script');
  console.log('=====================================');

  // Initialize OpenCode first
  await initializeOpenCode();

  // Then start Next.js
  await startNextJs();
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
main().catch((error) => {
  console.error('Startup failed:', error);
  process.exit(1);
});
