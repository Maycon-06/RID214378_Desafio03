const taskList = document.querySelector('#task-list');
const inputTask = document.querySelector('#input-tarefa');
const inputLabel = document.querySelector('#input-etiqueta');
const addButton = document.querySelector('#btn-add');

// Carrega tarefas do localStorage e cria os cards
function carregarTasks() {
    console.log('Carregando tarefas...');

    // Limpa a lista antes de carregar as tarefas salvas
    taskList.innerHTML = '';

    const tasks = JSON.parse(localStorage.getItem('tarefas')) || [];

    tasks.forEach(task => {
        // Importante: salvar = false aqui, senão duplica
        criarTarefa(task.nome, task.etiqueta, task.data, task.concluida, false);
    });
}

// Salva todas as tarefas no localStorage
function salvarTask() {
    const tasksSalvas = [];

    document.querySelectorAll('.tarefas .tarefa').forEach(card => {
        const nome = card.querySelector('.titulo').textContent;
        const etiqueta = card.querySelector('.etiqueta').textContent;
        const data = card.querySelector('.data').textContent.replace('Criado em: ', '');
        const concluida = card.parentElement.classList.contains('done');

        tasksSalvas.push({ nome, etiqueta, data, concluida });
    });

    localStorage.setItem('tarefas', JSON.stringify(tasksSalvas));
}

// Cria uma nova tarefa visual
function criarTarefa(nome, etiqueta, dataCriada = null, concluida = false, salvar = true) {
    const dataAtual = dataCriada || new Date().toLocaleDateString('pt-BR');

    const card = document.createElement('div');
    card.classList.add('tarefas');
    if (concluida) card.classList.add('done');

    card.innerHTML = `
        <div class="tarefa">
            <div class="info">
                <p class="titulo">${nome}</p>
                <div class="detalhes">
                    <span class="etiqueta">${etiqueta}</span>
                    <span class="data">Criado em: ${dataAtual}</span>
                </div>
            </div>
            <div class="task-status"></div>
            ${concluida ? '' : '<button class="btn-concluir">Concluir</button>'}
        </div>
    `;

    taskList.appendChild(card);

    if (concluida) {
        const checkIcon = document.createElement('img');
        checkIcon.classList.add('check-icon');
        checkIcon.src = './assets/checked.svg';
        card.querySelector('.task-status').appendChild(checkIcon);

        const titulo = card.querySelector('.titulo');
        titulo.style.textDecoration = 'line-through';
        titulo.style.color = 'var(--cor-task-checked)';
    } else {
        const botao = card.querySelector('.btn-concluir');
        botao.addEventListener('click', () => concluirTarefa(card));
    }

    updateTaskCounter();

    if (salvar) {
        salvarTask();
    }
}

// Marca uma tarefa como concluída
function concluirTarefa(card) {
    card.classList.add('done');

    const botao = card.querySelector('.btn-concluir');
    if (botao) botao.remove();

    const checkIcon = document.createElement('img');
    checkIcon.classList.add('check-icon');
    checkIcon.src = './assets/checked.svg';
    card.querySelector('.task-status').appendChild(checkIcon);

    const titulo = card.querySelector('.titulo');
    titulo.style.textDecoration = 'line-through';
    titulo.style.color = 'var(--cor-task-checked)';

    salvarTask();
    updateTaskCounter();
}

// Atualiza o contador de tarefas concluídas
function updateTaskCounter() {
    const count = document.querySelectorAll('.tarefas.done').length;
    const texto = count === 1 ? 'tarefa concluída' : 'tarefas concluídas';
    document.querySelector('#task-counter').innerHTML = `<span>${count}</span> ${texto}`;
}

// Adiciona nova tarefa
addButton.addEventListener('click', () => {
    const nome = inputTask.value.trim();
    const etiqueta = inputLabel.value.trim();

    if (!nome || !etiqueta) return;

    criarTarefa(nome, etiqueta, null, false, true);

    inputTask.value = '';
    inputLabel.value = '';
});

// ⚠️ Chamada única e controlada
carregarTasks();
updateTaskCounter();
