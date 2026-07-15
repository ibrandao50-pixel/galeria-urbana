const SUPABASE_URL='https://nwgtiwkehdbdidqpbocw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_NXa2pzePY3kzY4ml2FT76A_4hzgF6pP';
const cloud=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
let cloudReady=false,syncing=false;

function fromRow(row){return{id:row.id,title:row.title,artist:row.artist,year:row.year,status:row.status,location:row.location,lat:row.lat,lng:row.lng,image:row.image_url,manifesto:row.manifesto,impact:row.impact,community:row.community,funding:row.funding,instagram:row.instagram}}
function toRow(a){return{id:String(a.id),title:a.title,artist:a.artist,year:Number(a.year)||new Date().getFullYear(),status:a.status,location:a.location,lat:Number(a.lat),lng:Number(a.lng),image_url:a.image,manifesto:a.manifesto,impact:a.impact,community:a.community,funding:a.funding,instagram:a.instagram,updated_at:new Date().toISOString()}}
function syncNotice(message,error=false){let el=document.querySelector('#syncNotice');if(!el){el=document.createElement('div');el.id='syncNotice';el.className='offline-badge';document.body.appendChild(el)}el.textContent=message;el.style.background=error?'#a12b22':'#161616';clearTimeout(syncNotice.timer);syncNotice.timer=setTimeout(()=>el.remove(),3500)}

async function loadCloud(){const{data,error}=await cloud.from('obras').select('*').order('created_at',{ascending:false});if(error){syncNotice('Execute o arquivo supabase-setup.sql no Supabase.',true);return}cloudReady=true;if(data.length){arts=data.map(fromRow);originalSetItem.call(localStorage,'rua_arts',JSON.stringify(arts));render();if(map)initMap()}else syncNotice('Banco conectado — pronto para receber a primeira obra.')}

async function uploadDataImage(art){if(!art.image?.startsWith('data:'))return art.image;const response=await fetch(art.image),blob=await response.blob();const path=`${Date.now()}-${String(art.id).replace(/[^a-z0-9-]/gi,'')}.jpg`;const{error}=await cloud.storage.from('imagens-obras').upload(path,blob,{contentType:'image/jpeg',upsert:true});if(error)throw error;return cloud.storage.from('imagens-obras').getPublicUrl(path).data.publicUrl}

async function pushArts(nextArts){if(!cloudReady||syncing)return;syncing=true;try{const session=(await cloud.auth.getSession()).data.session;if(!session){syncNotice('Entre como curador para salvar na nuvem.',true);return}for(const art of nextArts)art.image=await uploadDataImage(art);const{error}=await cloud.from('obras').upsert(nextArts.map(toRow));if(error)throw error;originalSetItem.call(localStorage,'rua_arts',JSON.stringify(nextArts));syncNotice('Obra sincronizada com todos os visitantes.')}catch(error){syncNotice(`Falha ao sincronizar: ${error.message}`,true)}finally{syncing=false}}

const originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){originalSetItem.call(this,key,value);if(key==='rua_arts'&&!syncing){try{pushArts(JSON.parse(value))}catch{}}};

const adminForm=document.querySelector('#adminForm');adminForm.innerHTML='<input id="adminEmail" type="email" required placeholder="E-mail do curador"><input id="password" type="password" required placeholder="Senha"><small id="adminError"></small><button class="primary">Entrar como curador</button>';
document.querySelector('#adminModal p:not(.eyebrow)').textContent='Entre com a conta de curador cadastrada no Supabase.';
localStorage.removeItem('rua_admin');admin=false;render();
adminForm.onsubmit=async event=>{event.preventDefault();const button=adminForm.querySelector('button');button.disabled=true;button.textContent='Entrando…';const{error}=await cloud.auth.signInWithPassword({email:document.querySelector('#adminEmail').value,password:document.querySelector('#password').value});button.disabled=false;button.textContent='Entrar como curador';if(error)return document.querySelector('#adminError').textContent='E-mail ou senha inválidos.';admin=true;document.querySelector('#adminModal').close();render();syncNotice('Modo curador conectado.')};

cloud.auth.getSession().then(({data})=>{admin=!!data.session;render()});
cloud.channel('obras-publicas').on('postgres_changes',{event:'*',schema:'public',table:'obras'},()=>loadCloud()).subscribe();
loadCloud();
