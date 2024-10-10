// Elementos del DOM
const menuElement = document.getElementById('menu');
const form = document.getElementById('menuForm');
const nombreInput = document.getElementById('nombre');
const enlaceInput = document.getElementById('enlace');
const idInput = document.getElementById('id'); // ID oculto para modificar
const menuSelect = document.getElementById('menuSelect'); // Dropdown para seleccionar opción
const insertarBtn = document.getElementById('insertarBtn');
const modificarBtn = document.getElementById('modificarBtn');
const eliminarBtn = document.getElementById('eliminarBtn');
const guardarBtn = document.getElementById('guardarBtn');

// Menú inicial almacenado en JSON
let menu = [];

// Cargar menú desde el archivo JSON
async function cargarMenu() {
  try {
    const response = await fetch('menu.json');
    const data = await response.json();
    menu = data.menu;
    renderizarMenu();
    actualizarMenuSelect();
  } catch (error) {
    console.error('Error al cargar el menú:', error);
  }
}

// Renderizar el menú en el DOM
function renderizarMenu() {
  const ul = document.createElement('ul');
  menu.forEach(item => {
    const li = document.createElement('li');
    
    const a = document.createElement('a');
    a.href = item.enlace;
    a.textContent = item.nombre;
    
    li.appendChild(a);
    ul.appendChild(li);
  });
  menuElement.innerHTML = ''; // Limpiar el menú actual
  menuElement.appendChild(ul); // Añadir el nuevo menú
}

// Actualizar el dropdown con las opciones del menú
function actualizarMenuSelect() {
  menuSelect.innerHTML = '<option value="">-- Seleccionar opción --</option>'; // Limpiar y reiniciar el dropdown
  menu.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.nombre;
    menuSelect.appendChild(option);
  });
}

// Habilitar o deshabilitar botones según la selección
menuSelect.addEventListener('change', () => {
  const selectedId = menuSelect.value;

  if (selectedId) {
    const selectedItem = menu.find(item => item.id == selectedId);
    llenarFormulario(selectedItem);
    modificarBtn.disabled = false;
    eliminarBtn.disabled = false;
    guardarBtn.disabled = true; // Desactivar guardar inicialmente
  } else {
    limpiarFormulario();
    modificarBtn.disabled = true;
    eliminarBtn.disabled = true;
    guardarBtn.disabled = true;
  }
});

// Insertar nueva opción: deshabilitar modificar y eliminar, habilitar guardar
insertarBtn.addEventListener('click', () => {
  limpiarFormulario();
  modificarBtn.disabled = true;
  eliminarBtn.disabled = true;
  guardarBtn.disabled = false; // Activar guardar
  menuSelect.value = ''; // Limpiar selección del dropdown
});

// Manejar el botón de "Modificar" para permitir la edición
modificarBtn.addEventListener('click', () => {
  guardarBtn.disabled = false; // Activar el botón de guardar cuando se modifica
});

// Manejar el formulario para agregar/modificar una opción del menú
form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const id = idInput.value;
  const nombre = nombreInput.value;
  const enlace = enlaceInput.value;

  if (!id) {
    agregarOpcion(nombre, enlace);
  } else {
    modificarOpcion(Number(id), nombre, enlace);
  }

  limpiarFormulario();
  modificarBtn.disabled = true;
  eliminarBtn.disabled = true;
  guardarBtn.disabled = true; // Desactivar guardar
});

// Función para agregar nueva opción al menú
function agregarOpcion(nombre, enlace) {
  const nuevoElemento = {
    id: Date.now(), // Crear un ID único
    nombre: nombre,
    enlace: enlace
  };
  menu.push(nuevoElemento);
  renderizarMenu();
  actualizarMenuSelect(); // Actualizar el dropdown
}

// Función para modificar opción existente
function modificarOpcion(id, nombre, enlace) {
  const index = menu.findIndex(item => item.id === id);
  if (index !== -1) {
    menu[index].nombre = nombre;
    menu[index].enlace = enlace;
    renderizarMenu();
    actualizarMenuSelect();
  }
}

// Función para eliminar una opción
eliminarBtn.addEventListener('click', () => {
  const id = Number(menuSelect.value);
  eliminarOpcion(id);
  limpiarFormulario();
  modificarBtn.disabled = true;
  eliminarBtn.disabled = true;
  guardarBtn.disabled = true;
});

function eliminarOpcion(id) {
  menu = menu.filter(item => item.id !== id);
  renderizarMenu();
  actualizarMenuSelect(); // Actualizar el dropdown
}

// Llenar el formulario para modificar
function llenarFormulario(item) {
  idInput.value = item.id;
  nombreInput.value = item.nombre;
  enlaceInput.value = item.enlace;
}

// Limpiar formulario y reiniciar valores
function limpiarFormulario() {
  idInput.value = '';
  nombreInput.value = '';
  enlaceInput.value = '';
}

// Cargar el menú al inicio
cargarMenu();
