document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initCalendar();
    loadTodos();
    loadNotes();
    loadBookmarks();
    loadShoppingItems();
    loadDailyPlan();
    loadProjects();
    
    // Set up event listeners
    setupEventListeners();
});

// API Endpoints
const API = {
    todos: '/api/todos/',
    events: '/api/events/',
    notes: '/api/notes/',
    bookmarks: '/api/bookmarks/',
    shopping: '/api/shopping/',
    dailyPlans: '/api/daily-plans/',
    projects: '/api/projects/',
    tasks: '/api/tasks/'
};

// Calendar Initialization
function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: function(info, successCallback, failureCallback) {
            fetch(API.events)
                .then(response => response.json())
                .then(data => {
                    const events = data.map(event => ({
                        id: event.id,
                        title: event.title,
                        start: event.start_time,
                        end: event.end_time,
                        allDay: event.all_day
                    }));
                    successCallback(events);
                })
                .catch(error => {
                    console.error('Error fetching calendar events:', error);
                    failureCallback(error);
                });
        },
        eventClick: function(info) {
            // Handle event click
            alert(`Event: ${info.event.title}`);
        },
        dateClick: function(info) {
            // Handle date click - could open modal to add event
            const title = prompt('Enter event title:');
            if (title) {
                // Create a new event
                const newEvent = {
                    title: title,
                    start_time: info.dateStr + 'T09:00:00',
                    end_time: info.dateStr + 'T10:00:00',
                    all_day: false
                };
                
                createCalendarEvent(newEvent);
            }
        }
    });
    
    calendar.render();
}

// To-Do List Functions
function loadTodos() {
    fetch(API.todos)
        .then(response => response.json())
        .then(data => {
            const todoList = document.getElementById('todo-list');
            todoList.innerHTML = '';
            
            data.forEach(todo => {
                const li = document.createElement('li');
                li.className = `list-group-item ${todo.completed ? 'completed-task' : ''}`;
                li.dataset.id = todo.id;
                
                li.innerHTML = `
                    <div>
                        <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodoComplete(${todo.id}, this.checked)">
                        <span>${todo.title}</span>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-danger" onclick="deleteTodo(${todo.id})">Delete</button>
                    </div>
                `;
                
                todoList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading todos:', error));
}

function createTodo(todo) {
    fetch(API.todos, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(todo)
    })
    .then(response => response.json())
    .then(() => loadTodos())
    .catch(error => console.error('Error creating todo:', error));
}

function toggleTodoComplete(id, completed) {
    fetch(`${API.todos}${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ completed: completed })
    })
    .then(response => response.json())
    .then(() => loadTodos())
    .catch(error => console.error('Error updating todo:', error));
}

function deleteTodo(id) {
    fetch(`${API.todos}${id}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(() => loadTodos())
    .catch(error => console.error('Error deleting todo:', error));
}

// Notes Functions
function loadNotes() {
    fetch(API.notes)
        .then(response => response.json())
        .then(data => {
            const notesList = document.getElementById('notes-list');
            notesList.innerHTML = '';
            
            data.forEach(note => {
                const noteDiv = document.createElement('div');
                noteDiv.className = 'note-card';
                noteDiv.dataset.id = note.id;
                
                noteDiv.innerHTML = `
                    <h6>${note.title}</h6>
                    <p>${note.content}</p>
                    <button class="btn btn-sm btn-danger" onclick="deleteNote(${note.id})">Delete</button>
                `;
                
                notesList.appendChild(noteDiv);
            });
        })
        .catch(error => console.error('Error loading notes:', error));
}

function createNote(note) {
    fetch(API.notes, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(note)
    })
    .then(response => response.json())
    .then(() => {
        loadNotes();
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
    })
    .catch(error => console.error('Error creating note:', error));
}

function deleteNote(id) {
    fetch(`${API.notes}${id}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(() => loadNotes())
    .catch(error => console.error('Error deleting note:', error));
}

// Bookmarks Functions
function loadBookmarks() {
    fetch(API.bookmarks)
        .then(response => response.json())
        .then(data => {
            const bookmarksList = document.getElementById('bookmarks-list');
            bookmarksList.innerHTML = '';
            
            data.forEach(bookmark => {
                const bookmarkDiv = document.createElement('div');
                bookmarkDiv.className = 'bookmark-item';
                bookmarkDiv.dataset.id = bookmark.id;
                
                bookmarkDiv.innerHTML = `
                    <a href="${bookmark.url}" target="_blank">${bookmark.title}</a>
                    <button class="btn btn-sm btn-danger" onclick="deleteBookmark(${bookmark.id})">Delete</button>
                `;
                
                bookmarksList.appendChild(bookmarkDiv);
            });
        })
        .catch(error => console.error('Error loading bookmarks:', error));
}

function createBookmark(bookmark) {
    fetch(API.bookmarks, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(bookmark)
    })
    .then(response => response.json())
    .then(() => {
        loadBookmarks();
        document.getElementById('bookmark-title').value = '';
        document.getElementById('bookmark-url').value = '';
    })
    .catch(error => console.error('Error creating bookmark:', error));
}

function deleteBookmark(id) {
    fetch(`${API.bookmarks}${id}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(() => loadBookmarks())
    .catch(error => console.error('Error deleting bookmark:', error));
}

// Shopping List Functions
function loadShoppingItems() {
    fetch(API.shopping)
        .then(response => response.json())
        .then(data => {
            const shoppingList = document.getElementById('shopping-list');
            shoppingList.innerHTML = '';
            
            data.forEach(item => {
                const li = document.createElement('li');
                li.className = `list-group-item ${item.purchased ? 'purchased-item' : ''}`;
                li.dataset.id = item.id;
                
                li.innerHTML = `
                    <div>
                        <input type="checkbox" ${item.purchased ? 'checked' : ''} onchange="toggleItemPurchased(${item.id}, this.checked)">
                        <span>${item.quantity} x ${item.name}</span>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-danger" onclick="deleteShoppingItem(${item.id})">Delete</button>
                    </div>
                `;
                
                shoppingList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading shopping items:', error));
}

function createShoppingItem(item) {
    fetch(API.shopping, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(item)
    })
    .then(response => response.json())
    .then(() => {
        loadShoppingItems();
        document.getElementById('shopping-item').value = '';
        document.getElementById('shopping-quantity').value = '1';
    })
    .catch(error => console.error('Error creating shopping item:', error));
}

function toggleItemPurchased(id, purchased) {
    fetch(`${API.shopping}${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ purchased: purchased })
    })
    .then(response => response.json())
    .then(() => loadShoppingItems())
    .catch(error => console.error('Error updating shopping item:', error));
}

function deleteShoppingItem(id) {
    fetch(`${API.shopping}${id}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(() => loadShoppingItems())
    .catch(error => console.error('Error deleting shopping item:', error));
}

// Daily Planner Functions
function loadDailyPlan() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('planner-date').value = today;
    
    fetch(`${API.dailyPlans}?date=${today}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const plan = data[0];
                document.getElementById('morning-tasks').value = plan.morning_tasks || '';
                document.getElementById('afternoon-tasks').value = plan.afternoon_tasks || '';
                document.getElementById('evening-tasks').value = plan.evening_tasks || '';
                document.getElementById('planner-notes').value = plan.notes || '';
            } else {
                document.getElementById('morning-tasks').value = '';
                document.getElementById('afternoon-tasks').value = '';
                document.getElementById('evening-tasks').value = '';
                document.getElementById('planner-notes').value = '';
            }
        })
        .catch(error => console.error('Error loading daily plan:', error));
}

function saveDailyPlan() {
    const date = document.getElementById('planner-date').value;
    const morningTasks = document.getElementById('morning-tasks').value;
    const afternoonTasks = document.getElementById('afternoon-tasks').value;
    const eveningTasks = document.getElementById('evening-tasks').value;
    const notes = document.getElementById('planner-notes').value;
    
    fetch(`${API.dailyPlans}?date=${date}`)
        .then(response => response.json())
        .then(data => {
            const plan = {
                date: date,
                morning_tasks: morningTasks,
                afternoon_tasks: afternoonTasks,
                evening_tasks: eveningTasks,
                notes: notes
            };
            
            if (data.length > 0) {
                // Update existing plan
                fetch(`${API.dailyPlans}${data[0].id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify(plan)
                })
                .then(response => response.json())
                .then(() => alert('Daily plan updated!'))
                .catch(error => console.error('Error updating daily plan:', error));
            } else {
                // Create new plan
                fetch(API.dailyPlans, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify(plan)
                })
                .then(response => response.json())
                .then(() => alert('Daily plan saved!'))
                .catch(error => console.error('Error creating daily plan:', error));
            }
        })
        .catch(error => console.error('Error checking daily plan:', error));
}

// Projects Functions
function loadProjects() {
    fetch(API.projects)
        .then(response => response.json())
        .then(data => {
            const projectsList = document.getElementById('projects-list');
            projectsList.innerHTML = '';
            
            data.forEach(project => {
                const projectDiv = document.createElement('div');
                projectDiv.className = `project-card status-${project.status}`;
                projectDiv.dataset.id = project.id;
                
                let statusText = '';
                switch(project.status) {
                    case 'not_started': statusText = 'Not Started'; break;
                    case 'in_progress': statusText = 'In Progress'; break;
                    case 'completed': statusText = 'Completed'; break;
                    case 'on_hold': statusText = 'On Hold'; break;
                }
                
                projectDiv.innerHTML = `
                    <h5>${project.name}</h5>
                    <p>${project.description || ''}</p>
                    <div class="d-flex justify-content-between">
                        <span>Status: ${statusText}</span>
                        <span>
                            <button class="btn btn-sm btn-primary" onclick="showProjectTasks(${project.id})">Tasks</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteProject(${project.id})">Delete</button>
                        </span>
                    </div>
                    <div class="project-tasks" id="project-tasks-${project.id}" style="display: none;"></div>
                `;
                
                projectsList.appendChild(projectDiv);
            });
        })
        .catch(error => console.error('Error loading projects:', error));
}

function createProject(project) {
    fetch(API.projects, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(project)
    })
    .then(response => response.json())
    .then(() => {
        loadProjects();
        const modal = bootstrap.Modal.getInstance(document.getElementById('projectModal'));
        modal.hide();
    })
    .catch(error => console.error('Error creating project:', error));
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        fetch(`${API.projects}${id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(() => loadProjects())
        .catch(error => console.error('Error deleting project:', error));
    }
}

function showProjectTasks(projectId) {
    const tasksDiv = document.getElementById(`project-tasks-${projectId}`);
    
    if (tasksDiv.style.display === 'none') {
        fetch(`${API.tasks}?project=${projectId}`)
            .then(response => response.json())
            .then(data => {
                tasksDiv.innerHTML = '<h6 class="mt-3">Tasks</h6>';
                
                if (data.length === 0) {
                    tasksDiv.innerHTML += '<p>No tasks yet.</p>';
                } else {
                    const ul = document.createElement('ul');
                    ul.className = 'list-group';
                    
                    data.forEach(task => {
                        const li = document.createElement('li');
                        li.className = `list-group-item ${task.completed ? 'completed-task' : ''}`;
                        
                        li.innerHTML = `
                            <div>
                                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskComplete(${task.id}, this.checked)">
                                <span>${task.title}</span>
                            </div>
                        `;
                        
                        ul.appendChild(li);
                    });
                    
                    tasksDiv.appendChild(ul);
                }
                
                // Add form to create new task
                const form = document.createElement('div');
                form.className = 'mt-2';
                form.innerHTML = `
                    <div class="input-group">
                        <input type="text" class="form-control" id="new-task-${projectId}" placeholder="New task...">
                        <button class="btn btn-primary" onclick="addTaskToProject(${projectId})">Add</button>
                    </div>
                `;
                
                tasksDiv.appendChild(form);
                tasksDiv.style.display = 'block';
            })
            .catch(error => console.error('Error loading project tasks:', error));
    } else {
        tasksDiv.style.display = 'none';
    }
}

function addTaskToProject(projectId) {
    const taskInput = document.getElementById(`new-task-${projectId}`);
    const taskTitle = taskInput.value.trim();
    
    if (taskTitle) {
        const task = {
            project: projectId,
            title: taskTitle,
            completed: false
        };
        
        fetch(API.tasks, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(() => {
            taskInput.value = '';
            showProjectTasks(projectId); // Refresh tasks
        })
        .catch(error => console.error('Error creating task:', error));
    }
}

function toggleTaskComplete(id, completed) {
    fetch(`${API.tasks}${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ completed: completed })
    })
    .then(response => response.json())
    .catch(error => console.error('Error updating task:', error));
}

// Calendar Event Functions
function createCalendarEvent(event) {
    fetch(API.events, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(event)
    })
    .then(response => response.json())
    .then(() => {
        // Refresh calendar
        const calendar = document.querySelector('.fc').FullCalendar;
        calendar.refetchEvents();
    })
    .catch(error => console.error('Error creating calendar event:', error));
}

// Setup Event Listeners
function setupEventListeners() {
    // Todo form
    document.getElementById('add-todo').addEventListener('click', function() {
        const todoInput = document.getElementById('todo-input');
        const todoText = todoInput.value.trim();
        
        if (todoText) {
            createTodo({ title: todoText, completed: false });
            todoInput.value = '';
        }
    });
    
    // Note form
    document.getElementById('save-note').addEventListener('click', function() {
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        
        if (title && content) {
            createNote({ title: title, content: content });
        }
    });
    
    // Bookmark form
    document.getElementById('add-bookmark').addEventListener('click', function() {
        const titleInput = document.getElementById('bookmark-title');
        const urlInput = document.getElementById('bookmark-url');
        const title = titleInput.value.trim();
        const url = urlInput.value.trim();
        
        if (title && url) {
            createBookmark({ title: title, url: url });
        }
    });
    
    // Shopping item form
    document.getElementById('add-shopping-item').addEventListener('click', function() {
        const itemInput = document.getElementById('shopping-item');
        const quantityInput = document.getElementById('shopping-quantity');
        const name = itemInput.value.trim();
        const quantity = parseInt(quantityInput.value) || 1;
        
        if (name) {
            createShoppingItem({ name: name, quantity: quantity, purchased: false });
        }
    });
    
    // Daily planner form
    document.getElementById('save-planner').addEventListener('click', saveDailyPlan);
    
    // Project form
    document.getElementById('save-project').addEventListener('click', function() {
        const nameInput = document.getElementById('project-name');
        const descriptionInput = document.getElementById('project-description');
        const startDateInput = document.getElementById('project-start-date');
        const endDateInput = document.getElementById('project-end-date');
        const statusInput = document.getElementById('project-status');
        
        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const status = statusInput.value;
        
        if (name) {
            const project = {
                name: name,
                description: description,
                start_date: startDate,
                end_date: endDate || null,
                status: status
            };
            
            createProject(project);
            
            // Reset form
            nameInput.value = '';
            descriptionInput.value = '';
            startDateInput.value = '';
            endDateInput.value = '';
            statusInput.value = 'not_started';
        }
    });
    
    // Date change for daily planner
    document.getElementById('planner-date').addEventListener('change', loadDailyPlan);
}

// Helper function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}