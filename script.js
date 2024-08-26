document.addEventListener('DOMContentLoaded', () => {
    const newTaskButton = document.getElementById('new-task-button');
    const taskModal = document.getElementById('task-modal');
    const cancelButton = document.getElementById('cancel-button');
    const taskForm = document.getElementById('task-form');
    const editTaskModal = document.getElementById('edit-task-modal');
    const editCancelButton = document.getElementById('edit-cancel-button');
    const editTaskForm = document.getElementById('edit-task-form');
    
    const taskTitle = document.getElementById('task-title');
    const taskDescription = document.getElementById('task-description');
    const taskAssigned = document.getElementById('task-assigned');
    const taskPriority = document.getElementById('task-priority');
    const taskStatus = document.getElementById('task-status');
    const taskDeadline = document.getElementById('task-deadline');

    const editTaskTitle = document.getElementById('edit-task-title');
    const editTaskDescription = document.getElementById('edit-task-description');
    const editTaskAssigned = document.getElementById('edit-task-assigned');
    const editTaskPriority = document.getElementById('edit-task-priority');
    const editTaskStatus = document.getElementById('edit-task-status');
    const editTaskDeadline = document.getElementById('edit-task-deadline');

    let currentTaskDiv = null;

    newTaskButton.addEventListener('click', () => {
        clearForm();
        taskModal.classList.add('is-active');
    });

    cancelButton.addEventListener('click', closeModal);
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    editCancelButton.addEventListener('click', closeEditModal);

    function closeModal() {
        taskModal.classList.remove('is-active');
    }

    function closeEditModal() {
        editTaskModal.classList.remove('is-active');
    }

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskDiv = document.createElement('div');
        taskDiv.className = 'box';
        taskDiv.setAttribute('data-title', taskTitle.value);
        taskDiv.setAttribute('data-description', taskDescription.value);
        taskDiv.setAttribute('data-assigned', taskAssigned.value);
        taskDiv.setAttribute('data-priority', taskPriority.value);
        taskDiv.setAttribute('data-status', taskStatus.value);
        taskDiv.setAttribute('data-deadline', taskDeadline.value);
        taskDiv.innerHTML = `<strong>${taskTitle.value}</strong><p>${taskDescription.value}</p>`;
        const column = document.getElementById(taskStatus.value.toLowerCase().replace(' ', '-'));
        column.querySelector('.task-list-content').appendChild(taskDiv);

        taskDiv.addEventListener('click', () => openEditModal(taskDiv));

        closeModal();
    });

    function openEditModal(taskDiv) {
        event.preventDefault();

        currentTaskDiv = taskDiv;
        editTaskTitle.value = taskDiv.getAttribute('data-title');
        editTaskDescription.value = taskDiv.getAttribute('data-description');
        editTaskAssigned.value = taskDiv.getAttribute('data-assigned');
        editTaskPriority.value = taskDiv.getAttribute('data-priority');
        editTaskStatus.value = taskDiv.getAttribute('data-status');
        editTaskDeadline.value = taskDiv.getAttribute('data-deadline');

        

        editTaskModal.classList.add('is-active');
    }

    editTaskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        currentTaskDiv.setAttribute('data-title', editTaskTitle.value);
        currentTaskDiv.setAttribute('data-description', editTaskDescription.value);
        currentTaskDiv.setAttribute('data-assigned', editTaskAssigned.value);
        currentTaskDiv.setAttribute('data-priority', editTaskPriority.value);
        currentTaskDiv.setAttribute('data-status', editTaskStatus.value);
        currentTaskDiv.setAttribute('data-deadline', editTaskDeadline.value);
        currentTaskDiv.innerHTML = `<strong>${currentTaskDiv.getAttribute('data-title')}</strong><p>${currentTaskDiv.getAttribute('data-description')}</p>`;
        const column = document.getElementById(currentTaskDiv.getAttribute('data-status').toLowerCase().replace(' ', '-'));
        column.querySelector('.task-list-content').appendChild(currentTaskDiv);
        closeEditModal();
    });

    function clearForm() {
        taskTitle.value = '';
        taskDescription.value = '';
        taskAssigned.selectedIndex = 0;
        taskPriority.selectedIndex = 0;
        taskStatus.selectedIndex = 0;
        taskDeadline.value = '';
    }
});