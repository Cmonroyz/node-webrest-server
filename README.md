

# DEV
1. Clonar el .env.template como .env
2. instalar proyecto y dependencias con ``` npm install ```
3. levanta el proyecto con ``` npm run dev ```
4. Para ejecutar base de datos ```docker-compose up -d```
5. Crear una migracion con prisma ``` npx prisma migrate dev --name init ```


# Domain
Son las reglas que se van a imponer sobre todo lo demas

datasources: son los origenes de datos
repositories: