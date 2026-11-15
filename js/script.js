/* COS 106 - Shared JavaScript */

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('nav ul');

  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      navList.classList.toggle('open');
    });
  }

  // Highlight active page in nav
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
});

/* ========== ACADEMIC PLANNER ========== */
(function () {
  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-task');
  const taskList = document.getElementById('task-list');
  const emptyMsg = document.getElementById('empty-msg');

  if (!taskInput || !addBtn || !taskList) return; // only run on planner page

  // Load tasks from localStorage (array of objects)
  let tasks = JSON.parse(localStorage.getItem('portfolioTasks')) || [];

  function saveTasks() {
    localStorage.setItem('portfolioTasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
      if (emptyMsg) emptyMsg.style.display = 'block';
      return;
    }
    if (emptyMsg) emptyMsg.style.display = 'none';

    tasks.forEach(function (task, index) {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', function () {
        tasks[index].completed = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      const span = document.createElement('span');
      span.textContent = task.text;

      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.innerHTML = '&times;';
      delBtn.title = 'Delete task';
      delBtn.addEventListener('click', function () {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(delBtn);
      taskList.appendChild(li);
    });
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
      taskInput.focus();
      return;
    }
    tasks.push({ text: text, completed: false });
    saveTasks();
    taskInput.value = '';
    renderTasks();
    taskInput.focus();
  }

  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
  });

  // Initial render
  renderTasks();
})();

/* ========== CONTACT FORM VALIDATION ========== */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');
  const successBanner = document.getElementById('success-banner');

  function showError(input, message) {
    const group = input.closest('.form-group');
    group.classList.add('error');
    const err = group.querySelector('.error-msg');
    if (err) err.textContent = message;
  }

  function clearError(input) {
    const group = input.closest('.form-group');
    group.classList.remove('error');
  }

  function isValidEmail(email) {
    // Simple but effective pattern
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function isValidPhone(phone) {
    // Only digits, allow optional spaces or dashes for display, but require digits only after clean
    const cleaned = phone.replace(/[\s\-()]/g, '');
    return /^\d{7,15}$/.test(cleaned);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    [nameInput, emailInput, phoneInput, messageInput].forEach(clearError);

    // Name
    if (nameInput.value.trim() === '') {
      showError(nameInput, 'Name is required');
      valid = false;
    }

    // Email
    if (emailInput.value.trim() === '') {
      showError(emailInput, 'Email is required');
      valid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address');
      valid = false;
    }

    // Phone
    if (phoneInput.value.trim() === '') {
      showError(phoneInput, 'Phone number is required');
      valid = false;
    } else if (!isValidPhone(phoneInput.value.trim())) {
      showError(phoneInput, 'Phone must contain only digits (7-15 digits)');
      valid = false;
    }

    // Message
    if (messageInput.value.trim() === '') {
      showError(messageInput, 'Message is required');
      valid = false;
    }

    if (valid) {
      // Simulate successful submission
      successBanner.style.display = 'block';
      form.reset();
      // Hide success after 4 seconds
      setTimeout(function () {
        successBanner.style.display = 'none';
      }, 4000);
    }
  });

  // Live clear errors on input
  [nameInput, emailInput, phoneInput, messageInput].forEach(function (input) {
    input.addEventListener('input', function () {
      clearError(input);
    });
  });
})();