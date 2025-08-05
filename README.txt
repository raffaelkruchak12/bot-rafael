
📦 BOT MODELO PARA CMD (WINDOWS)

1. Instale o Node.js: https://nodejs.org/
2. No CMD, vá até a pasta do bot:
   cd D:\DOCUMENTOS USUARIOS\RAFAEL\Documents\rafa-bot-ofc

3. Instale as dependências:
   npm install

4. Para rodar o bot normalmente:
   node index.js

5. Para manter o bot sempre ligado (mesmo com o CMD fechado):
   Instale o PM2:
   npm install pm2 -g

   Inicie o bot com PM2:
   pm2 start index.js --name RafaBot

6. Para ver se o bot está rodando:
   pm2 logs RafaBot

7. Para desligar o bot:
   pm2 stop RafaBot

Feito com ❤️
