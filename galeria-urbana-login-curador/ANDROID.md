# Gerar o APK Android do RUA

## Requisitos

- Node.js 22 ou superior
- Android Studio atualizado, com Android SDK instalado
- Java/JDK fornecido pelo Android Studio

## Primeira preparação

Abra um terminal nesta pasta e execute:

```powershell
npm install
npm run android:add
```

O primeiro comando instala o Capacitor 8. O segundo prepara `www` e cria o projeto nativo na pasta `android`.

## Gerar um APK de teste

```powershell
npm run android:apk
```

O APK será criado em:

`android/app/build/outputs/apk/debug/app-debug.apk`

## Abrir no Android Studio

```powershell
npm run android:open
```

No Android Studio, use **Build > Generate Signed App Bundle or APK** para criar uma versão assinada destinada à distribuição. Para publicar na Play Store, escolha **Android App Bundle (AAB)**.

## Depois de alterar o site

Execute novamente:

```powershell
npm run android:sync
```

Isso recria `www` somente com os arquivos públicos e atualiza o projeto Android. O site no GitHub Pages continua independente e não precisa da pasta `android`.
