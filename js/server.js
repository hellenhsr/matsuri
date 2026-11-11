const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json()); 

// Configuração da conexão com o MySQL (tudo padrao, entao nao precisa de ENV, mas o ideal seria ter)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'sushi_delivery'
});

// Faz a conexao com o banco e retorna se deu certo
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
        return;
    }
    console.log('Conectado com sucesso ao MySQL!');
});

// Rota GET (PEGAR/TRAZER) para enviar os produtos ao front-end
app.get('/api/produtos', (req, res) => {
    // Busca apenas os produtos disponíveis e nao excluídos
    const sql = 'SELECT * FROM produtos WHERE disponivel = 1 AND exc_produto != 1';
    
    // Executa a query (select) e retorna os resultados em formato JSON (se der erro ou nao, retorna algo, nunca para)
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(results);
    });
});

// Rota POST (ENVIAR/GRAVAR) para cadastrar um novo usuário
app.post('/api/usuarios/cadastro', async (req, res) => {
    const { nome, email, telefone, cpf, senha } = req.body;
    
    // Validação básica para garantir que os dados chegaram (nao é validaçao de vazio, apenas se o front mandou algo)
    if (!nome || !email || !telefone || !cpf || !senha) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Gera um "salt" (fator de aleatoriedade) e encripta a palavra-passe
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const sql = 'INSERT INTO usuarios (nome, email, telefone, cpf, senha) VALUES (?, ?, ?, ?, ?)';
        
        // Passa a senhaHash em vez da senha original
        db.query(sql, [nome, email, telefone, cpf, senhaHash], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ erro: 'Este email já está registado.' });
                }
                return res.status(500).json({ erro: err.message });
            }
            res.status(201).json({ mensagem: 'Conta criada com sucesso!', id: result.insertId });
        });
    } catch (erro) {
        return res.status(500).json({ erro: 'Erro ao processar a segurança da conta.' });
    }
});

app.post('/api/usuarios/login', (req, res) => {
    const { email, senha } = req.body;

    // Procura apenas pelo email
    const sql = 'SELECT id, nome, email, senha FROM usuarios WHERE email = ?';
    
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });

        if (results.length > 0) {
            const usuario = results[0];
            
            // Compara a palavra-passe digitada com o hash guardado no banco
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            
            if (senhaValida) {
                // Remove a palavra-passe do objeto antes de enviar ao front-end por segurança
                delete usuario.senha;
                res.json({ mensagem: 'Login bem-sucedido!', usuario: usuario });
            } else {
                res.status(401).json({ erro: 'Email ou palavra-passe incorretos.' });
            }
        } else {
            res.status(401).json({ erro: 'Email ou palavra-passe incorretos.' });
        }
    });
});


app.listen(3000, () => console.log('Servidor rodando na porta 3000'));