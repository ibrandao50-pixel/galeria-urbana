# RUA — aplicativo multiplataforma

O projeto funciona como PWA instalável em Android, iOS, Windows, macOS e Linux. Para que instalação, GPS e modo offline funcionem, abra-o por HTTPS ou por um servidor local; abrir `index.html` diretamente serve apenas para visualização.

## Sincronização Supabase

O aplicativo está conectado ao Supabase. Execute `supabase-setup.sql` no SQL Editor do projeto e crie o usuário curador em **Authentication > Users > Add user**. Visitantes podem consultar; somente usuários autenticados podem publicar e editar. Nunca coloque uma chave `service_role` no aplicativo.

Se o banco já foi configurado com uma versão anterior, execute também `supabase-atualizacao-exclusao.sql` uma vez. Essa atualização permite apagar do Storage as fotografias vinculadas às obras excluídas.

Para habilitar curtidas públicas sincronizadas, execute `supabase-atualizacao-curtidas.sql` uma vez. A publicação e edição continuam restritas a curadores autenticados pelas políticas do banco.

Execute também `supabase-atualizacao-curtidas-v2.sql` nas instalações existentes. Ele reforça uma única curtida por obra e navegador, mantém a leitura pública do contador e confirma a publicação Realtime. Trocar o nome de visitante não altera o identificador da curtida.

As curtidas estão temporariamente ocultas por `FEATURES.likes=false` no início de `app.js`. O código e os dados permanecem preservados. Para reativar futuramente, altere somente esse valor para `true`.

Por segurança, o modo curador exige e-mail e senha novamente a cada abertura do aplicativo. Sessões antigas não abrem diretamente o formulário de publicação.

Durante uma sessão administrativa, o cabeçalho exibe **Sair do modo curador**. Essa ação encerra a autenticação e oculta imediatamente todos os controles de publicação, edição e exclusão.

Execute `supabase-atualizacao-editor-site.sql` para habilitar **Editar site** no modo curador. O editor controla a abertura, imagem principal, título do acervo e seção Sobre, com sincronização pública em tempo real.

## Executar localmente

Com Node.js instalado:

```sh
npm install
npm run serve
```

Acesse o endereço exibido e use **Instalar app**. No iPhone/iPad, use **Compartilhar → Adicionar à Tela de Início**.

## Empacotar para Android e iOS

```sh
npm install
npm run cap:android
npm run cap:ios
npm run cap:sync
```

Android requer Android Studio. A compilação para iOS requer macOS e Xcode. Antes de publicar, substitua a senha demonstrativa por autenticação segura em um servidor.

Para Android, a estrutura foi corrigida para usar uma pasta `www` limpa em vez da raiz do projeto. Consulte `ANDROID.md` para gerar o APK de teste ou o AAB de publicação.
