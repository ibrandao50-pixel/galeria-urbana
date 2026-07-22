const manifest=document.createElement('link');manifest.rel='manifest';manifest.href='manifest.webmanifest';document.head.appendChild(manifest);
const theme=document.createElement('meta');theme.name='theme-color';theme.content='#f2efe7';document.head.appendChild(theme);
const apple=document.createElement('link');apple.rel='apple-touch-icon';apple.href='assets/app-icon.svg';document.head.appendChild(apple);
let installPrompt;
const installButton=document.createElement('button');installButton.className='install-app hidden';installButton.textContent='↓ Instalar app';document.querySelector('.header-actions').prepend(installButton);
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;installButton.classList.remove('hidden')});
installButton.addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;installButton.classList.add('hidden')});
window.addEventListener('appinstalled',()=>installButton.classList.add('hidden'));
function updateOnlineStatus(){let badge=document.querySelector('.offline-badge');if(navigator.onLine){badge?.remove()}else if(!badge){badge=document.createElement('div');badge.className='offline-badge';badge.textContent='Modo offline — seu acervo continua disponível';document.body.appendChild(badge)}}
window.addEventListener('online',updateOnlineStatus);window.addEventListener('offline',updateOnlineStatus);updateOnlineStatus();
const isNative=window.Capacitor?.isNativePlatform?.()===true;
if(!isNative&&'serviceWorker'in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
