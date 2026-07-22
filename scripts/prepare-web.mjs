import {copyFileSync,existsSync,mkdirSync,readdirSync,rmSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=join(root,'www');
const files=['index.html','styles.css','app.js','sync.js','pwa.js','service-worker.js','manifest.webmanifest'];

if(existsSync(output))rmSync(output,{recursive:true,force:true});
mkdirSync(output,{recursive:true});
for(const file of files)copyFileSync(join(root,file),join(output,file));
const copyDirectory=(source,destination)=>{
  mkdirSync(destination,{recursive:true});
  for(const entry of readdirSync(source,{withFileTypes:true})){
    const from=join(source,entry.name),to=join(destination,entry.name);
    if(entry.isDirectory())copyDirectory(from,to);else copyFileSync(from,to);
  }
};
copyDirectory(join(root,'assets'),join(output,'assets'));
console.log(`Arquivos web preparados em ${output}`);
