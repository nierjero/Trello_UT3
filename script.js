document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/api/';

    const newTaskButton = document.getElementById('new-task-button');
    const newTaskButtonMobile = document.getElementById('new-task-button-mobile');
    const taskModal = document.getElementById('task-modal');
    const cancelButton = document.getElementById('cancel-button');
    const taskForm = document.getElementById('task-form');
    const editTaskModal = document.getElementById('edit-task-modal');
    const editCancelButton = document.getElementById('edit-cancel-button');
    const editTaskForm = document.getElementById('edit-task-form');
    const columns = document.querySelectorAll('.column');

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
    const eliminarTask = document.getElementById('eliminar-tarea');
    const eliminarConfirmarModal = document.getElementById('confirmar-eliminar');
    const siEliminar = document.getElementById('si-eliminar');
    const noEliminar = document.getElementById('no-eliminar');

    let currentTaskDiv = null;

    // Convierte el formato DD/MM/YYYY a YYYY-MM-DD
    function convertDateToApiFormat(dateStr) {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    }
    
    // Convierte el formato YYYY-MM-DD a DD/MM/YYYY para el campo de entrada
    function convertDateToInputFormat(dateStr) {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }
    
    // Formatea la fecha antes de asignarla a un atributo de datos
    function formatDateForDataAttribute(dateStr) {
        return dateStr.includes('/') ? convertDateToApiFormat(dateStr) : dateStr;
    }

    loadTasks();

    newTaskButton.addEventListener('click', () => {
        clearForm();
        taskModal.classList.add('is-active');
    });

    newTaskButtonMobile.addEventListener('click', () => {
        clearForm();
        taskModal.classList.add('is-active');
    });

    cancelButton.addEventListener('click', closeModal);
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    editCancelButton.addEventListener('click', closeEditModal);
    document.getElementById('edit-modal-close').addEventListener('click', closeEditModal);

    function closeModal() {
        taskModal.classList.remove('is-active');
    }

    function closeEditModal() {
        editTaskModal.classList.remove('is-active');
    }

    function closeConfirmModal() {
        eliminarConfirmarModal.classList.remove('is-active');
    }

    function createTaskDiv(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'box';
        taskDiv.setAttribute('data-id', task.id);
        taskDiv.setAttribute('data-title', task.title);
        taskDiv.setAttribute('data-description', task.description);
        taskDiv.setAttribute('data-assigned', task.assignedTo);
        taskDiv.setAttribute('data-priority', task.priority);
        taskDiv.setAttribute('data-status', task.status);
        taskDiv.setAttribute('data-deadline', formatDateForDataAttribute(task.endDate)); 
        taskDiv.setAttribute('draggable', 'true');
        taskDiv.innerHTML = `<strong>${task.title}</strong><p>${task.description}</p>`;

        taskDiv.addEventListener('dragstart', () => {
            taskDiv.classList.add('is-dragging');
        });

        taskDiv.addEventListener('dragend', () => {
            taskDiv.classList.remove('is-dragging');
            updateTask(taskDiv);
        });

        taskDiv.addEventListener('click', () => openEditModal(taskDiv));

        return taskDiv;
    }

    function loadTasks() {
        fetch(apiUrl + 'tasks')
            .then(response => response.json())
            .then(data => {
                console.log('Loaded tasks:', data);
                data.forEach(task => {
                    const taskDiv = createTaskDiv(task);
                    const column = document.getElementById(task.status);
                    if (column) {
                        column.querySelector('.task-list-content').appendChild(taskDiv);
                    }
                });
            })
            .catch(error => console.error('Error loading tasks:', error));
    }

    function addTask(task) {
        fetch(apiUrl + 'tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Added task:', data);
            const taskDiv = createTaskDiv(data);
            const column = document.getElementById(data.status);
            if (column) {
                column.querySelector('.task-list-content').appendChild(taskDiv);
            }
        })
        .catch(error => console.error('Error adding task:', error));
    }

    function updateTask(taskDiv) {
        const id = taskDiv.getAttribute('data-id');
        const updatedTask = {
            title: editTaskTitle.value,
            description: editTaskDescription.value,
            assignedTo: editTaskAssigned.value,
            priority: editTaskPriority.value,
            status: editTaskStatus.value,
            endDate: convertDateToApiFormat(editTaskDeadline.value),
        };
    
        fetch(`${apiUrl}tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        })
        .then(response => response.json())
        .then(updatedTask => {
            console.log('Task updated:', updatedTask);
            updateTaskDivAttributes(taskDiv, updatedTask);
        })
        .catch(error => console.error('Error updating task:', error));
    }

    function deleteTask(taskDiv) {
        const id = taskDiv.getAttribute('data-id');

        fetch(`${apiUrl}tasks/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            taskDiv.remove();
        })
        .catch(error => console.error('Error deleting task:', error));
    }

    function openEditModal(taskDiv) {
        currentTaskDiv = taskDiv;
        editTaskTitle.value = taskDiv.getAttribute('data-title');
        editTaskDescription.value = taskDiv.getAttribute('data-description');
        editTaskAssigned.value = taskDiv.getAttribute('data-assigned');
        editTaskPriority.value = taskDiv.getAttribute('data-priority');
        editTaskStatus.value = taskDiv.getAttribute('data-status');
        // Convierte la fecha del formato YYYY-MM-DD al formato DD/MM/YYYY para mostrar
        editTaskDeadline.value = convertDateToInputFormat(taskDiv.getAttribute('data-deadline')); 
        editTaskModal.classList.add('is-active');
    }
    
    editTaskForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        if (currentTaskDiv) {
            const updatedTask = {
                title: editTaskTitle.value,
                description: editTaskDescription.value,
                assignedTo: editTaskAssigned.value,
                priority: editTaskPriority.value,
                status: editTaskStatus.value,
                endDate: convertDateToApiFormat(editTaskDeadline.value),
            };
    
            updateTask(currentTaskDiv); // Asegúrate de que esta función se llama correctamente
            updateTaskDivAttributes(currentTaskDiv, updatedTask);
            closeEditModal();
        }
    });

    eliminarTask.addEventListener('click', () => {
        if (currentTaskDiv) {
            eliminarConfirmarModal.classList.add('is-active');
            closeEditModal();
        }
    });

    siEliminar.addEventListener('click', () => {
        if (currentTaskDiv) {
            deleteTask(currentTaskDiv);
            closeConfirmModal();
        }
    });

    noEliminar.addEventListener('click', () => {
        closeConfirmModal();
    });

    function clearForm() {
        taskTitle.value = '';
        taskDescription.value = '';
        taskAssigned.selectedIndex = 0; 
        taskPriority.selectedIndex = 0; 
        taskStatus.selectedIndex = 0;
        taskDeadline.value = ''; 
    }

    function updateTaskDivAttributes(taskDiv, task) {
        taskDiv.setAttribute('data-title', task.title);
        taskDiv.setAttribute('data-description', task.description);
        taskDiv.setAttribute('data-assigned', task.assignedTo);     
        taskDiv.setAttribute('data-priority', task.priority); 
        taskDiv.setAttribute('data-status', task.status);
        taskDiv.setAttribute('data-deadline', formatDateForDataAttribute(task.endDate));  
        taskDiv.innerHTML = `<strong>${task.title}</strong><p>${task.description}</p>`;
    }

    columns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(column, e.clientY);
            const taskList = column.querySelector('.task-list-content');
            const draggingTask = document.querySelector('.is-dragging');
            if (afterElement == null) {
                taskList.appendChild(draggingTask);
            } else {
                taskList.insertBefore(draggingTask, afterElement);
            }
        });

        column.addEventListener('drop', (e) => {
            const draggingTask = document.querySelector('.is-dragging');
            if (draggingTask) {
                const newStatus = column.id;
                draggingTask.setAttribute('data-status', newStatus);
                updateTask(draggingTask);
            }
        });
    });

    function getDragAfterElement(column, y) {
        const taskElements = [...column.querySelectorAll('.task-list-content .box:not(.is-dragging)')];

        return taskElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
