#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob').sync;

const rootDir = path.join(__dirname, '..');

// Map of package names to their locations
const packageMap = {
  '@mycomponents/utils': 'packages/core/utils',
  '@mycomponents/speech-to-text-core': 'packages/core/speech-to-text',
  '@mycomponents/text-to-speech-core': 'packages/core/text-to-speech',
  '@mycomponents/audio-recorder-core': 'packages/core/audio-recorder',
};

function convertWorkspaceToFile() {
  const packageJsonFiles = glob('**/package.json', {
    cwd: rootDir,
    ignore: ['node_modules/**', 'dist/**'],
  });

  packageJsonFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const pkg = JSON.parse(content);
    
    let modified = false;
    
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (pkg[depType]) {
        Object.keys(pkg[depType]).forEach(dep => {
          if (pkg[depType][dep] === 'workspace:*' && packageMap[dep]) {
            const relativePath = path.relative(
              path.dirname(filePath),
              path.join(rootDir, packageMap[dep])
            );
            pkg[depType][dep] = `file:${relativePath}`;
            modified = true;
            console.log(`Updated ${dep} in ${file} from workspace:* to file:${relativePath}`);
          }
        });
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n');
    }
  });
}

function revertToWorkspace() {
  const packageJsonFiles = glob('**/package.json', {
    cwd: rootDir,
    ignore: ['node_modules/**', 'dist/**'],
  });

  packageJsonFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const pkg = JSON.parse(content);
    
    let modified = false;
    
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (pkg[depType]) {
        Object.keys(pkg[depType]).forEach(dep => {
          if (pkg[depType][dep] && pkg[depType][dep].startsWith('file:') && packageMap[dep]) {
            pkg[depType][dep] = 'workspace:*';
            modified = true;
            console.log(`Reverted ${dep} in ${file} back to workspace:*`);
          }
        });
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n');
    }
  });
}

// Check command line argument
const command = process.argv[2];

if (command === 'convert') {
  console.log('Converting workspace:* to file: references...');
  convertWorkspaceToFile();
} else if (command === 'revert') {
  console.log('Reverting file: references back to workspace:*...');
  revertToWorkspace();
} else {
  console.log('Usage: node fix-workspaces.js [convert|revert]');
  process.exit(1);
}