
## Uso
1. Cloná el repositorio haciendo git clone https://github.com/ramois/sidcomv2
2. Abrí el proyecto en su editor de código
3. npm init -y
4. npm install express jsonwebtoken bcryptjs @prisma/client dotenv typescript
5. npm install --save-dev ts-node-dev @types/express @types/jsonwebtoken @types/bcryptjs @types/node rimraf prisma
6. docker-compose up -d
7. npx prisma migrate dev 
8. En packege.json agregar los siguientes scripts : "dev": "tsnd --respawn --clear src/server.ts",   "build": "rimraf ./dist && tsc",   "start": "node dist/server.js"

## Requiere:
1. NODE: Se debe instalar NODE en el sistema operativo
2. DOCKER: Para poder levantar la imágen de Mongo en el contenedor
3. GIT: Debe tener Instalado GIT

