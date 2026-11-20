// ===== STATE =====
const STORAGE_KEY = "todos";
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ===== DOM ELEMENTS =====
const form = document.querySelector("#form-todo");
const input = document.querySelector("#input-todo");
const list = document.querySelector("#list-todo");
const stats = document.querySelector("#stats");
const totalCount = document.querySelector("#total-count");
const progressCount = document.querySelector("#progress-count");
const progressBar = document.querySelector("#progress-bar");
const clearCompletedButton = document.querySelector("#clear-completed");

// ===== FUNCTIONS =====
function simpan() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render() {
  list.innerHTML = "";

  if (todos.length === 0) {
    list.innerHTML = '<li class="empty-state">Belum ada tugas. Tambahkan tugas pertamamu!</li>';
  } else {
    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.selesai ? "completed" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.selesai;
      checkbox.dataset.id = todo.id;
      checkbox.setAttribute("aria-label", `Tandai "${todo.teks}" selesai`);

      const teks = document.createElement("span");
      teks.className = "todo-text";
      teks.textContent = todo.teks;

      const hapusButton = document.createElement("button");
      hapusButton.type = "button";
      hapusButton.className = "delete-button";
      hapusButton.textContent = "Hapus";
      hapusButton.dataset.id = todo.id;
      hapusButton.setAttribute("aria-label", `Hapus tugas "${todo.teks}"`);

      li.append(checkbox, teks, hapusButton);
      list.appendChild(li);
    });
  }

  const belum = todos.filter((todo) => !todo.selesai).length;
  const selesai = todos.length - belum;

  stats.textContent = `${belum} tugas belum selesai`;
  totalCount.textContent = `${todos.length} tugas`;
  progressCount.textContent = `${selesai}/${todos.length}`;

  const persentase = todos.length === 0 ? 0 : (selesai / todos.length) * 100;
  progressBar.style.width = `${persentase}%`;
}

function tambahTodo(teks) {
  todos.push({
    id: Date.now(),
    teks: teks.trim(),
    selesai: false
  });

  simpan();
  render();
}

function hapusTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  simpan();
  render();
}

function toggleSelesai(id) {
  const todo = todos.find((item) => item.id === id);

  if (todo) {
    todo.selesai = !todo.selesai;
    simpan();
    render();
  }
}

// ===== EVENTS =====
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const teks = input.value.trim();
  if (teks !== "") {
    tambahTodo(teks);
    input.value = "";
    input.focus();
  }
});

list.addEventListener("change", (event) => {
  if (event.target.matches('input[type="checkbox"]')) {
    toggleSelesai(Number(event.target.dataset.id));
  }
});

list.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    hapusTodo(Number(event.target.dataset.id));
  }
});

clearCompletedButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.selesai);
  simpan();
  render();
});

// ===== INIT =====
render();
