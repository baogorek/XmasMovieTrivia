if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-btn');
    const inputField = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    // Load todos from local storage
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => addTodo(todo));

    // Add todo event
    addButton.addEventListener('click', () => {
        let todoText = inputField.value.trim();
        if (todoText) {
            addTodo(todoText);
            saveTodo(todoText);
            inputField.value = '';
        }
    });

    function addTodo(todoText) {
        const li = document.createElement('li');
        li.textContent = todoText;
        li.addEventListener('click', () => {
            todoList.removeChild(li);
            removeTodo(todoText);
        });
        todoList.appendChild(li);
    }

    function saveTodo(todoText) {
        todos.push(todoText);
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function removeTodo(todoText) {
        const index = todos.indexOf(todoText);
        if (index > -1) {
            todos.splice(index, 1);
        }
        localStorage.setItem('todos', JSON.stringify(todos));
    }
});
