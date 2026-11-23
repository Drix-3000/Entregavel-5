
const formulario = document.getElementById('cadastroForm');
const mensagem = document.getElementById('mensagemCadastro');

formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    mensagem.textContent = '';
    mensagem.style.color = 'red';

    // Verificar se as senhas são iguais
    if (senha !== confirmarSenha) {
        mensagem.textContent = 'As senhas não são iguais.';
        return;
    }

    const dados = {
        nome,
        cpf,
        telefone,
        email,
        senha
    };

    try {
        const resposta = await fetch('/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            mensagem.textContent = resultado.erro || 'Erro ao cadastrar.';
            return;
        }

        mensagem.style.color = 'green';
        mensagem.textContent = resultado.mensagem;

        formulario.reset();

    } catch (erro) {
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
        console.error(erro);
    }
});
