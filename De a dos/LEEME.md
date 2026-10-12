# Gastos de a dos – Netlify

Estructura:
- public/index.html            -> la app
- netlify/functions/data.mjs   -> API (guarda en Netlify Blobs, compartido entre ambos)
- netlify.toml, package.json

Costo: plan gratuito de Netlify (sin tarjeta). La app consulta solo al abrirla y cada 60 s con la pantalla visible, para cuidar los créditos gratuitos.

## Deploy (recomendado: GitHub)
1. Subí esta carpeta a un repo de GitHub.
2. En Netlify: Add new site > Import from Git > elegí el repo (sin comando de build; publish dir: public).
3. Site configuration > Environment variables: creá APP_KEY con un código que elijan (protege tus datos).
4. Deploy. Abrí la URL en los dos celulares; la primera vez te pide el código.

## Deploy por CLI
npm install
npm i -g netlify-cli
netlify login && netlify init   (o netlify link)
netlify env:set APP_KEY "tu-codigo"
netlify deploy --prod
