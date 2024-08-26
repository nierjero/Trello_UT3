document.addEventListener('DOMContentLoaded', () => {
    const newTaskButton = document.getElementById('new-task-button');
    const taskModal = document.getElementById('task-modal');
    const cancelButton = document.getElementById('cancel-button');
    const taskForm = document.getElementById('task-form');

    const taskTitle = document.getElementById('task-title');
    const taskDescription = document.getElementById('task-description');
    const taskAssigned = document.getElementById('task-assigned');
    const taskPriority = document.getElementById('task-priority');
    const taskStatus = document.getElementById('task-status');
    const taskDeadline = document.getElementById('task-deadline');

    newTaskButton.addEventListener('click', () => {
        clearForm();
        taskModal.classList.add('is-active');
    });

    cancelButton.addEventListener('click', closeModal);
    document.querySelector('.modal-close').addEventListener('click', closeModal);

    function closeModal() {
        taskModal.classList.remove('is-active');
    }

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskDiv = document.createElement('div');
        taskDiv.className = 'box';
        taskDiv.innerHTML = `<strong>${taskTitle.value}</strong><p>${taskDescription.value}</p>`;
        const column = document.getElementById(taskStatus.value.toLowerCase().replace(' ', '-'));
        column.querySelector('.task-list-content').appendChild(taskDiv);

        closeModal();
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