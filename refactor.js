const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend/src/app');

function refactorFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    if (filePath.endsWith('globals.css')) {
        content = content.replace(/--background: #3fd0c9;/g, '--background: #0B0C10;');
        content = content.replace(/--foreground: #ffffff;/g, '--foreground: #C5C6C7;');
        content = content.replace(/background: #3fd0c9;/g, 'background: #0B0C10;');
    } else if (filePath.endsWith('.tsx')) {
        // Change body background
        content = content.replace(/bg-\[#3fd0c9\]/g, 'bg-[#0B0C10]');

        // Change text-white to platinum text (but only generic white text classes, not specific strings)
        content = content.replace(/text-white/g, 'text-[#C5C6C7]');
        // Fix up specific cases where we want white text
        // e.g., the Trade Now text on hover could be #0B0C10 instead of white

        // Card Refactoring
        content = content.replace(/bg-\[#61cd21\]\/10 backdrop-blur-md border border-\[#61cd21\]\/20/g, 'bg-[#1F2833] backdrop-blur-sm border border-[#45A29E]/20');
        content = content.replace(/hover:border-\[#61cd21\]\/50/g, 'hover:border-[#66FCF1]/70');

        // Buttons
        content = content.replace(/bg-\[#61cd21\] text-\[#C5C6C7\]/g, 'bg-[#45A29E] text-[#0B0C10]');
        content = content.replace(/bg-\[#61cd21\]/g, 'bg-[#45A29E]');
        content = content.replace(/hover:bg-\[#3fd0c9\] hover:text-\[#C5C6C7\]/g, 'hover:bg-[#66FCF1] hover:text-[#0B0C10]');

        // Badges & Views
        content = content.replace(/bg-\[#61cd21\]\/20/g, 'bg-[#45A29E]/20');
        content = content.replace(/border-\[#61cd21\]\/30/g, 'border-[#45A29E]/50');

        // Header Texts (but NOT the Trend$ logo style object)
        // We use lookaround to avoid replacing inside style={{ color: '#61cd21' }}
        content = content.replace(/(?<!style=\{\{\s*color:\s*')#61cd21/g, '#66FCF1');

        // We changed 'text-white' to 'text-[#C5C6C7]'. So we need to fix the button hover text:
        content = content.replace(/hover:text-\[#C5C6C7\]/g, 'hover:text-[#0B0C10]');

        // Fix text styles
        content = content.replace(/text-zinc-400/g, 'text-[#45A29E]');
        content = content.replace(/text-zinc-500/g, 'text-[#C5C6C7]/60');
        content = content.replace(/zinc-900/g, 'zinc-900/50');
    }

    fs.writeFileSync(filePath, content);
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
                console.log('Refactoring ' + fullPath);
                refactorFile(fullPath);
            }
        }
    });
}

walkDir(directoryPath);
console.log('Done!');
