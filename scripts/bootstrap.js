#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');

// Order matters - build dependencies first
const buildOrder = [
  // Core utilities first
  'packages/core/utils',
  
  // Then other core packages
  'packages/core/speech-to-text',
  'packages/core/text-to-speech', 
  'packages/core/audio-recorder',
  
  // Then web packages that depend on core
  'packages/web/react/tailwind',
];

console.log('🚀 Starting bootstrap process...\n');

// First, install root dependencies
console.log('📦 Installing root dependencies...');
try {
  execSync('npm install --ignore-workspaces', { 
    cwd: rootDir, 
    stdio: 'inherit' 
  });
} catch (error) {
  console.error('Failed to install root dependencies:', error.message);
  process.exit(1);
}

// Build each package in order
for (const pkg of buildOrder) {
  const pkgPath = path.join(rootDir, pkg);
  const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgPath, 'package.json'), 'utf8'));
  
  console.log(`\n📦 Building ${pkgJson.name}...`);
  
  try {
    // Install dependencies
    console.log('  Installing dependencies...');
    execSync('npm install --ignore-workspaces', { 
      cwd: pkgPath, 
      stdio: 'inherit' 
    });
    
    // Build the package
    if (pkgJson.scripts && pkgJson.scripts.build) {
      console.log('  Building...');
      execSync('npm run build', { 
        cwd: pkgPath, 
        stdio: 'inherit' 
      });
    }
    
    console.log(`  ✅ ${pkgJson.name} built successfully!`);
  } catch (error) {
    console.error(`  ❌ Failed to build ${pkgJson.name}:`, error.message);
    process.exit(1);
  }
}

console.log('\n✨ Bootstrap completed successfully!');
console.log('\nYou can now run:');
console.log('  - npm run storybook   # For Storybook');
console.log('  - npm run docs        # For Docusaurus');