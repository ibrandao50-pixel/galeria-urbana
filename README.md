# RUA — aplicativo multiplataforma

O projeto funciona como PWA instalável em Android, iOS, Windows, macOS e Linux. Para que instalação, GPS e modo offline funcionem, abra-o por HTTPS ou por um servidor local; abrir `index.html` diretamente serve apenas para visualização.

## Sincronização Supabase

O aplicativo está conectado ao Supabase. Execute `supabase-setup.sql` no SQL Editor do projeto e crie o usuário curador em **Authentication > Users > Add user**. Visitantes podem consultar; somente usuários autenticados podem publicar e editar. Nunca coloque uma chave `service_role` no aplicativo.

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
