const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const manifestPath = path.join(projectRoot, 'assets/Elemental/manifest.js');
console.log('Loading manifest from:', manifestPath);

if (!fs.existsSync(manifestPath)) {
    console.error('ERROR: manifest.js does not exist!');
    process.exit(1);
}

// Read and parse manifest by reading file content and extracting JSON
const fileContent = fs.readFileSync(manifestPath, 'utf8');
const jsonString = fileContent.substring(fileContent.indexOf('{'));

// Quick eval/parse since it's JSON structure inside the JS export
// Strip the trailing semicolon/newline
const cleanJsonString = jsonString.trim().replace(/;$/, '');
const manifest = JSON.parse(cleanJsonString);

let missingFiles = 0;
let totalFiles = 0;

for (const [charKey, charAnims] of Object.entries(manifest)) {
    console.log(`Checking character [${charKey}]...`);
    for (const [animKey, framePaths] of Object.entries(charAnims)) {
        framePaths.forEach(relPath => {
            totalFiles++;
            const fullPath = path.join(projectRoot, relPath);
            if (!fs.existsSync(fullPath)) {
                console.error(`  ✕ MISSING FILE: ${relPath}`);
                missingFiles++;
            }
        });
    }
}

console.log(`\nVerification complete. Checked ${totalFiles} paths. Missing: ${missingFiles}`);
if (missingFiles > 0) {
    process.exit(1);
} else {
    console.log('SUCCESS: All files exist!');
}
