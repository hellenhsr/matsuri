document.addEventListener("DOMContentLoaded", function() {
    let labelNome = document.getElementById('user-logged');
    const nomeUsuario = localStorage.getItem('nomeUser');
    if (nomeUsuario != "") {
        labelNome.innerText = "Olá, " + nomeUsuario + "!";
    } 
});

function carregarTemaSalvo() {
    const mudarTema = document.getElementById("tema");
    const temaSalvo = localStorage.getItem("tema");

    if (temaSalvo == "escuro") {
        mudarTema.checked = false;
    } else if (temaSalvo == "claro") {
        mudarTema.checked = true;
    }
    trocaDeTema();
}


function trocaDeTema() {
    const mudarTema = document.getElementById("tema");
    document.body.classList.toggle("claro", mudarTema.checked);

    const logo = document.getElementById("logo");
    if (mudarTema.checked) {
        logo.src = "img/claro/download-removebg-preview 1.png";


        localStorage.setItem("tema", "claro");
    }
    else {
        logo.src = "img/escuro/Inserir_um_título_2_-removebg-preview 1 (1).png";

        localStorage.setItem("tema", "escuro")
    }
}
window.addEventListener("load", carregarTemaSalvo);



const inputTelefone = document.querySelector('#telefone');


inputTelefone.addEventListener('input', (evento) => {

    let tel_formatado = evento.target.value;

    tel_formatado = tel_formatado.replace(/[^0-9() \-]+/g, '');

    evento.target.value = tel_formatado;


    if (tel_formatado[0] !== "(") {
        if (tel_formatado[0] !== undefined) {
            evento.target.value = "(" + tel_formatado[0];
        }
    }
    if (tel_formatado[1] !== "3") {
        if (tel_formatado[1] !== undefined) {
            evento.target.value = tel_formatado.slice(0, 1) + "3" + tel_formatado[1];
        }
    }
    if (tel_formatado[2] !== "1") {
        if (tel_formatado[2] !== undefined) {
            evento.target.value = tel_formatado.slice(0, 2) + "1" + tel_formatado[2];
        }
    }
    if (tel_formatado[3] !== ")") {
        if (tel_formatado[3] !== undefined) {
            evento.target.value = tel_formatado.slice(0, 3) + ") " + tel_formatado[3];
        }
    }
    if (tel_formatado[10] !== "-") {
        if (tel_formatado[10] !== undefined) {
            evento.target.value = tel_formatado.slice(0, 10) + "-" + tel_formatado[10];
        }
    }
});


function mascara_cpf() {
    var cpf_formatado = document.getElementById("cpf").value
    cpf_formatado = cpf_formatado.replace(/[^0-9.\-]+/g, '')
    if (cpf_formatado[3] != ".") {
        if (cpf_formatado[3] != undefined) {
            document.getElementById("cpf").value = cpf_formatado.slice(0, 3) + "." + cpf_formatado[3]
        }
    }
    if (cpf_formatado[7] != ".") {
        if (cpf_formatado[7] != undefined) {
            document.getElementById("cpf").value = cpf_formatado.slice(0, 7) + "." + cpf_formatado[7]
        }
    }
    if (cpf_formatado[11] != "-") {
        if (cpf_formatado[11] != undefined) {
            document.getElementById("cpf").value = cpf_formatado.slice(0, 11) + "-" + cpf_formatado[11]
        }
    }
}
function toggleCarrinho() {
    var carrinho = document.getElementById("carrinho-aba");
    carrinho.classList.toggle("ativo");
}

async function cadastrarUsuario(event) {
    event.preventDefault(); // Evita o recarregamento da página

    // Pegue os valores dos inputs (certifique-se de adicionar estes IDs no HTML)
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:3000/api/usuarios/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, telefone, cpf, senha })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Cadastro realizado com sucesso! Faça login.');
            window.location.href = 'login.html';
        } else {
            alert('Erro: ' + data.erro);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao conectar com o servidor.');
    }
}

async function fazerLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    try {
        const response = await fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            // Salva o usuário no armazenamento do navegador
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            alert('Bem-vindo, ' + data.usuario.nome + '!');
            localStorage.setItem('nomeUser', data.usuario.nome);
            window.location.href = 'index.html';
        } else {
            alert('Erro: ' + data.erro);
        }
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro ao conectar com o servidor.');
    }
}
