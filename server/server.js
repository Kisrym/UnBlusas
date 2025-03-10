const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao banco de dados
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

db.connect(err => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        process.exit(1);
    }
    console.log("Banco de dados conectado!");
});

// Rota para cadastrar usuários
app.post("/cadastrar", async (req, res) => {
    const { nome, email, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    const sql = "INSERT INTO dados (nome, email, senha) VALUES (?, ?, ?)";
    db.query(sql, [nome, email, senhaHash], (err, result) => {
        if (err) return res.json({ mensagem: "Erro no cadastro" });
        res.json({ mensagem: "Cadastro realizado com sucesso!" });
    });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));