let allPosts = [];
let allUsers = []; 

document.addEventListener('DOMContentLoaded', () => {
    const nomeUsuarioHeader = document.getElementById('nomeUsuarioHeader');
    const botaoSair = document.getElementById('botaoSair');
    const searchInput = document.getElementById('searchInput');
    const mainContent = document.querySelector('main');

    const postModal = document.getElementById('postModal');
    const modalPostTitle = document.getElementById('modalPostTitle');
    const modalPostContent = document.getElementById('modalPostContent');
    const modalCloseButton = document.querySelector('.modal-close-button');

    const dadosUsuarioString = localStorage.getItem('dadosUsuarioLogado');
    let dadosUsuario = null;

    function forceLogout(message = 'Sua sessão é inválida. Por favor, faça o login novamente.') {
        localStorage.removeItem('dadosUsuarioLogado');
        if (nomeUsuarioHeader) {
            nomeUsuarioHeader.textContent = 'Visitante';
        }
        mainContent.innerHTML = `<p style="text-align: center; margin-top: 50px; font-size: 1.5em; color: #e74c3c;">${message}</p>`;
        if (searchInput) {
            searchInput.disabled = true;
        }
        if (botaoSair) {
            botaoSair.style.display = 'none';
        }
        alert(message);
    }

    if (dadosUsuarioString) {
        try {
            dadosUsuario = JSON.parse(dadosUsuarioString);

            console.log('Dados do usuário logado carregados:', dadosUsuario);
        } catch (e) {
            console.error('Erro ao parsear dados do usuário do localStorage ou sessão inválida:', e);
            forceLogout('Erro ao carregar dados da sessão. Por favor, faça o login novamente.');
            return;
        }
    } else {
        forceLogout('Você não está logado. Por favor, faça o login novamente.');
        return;
    }

    if (botaoSair) {
        botaoSair.addEventListener('click', () => {
            forceLogout('Você foi desconectado(a).');
            window.location.href = 'login.html';
        });
    }

    function renderPosts(postsToDisplay) {
        mainContent.innerHTML = '';

        if (postsToDisplay.length === 0) {
            mainContent.innerHTML = '<p>Nenhum post encontrado para os critérios de busca.</p>';
            return;
        }

        postsToDisplay.forEach(post => {
            const card = document.createElement('div');
            card.classList.add('card-post');
            card.dataset.postId = post.id;

            card.innerHTML = `
                <div>
                    <h2>${post.title}</h2>
                    <p>${post.body.substring(0, 40)}...</p>
                    <small>ID do Post: ${post.id} | ID do Usuário: ${post.userId}</small>
                </div>
            `;
            card.addEventListener('click', () => openPostModal(post.id));
            mainContent.appendChild(card);
        });
    }

    function renderUsers(usersToDisplay) { 
        mainContent.innerHTML = '';

        if (usersToDisplay.length === 0) {
            mainContent.innerHTML = '<p>Nenhum usuário encontrado para a busca.</p>';
            return;
        }

        usersToDisplay.forEach(user => {
            const userCard = document.createElement('div');
            userCard.classList.add('card-user');
            userCard.innerHTML = `
                <div>
                    <h3>${user.username}</h3>
                    <p>Nome Completo: ${user.name}</p>
                    <p>Email: ${user.email}</p>
                    <p>Cidade: ${user.address.city}</p>
                    <small>ID do Usuário: ${user.id}</small>
                </div>
            `;
            mainContent.appendChild(userCard);
        });
    }

    async function openPostModal(postId) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
            if (!response.ok) {
                throw new Error('Erro ao carregar detalhes do post.');
            }
            const postDetails = await response.json();

            modalPostTitle.textContent = postDetails.title;
            modalPostContent.textContent = postDetails.body;

            postModal.classList.add('show');
        } catch (error) {
            console.error('Erro ao abrir o modal do post:', error);
            alert('Não foi possível carregar os detalhes do post. Tente novamente.');
        }
    }

    function closePostModal() {
        postModal.classList.remove('show');
    }

    modalCloseButton.addEventListener('click', closePostModal);
    postModal.addEventListener('click', (event) => {
        if (event.target === postModal) {
            closePostModal();
        }
    });

    async function loadData() {
        try {
            const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
            if (!postsResponse.ok) {
                throw new Error('Erro na rede ou na API ao carregar posts.');
            }
            allPosts = await postsResponse.json();

            const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!usersResponse.ok) {
                throw new Error('Erro na rede ou na API ao carregar usuários.');
            }
            allUsers = await usersResponse.json(); 

            applyFilters();
        } catch (erro) {
            console.error('Erro ao carregar dados:', erro);
            mainContent.innerHTML = '<p style="color: red;">Não foi possível carregar os dados. Tente novamente mais tarde.</p>';
        }
    }

    function applyFilters() {
        const postSearchTerm = searchInput.value.toLowerCase().trim();
        let filteredPosts = allPosts;

        if (postSearchTerm !== '') {
            filteredPosts = filteredPosts.filter(post =>
                post.title.toLowerCase().includes(postSearchTerm)
            );
        }

        renderPosts(filteredPosts);
    }

    loadData();

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
});