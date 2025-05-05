
        const TODOS_API_URL = 'https://jsonplaceholder.typicode.com/todos';
        const TODOS_PER_PAGE = 10; // Number of todos per page
        let currentPage = 1;

        // Fetch todos with pagination
        async function fetchTodos(page) {
            try {
                const response = await fetch(`${TODOS_API_URL}?_page=${page}&_limit=${TODOS_PER_PAGE}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch todos');
                }
                const todos = await response.json();
                const totalTodos = response.headers.get('x-total-count'); // Total number of todos
                displayTodos(todos);
                setupPagination(totalTodos, page);
            } catch (error) {
                console.error('Error fetching todos:', error);
                document.getElementById('todo-list').innerHTML = '<li class="todo-item">Failed to fetch todos. Please try again later.</li>';
            }
        }

        // Display todos in the DOM
        function displayTodos(todos) {
            const todoList = document.getElementById('todo-list');
            todoList.innerHTML = ''; // Clear previous todos

            todos.forEach(todo => {
                const todoItem = document.createElement('li');
                todoItem.className = 'todo-item';
                todoItem.textContent = `${todo.id}. ${todo.title} ${todo.completed ? '(Completed)' : ''}`;
                todoList.appendChild(todoItem);
            });
        }

        // Setup pagination buttons
        function setupPagination(totalTodos, currentPage) {
            const pagination = document.getElementById('pagination');
            pagination.innerHTML = ''; // Clear previous buttons

            const totalPages = Math.ceil(totalTodos / TODOS_PER_PAGE);

            // Previous button
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', () => {
                fetchTodos(currentPage - 1);
            });
            pagination.appendChild(prevButton);

            // Page buttons
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.disabled = i === currentPage;
                pageButton.addEventListener('click', () => {
                    fetchTodos(i);
                });
                pagination.appendChild(pageButton);
            }

            // Next button
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener('click', () => {
                fetchTodos(currentPage + 1);
            });
            pagination.appendChild(nextButton);
        }

        // Fetch todos for the first page on page load
        window.onload = () => fetchTodos(currentPage);
