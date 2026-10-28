const esbuild=require('/Users/jorge-guzman/Naowee/sdk-frontend-react/node_modules/esbuild');
const fs=require('fs'),path=require('path');
const dir='/Users/jorge-guzman/Naowee/demo-coc-design-landing-platform/vendor/stencil/nwt';
const ids=fs.readdirSync(dir).filter(f=>f.endsWith('.entry.js')).map(f=>f.replace('.entry.js',''));
esbuild.build({entryPoints:[dir+'/nwt.esm.js'],bundle:true,format:'iife',minify:true,target:'es2019',
 outfile:'/Users/jorge-guzman/Naowee/demo-coc-design-landing-platform/vendor/stencil/nwt.bundle.js',
 define:{'import.meta.url':'""'},
 alias:{'@naowee-tech/sdk-frontend-web':'/Users/jorge-guzman/Naowee/demo-coc-design-landing-platform/platform/assets/sdk-web-stub.js'},
 plugins:[{name:'static-entries',setup(b){b.onLoad({filter:/p-DcJgWA0r\.js$/},a=>{
  let s=fs.readFileSync(a.path,'utf8');
  const re=/import\(`\.\/\$\{l\}\.entry\.js\$\{f\?"\?"\+f:""\}`\)/;
  if(!re.test(s))throw new Error('patrón no encontrado');
  const map='({'+ids.map(i=>`"${i}":()=>import("./${i}.entry.js")`).join(',')+'})[l]()';
  return {contents:s.replace(re,map),loader:'js',resolveDir:dir};});}}]
}).then(()=>console.log('ok'),e=>{console.error(e.message);process.exit(1)});
