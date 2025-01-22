const API_BASE_URL = "http://localhost:3000"; // Base URL da API

// Elementos do DOM
const enquetesList = document.getElementById('enquetes');
const enqueteDetalhes = document.getElementById('enquete-detalhes');
const enqueteTitulo = document.getElementById('enquete-titulo');
const enqueteDatas = document.getElementById('enquete-datas');
const opcoesList = document.getElementById('opcoes-list');
const voltarBtn = document.getElementById('voltar-btn');
const novaEnqueteBtn = document.getElementById('nova-enquete-btn');
const novaEnqueteSection = document.getElementById('nova-enquete');
const novaEnqueteForm = document.getElementById('nova-enquete-form');
const adicionarOpcaoBtn = document.getElementById('adicionar-opcao-btn');
const cancelarBtn = document.getElementById('cancelar-btn');
const opcoesContainer = document.getElementById('opcoes-container');

let opcaoCount = 0; // Contador para as opções

// Função para adicionar uma nova opção ao formulário de nova enquete
function adicionarOpcao() {
  opcaoCount++;
  const opcaoDiv = document.createElement('div');
  opcaoDiv.className = 'opcao-item';
  opcaoDiv.id = `opcao-item-${opcaoCount}`;

  const label = document.createElement('label');
  label.setAttribute('for', `opcao${opcaoCount}`);
  label.textContent = `Opção ${opcaoCount}:`;

  const input = document.createElement('input');
  input.type = 'text';
  input.id = `opcao${opcaoCount}`;
  input.name = `opcao${opcaoCount}`;
  input.required = true;


  opcaoDiv.appendChild(label);
  opcaoDiv.appendChild(input);
  opcoesContainer.appendChild(opcaoDiv);
}


// Adicionar as três opções iniciais
for (let i = 0; i < 3; i++) {
  adicionarOpcao();
}

// Evento para adicionar mais opções
adicionarOpcaoBtn.addEventListener('click', adicionarOpcao);

// Função para carregar todas as enquetes
async function carregarEnquetes() {
  enquetesList.innerHTML = ''; // Limpar lista de enquetes
  enqueteDetalhes.style.display = 'none'; // Ocultar detalhes da enquete
  novaEnqueteSection.style.display = 'none'; // Ocultar formulário de nova enquete
  novaEnqueteBtn.style.display = 'block'; // Mostrar botão de nova enquete

  try {
    const response = await fetch(`${API_BASE_URL}/enquetes`);
    const enquetes = await response.json();

    enquetes.forEach(enquete => {
      const card = document.createElement('div');
      card.className = 'enquete-card';
      
      // Determinar o status da enquete
      const now = new Date();
      let status = '';
      if (now < new Date(enquete.data_inicio)) {
        status = 'Não Iniciada';
      } else if (now > new Date(enquete.data_fim)) {
        status = 'Finalizada';
      } else {
        status = 'Em Andamento';
      }

      card.innerHTML = `
        <h3>${enquete.titulo}</h3>
        <p>Início: ${new Date(enquete.data_inicio).toLocaleString()}</p>
        <p>Fim: ${new Date(enquete.data_fim).toLocaleString()}</p>
        <p>Status: ${status}</p>
        <button onclick="mostrarDetalhes(${enquete.id})">Ver Detalhes</button>
        <button onclick="deletarEnquete(${enquete.id})" class="btn-deletar">Deletar</button>
      `;
      enquetesList.appendChild(card);
    });
  } catch (error) {
    console.error('Erro ao carregar enquetes:', error);
  }
}

// Função para mostrar os detalhes de uma enquete
async function mostrarDetalhes(id) {
  enquetesList.style.display = 'none'; // Ocultar lista de enquetes
  enqueteDetalhes.style.display = 'block'; // Mostrar detalhes da enquete
  novaEnqueteBtn.style.display = 'none'; // Ocultar botão de nova enquete
  document.getElementById('enquetes-titulo').style.display = 'none'; // Ocultar título "Enquetes Disponíveis"

  try {
    const response = await fetch(`${API_BASE_URL}/enquetes/${id}`);
    const enquete = await response.json();

    enqueteTitulo.textContent = enquete.titulo;
    enqueteDatas.textContent = `Início: ${new Date(enquete.data_inicio).toLocaleString()} | Fim: ${new Date(enquete.data_fim).toLocaleString()}`;
    opcoesList.innerHTML = '';

    const now = new Date();
    const isEnqueteAtiva = now >= new Date(enquete.data_inicio) && now <= new Date(enquete.data_fim);

    if (isEnqueteAtiva) {
      enquete.Opcoes.forEach(opcao => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${opcao.descricao}</span>
          <button onclick="votar(${opcao.id})">Votar</button>
          <span class="votos">${opcao.votos} votos</span>
        `;
        opcoesList.appendChild(li);
      });
    } else {
      const mensagem = document.createElement('p');
      mensagem.textContent = 'A enquete não está ativa no momento. Não é possível votar.';
      opcoesList.appendChild(mensagem);
    }
  } catch (error) {
    console.error('Erro ao carregar detalhes da enquete:', error);
  }
}

// Função para votar em uma opção
async function votar(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/opcoes/${id}/votar`, { method: 'PUT' });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao registrar voto');
    }

    const opcao = await response.json(); // Obtém a opção atualizada da resposta

    const mensagem = document.createElement('div');
    mensagem.className = 'mensagem-sucesso';
    mensagem.textContent = 'Voto registrado com sucesso!';
    document.body.appendChild(mensagem);

    // Adiciona a classe 'show' para iniciar a animação
    setTimeout(() => mensagem.classList.add('show'), 10);

    // Remove a mensagem após 3 segundos
    setTimeout(() => {
      mensagem.classList.remove('show');
      setTimeout(() => mensagem.remove(), 500);
    }, 3000);

    // Atualiza os dados na página após o voto sem recarregar
    const opcaoElement = document.querySelector(`button[onclick="votar(${id})"]`).parentElement;
    opcaoElement.querySelector('.votos').textContent = `${opcao.votos} votos`;
  } catch (error) {
    console.error('Erro ao registrar voto:', error);

    const mensagem = document.createElement('div');
    mensagem.className = 'mensagem-sucesso';
    mensagem.style.backgroundColor = '#dc3545'; // Cor de fundo para erro
    mensagem.textContent = 'Erro ao registrar voto. Tente novamente.';
    document.body.appendChild(mensagem);

    // Adiciona a classe 'show' para iniciar a animação
    setTimeout(() => mensagem.classList.add('show'), 10);

    // Remove a mensagem após 3 segundos
    setTimeout(() => {
      mensagem.classList.remove('show');
      setTimeout(() => mensagem.remove(), 500);
    }, 3000);
  }
}

// Função para deletar uma enquete
async function deletarEnquete(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/enquetes/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao deletar enquete');
    }

    // Remove a enquete da lista sem recarregar a página
    carregarEnquetes();
  } catch (error) {
    console.error('Erro ao deletar enquete:', error);

    const mensagem = document.createElement('div');
    mensagem.className = 'mensagem-sucesso';
    mensagem.style.backgroundColor = '#dc3545'; // Cor de fundo para erro
    mensagem.textContent = 'Erro ao deletar enquete. Tente novamente.';
    document.body.appendChild(mensagem);

    // Adiciona a classe 'show' para iniciar a animação
    setTimeout(() => mensagem.classList.add('show'), 10);

    // Remove a mensagem após 3 segundos
    setTimeout(() => {
      mensagem.classList.remove('show');
      setTimeout(() => mensagem.remove(), 500);
    }, 3000);
  }
}

// Função para criar uma nova enquete
novaEnqueteForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const titulo = document.getElementById('titulo').value;
  const data_inicio = document.getElementById('data_inicio').value;
  const data_fim = document.getElementById('data_fim').value;
  const opcoes = [];

  for (let i = 1; i <= opcaoCount; i++) {
    const opcao = document.getElementById(`opcao${i}`).value;
    if (opcao) {
      opcoes.push(opcao);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/enquetes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ titulo, data_inicio, data_fim, opcoes })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao criar enquete');
    }

    // Recarregar a lista de enquetes
    carregarEnquetes();

    // Limpar campos do formulário
    novaEnqueteForm.reset();
    opcoesContainer.innerHTML = '';
    opcaoCount = 0;
    for (let i = 0; i < 3; i++) {
      adicionarOpcao();
    }

    // Voltar para a tela inicial
    novaEnqueteSection.style.display = 'none';
    enquetesList.style.display = 'flex';
    novaEnqueteBtn.style.display = 'block';
    document.getElementById('enquetes-titulo').style.display = 'block';
  } catch (error) {
    console.error('Erro ao criar enquete:', error);

    const mensagem = document.createElement('div');
    mensagem.className = 'mensagem-sucesso';
    mensagem.style.backgroundColor = '#dc3545'; // Cor de fundo para erro
    mensagem.textContent = 'Erro ao criar enquete. Tente novamente.';
    document.body.appendChild(mensagem);

    // Adiciona a classe 'show' para iniciar a animação
    setTimeout(() => mensagem.classList.add('show'), 10);

    // Remove a mensagem após 3 segundos
    setTimeout(() => {
      mensagem.classList.remove('show');
      setTimeout(() => mensagem.remove(), 500);
    }, 3000);
  }
});

// Evento para mostrar o formulário de nova enquete
novaEnqueteBtn.addEventListener('click', () => {
  enquetesList.style.display = 'none';
  novaEnqueteSection.style.display = 'block';
  novaEnqueteBtn.style.display = 'none';
  document.getElementById('enquetes-titulo').style.display = 'none';
});

// Evento para cancelar a criação de nova enquete
cancelarBtn.addEventListener('click', () => {
  novaEnqueteSection.style.display = 'none';
  enquetesList.style.display = 'flex';
  novaEnqueteBtn.style.display = 'block';
  document.getElementById('enquetes-titulo').style.display = 'block';
});

// Evento para voltar à lista de enquetes
voltarBtn.addEventListener('click', () => {
  enqueteDetalhes.style.display = 'none';
  enquetesList.style.display = 'flex';
  novaEnqueteBtn.style.display = 'block'; // Mostrar botão de nova enquete
  document.getElementById('enquetes-titulo').style.display = 'block'; // Mostrar título "Enquetes Disponíveis"
});

// Carregar enquetes ao iniciar
carregarEnquetes();