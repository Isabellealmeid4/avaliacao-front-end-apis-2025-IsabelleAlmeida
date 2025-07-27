document.addEventListener('DOMContentLoaded', () => {
    const URL_API_LOGIN = 'https://dummyjson.com/auth/login';

    const formularioLogin = document.getElementById('formularioLogin');
    const campoUsuario = document.getElementById('usuario');
    const campoSenha = document.getElementById('senha');
    const mensagemErro = document.getElementById('mensagemErro');

    formularioLogin.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const usuarioDigitado = campoUsuario.value;
        const senhaDigitada = campoSenha.value;

        mensagemErro.textContent = 'Verificando suas informações...';
        mensagemErro.style.color = '#007bff';

        try {
            const resposta = await fetch(URL_API_LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: usuarioDigitado,
                    password: senhaDigitada,
                }),
            });

            if (resposta.ok) {
                const dadosLogin = await resposta.json();
                console.log('Autenticação bem-sucedida. Dados recebidos da API:', dadosLogin);

                const dadosParaSalvar = {
                    username: dadosLogin.username,
                    token: dadosLogin.token
                };
                localStorage.setItem('dadosUsuarioLogado', JSON.stringify(dadosParaSalvar));

                mensagemErro.textContent = 'Login realizado com sucesso! Redirecionando...';
                mensagemErro.style.color = '#28a745';

                window.location.href = 'posts.html';
            } else {
                const dadosErro = await resposta.json();
                const mensagemDeErroApi = dadosErro.message || 'Usuário ou senha inválidos. Por favor, tente novamente.';
                console.error('Erro de autenticação da API:', mensagemDeErroApi);

                mensagemErro.textContent = mensagemDeErroApi;
                mensagemErro.style.color = '#e74c3c';
            }

        } catch (erro) {
            console.error('Erro de conexão ou rede:', erro);
            mensagemErro.textContent = 'Não foi possível conectar. Verifique sua conexão com a internet e tente novamente.';
            mensagemErro.style.color = '#e74c3c';
        }
    });
});