import express from "express";
import session from "express-session";
import verificarAutenticacao from "./seguranca/autenticar.js";

const app = express();
const porta = 3000;
const host = "0.0.0.0";
//0.0.0.0 permite acesso à aplicação vindas de todas as interfaces de rede

//configurar o servidor para usar o express-session
app.use(
  session({
    secret: "meuS3gredo",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60, //15 minutos ocioso até encerrar a sessão
    },
  })
);

// app.get("/dinheiro", (requisicao, resposta) => {
//   resposta.send(`<h1>R$${Math.random() * 1000}</h1>`);
// }); //rota para o endpoint /dinheiro

app.use(express.urlencoded({ extended: true }));
//configura o middleware para aceitar o corpo da requisição em um formato URL - encoded.

app.post("/login", (requisicao, resposta) => {
  const usuario = requisicao.body.usuario;
  const senha = requisicao.body.senha;

  if (usuario == "admin@admin" && senha == "admin") {
    requisicao.session.autenticado = true;
    resposta.redirect("/menu.html");
  } else {
    resposta.redirect("/invalid.html");
    // send(
    //   "<span>Usuário e senha inválidos!</span> <a href='/login.html'>Tente Novamente.</a>"
    // );
  }
});
app.get("/logout", (requisicao, resposta) => {
  requisicao.session.destroy();
  resposta.redirect("/login.html");
});

//configurando o servidor para prover arquivos estáticos
app.use(express.static("publico"));

//middleware = verificarAutenticacao
app.use(verificarAutenticacao, express.static("privado"));

app.listen(porta, host, () => {
  console.log(`Servidor em execução em http://${host}:${porta}`); // template literals
});
