
## Uso
1. Cloná el repositorio haciendo git clone https://github.com/ramois/sidcomv2
2. Abrí el proyecto en su editor de código
3. npm init -y
4. npm install express jsonwebtoken bcryptjs @prisma/client dotenv typescript
5. npm install --save-dev ts-node-dev @types/express @types/jsonwebtoken @types/bcryptjs @types/node rimraf prisma
6. npx tsc --init --outDir dist/ --rootDir src
7. Agregar carpetas excluídas e incluídas al archivo de configuración de TypeScript "exclude": ["node_modules","dist" ], "include": ["src"] 
8. npx prisma init
9. npx prisma generate
10. Agregar los modelos en schema.prisma
11. npmx prisma migrate dev
12. docker-compose up -d
13. Agregar los siguientes scripts: "dev": "tsnd --respawn --clear src/app.ts",   "build": "rimraf ./dist && tsc",   "start": "npm run build && node dist/app.js"

## Requiere:
1. NODE: Se debe instalar NODE en el sistema operativo
2. DOCKER: Para poder levantar la imágen de Mongo en el contenedor
3. GIT: Debe tener Instalado GIT

