const $form = document.querySelector('.form');
const $tareas = document.querySelector('.tareas');
const $select = document.querySelector('#select');
const $buscar = document.querySelector('.filter');
const $container = document.querySelector('.container');

// const $p = document.createElement('p');

let arrayTareas = [];

const pintarTareas = (tarea) => {
  const $div = document.createElement('div');
  $div.classList.add('tarea');

  const $p = document.createElement('p');
  let tiempoLimite = new Date(tarea.tiempo);
  setInterval(() => {
    let now = new Date();
    let resultado = tiempoLimite.getTime() - now.getTime();
    let dias = Math.floor(resultado / (1000 * 60 * 60 * 24));
    let horas = ('0' + Math.floor((resultado % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).slice(-2);
    let minutos = ('0' + Math.floor((resultado % (1000 * 60 * 60 * 24)) / (1000 * 60))).slice(-2);
    let segundos = ('0' + Math.floor((resultado % (1000 * 60 * 60 * 24)) / 1000)).slice(-2);
    // arreglo = [dias, horas, minutos, segundos];
    // console.log(arreglo);
    $p.innerHTML = `<span>${dias} dias</span> <span>${horas} horas</span> <span>${minutos} minutos</span> <span>${segundos} segundos</span>`;
    if (resultado < 0) {
      $p.innerHTML = `Se cumplio en plazo`;
      // $cuentaRegresiva.classList.remove('cuadro');
      // $mensaje.innerHTML = `<p>Feliz cumpleaños</p>`;
    }
  }, 1000);

  $div.innerHTML = `
        <p class="tarea-tarea">${tarea.nombre}</p>
        <input class="tarea-estado" type="checkbox" /> 
        <button class="eliminar">Elimminar</button>
  `;
  $tareas.insertAdjacentElement('afterbegin', $div);
  $div.insertAdjacentElement('afterbegin', $p);

  if (tarea.estado === true) {
    $tareas.firstElementChild.classList.add('rojo');
    document.querySelector('.tarea-estado').setAttribute('checked', 'checked');
  }
  // else if (tarea.estado === false) {
  //   $tareas.firstElementChild.classList.remove('rojo');
  //   document.querySelector('.tarea-estado').removeAttribute('checked', 'checked');
  // }
  // tareaStado(tarea);
};

const agregarTarea = (nombre, tiempo) => {
  const itemTarea = {
    nombre: nombre,
    tiempo: tiempo,
    estado: false,
  };
  arrayTareas.push(itemTarea);

  pintarTareas(itemTarea);

  guarderDB();
};

const guarderDB = () => {
  localStorage.setItem('tareas', JSON.stringify(arrayTareas));
};

const pintarDB = () => {
  arrayTareas = JSON.parse(localStorage.getItem('tareas'));

  if (arrayTareas === null) {
    arrayTareas = [];
  } else {
    arrayTareas.forEach((el) => {
      pintarTareas(el);
    });
  }
};

const cambiarStado = () => {
  document.addEventListener('click', (e) => {
    // const $tarea = document.querySelector('tarea');
    if (e.target.matches('.tarea-estado')) {
      if (e.target.checked) {
        e.target.parentElement.classList.add('rojo');
        arrayTareas.forEach((el) => {
          if (e.path[1].children[1].textContent === el.nombre) {
            console.log(e.path[1].children[1].textContent);
            console.log(el.nombre);
            el.estado = true;
            // document.querySelector('.tarea-estado').checked = true;
            // e.target.parentElement.classList.add('rojo');
          }
        });
      } else {
        // e.target.parentElement.classList.remove('rojo');
      }
      localStorage.setItem('tareas', JSON.stringify(arrayTareas));
    }
  });
};

// const tareaStado = () => {
//   const $tareass = document.querySelectorAll('.tarea-estado');
//   document.addEventListener('change', (e) => {
//     if (e.target === $select) {
//       if ($select.value === 'terminados') {
//         $tareass.forEach((element) => {
//           if (!element.hasAttribute('checked')) {
//             element.parentElement.classList.add('none');
//           } else {
//             element.parentElement.classList.remove('none');
//           }
//         });
//       } else if ($select.value === 'incompletas') {
//         $tareass.forEach((element) => {
//           if (!element.hasAttribute('checked')) {
//             element.parentElement.classList.remove('none');
//           } else {
//             element.parentElement.classList.add('none');
//           }
//         });
//       } else {
//         $tareass.forEach((element) => {
//           if (!element.hasAttribute('checked')) {
//             element.parentElement.classList.remove('none');
//           } else {
//             element.parentElement.classList.remove('none');
//           }
//         });
//       }
//     }
//   });
// };
//eventos
const buscar = () => {
  const $tareas = document.querySelectorAll('.tarea');
  document.addEventListener('keyup', (e) => {
    if (e.target === $buscar) {
      if (e.key === 'Escape') {
        e.target.value = '';
      }

      $tareas.forEach((el) => {
        el.textContent.toLowerCase().includes(e.target.value) ? el.classList.remove('filterr') : el.classList.add('filterr');
      });
    }
  });
};

const eliminarTarea = () => {
  document.addEventListener('click', (e) => {
    if (e.target.matches('.eliminar')) {
      e.target.parentElement.remove();
      arrayTareas.splice(e.target, 1);
      // console.log(arrayTareas);
      localStorage.setItem('tareas', JSON.stringify(arrayTareas));
    }
  });
};

const mensaje = (mensaje) => {
  const $p = document.createElement('p');
  $p.textContent = mensaje;
  $p.classList.add('mensaje');
  $container.insertAdjacentElement('afterbegin', $p);
  setTimeout(() => {
    $p.textContent = '';
    $p.classList.remove('mensaje');
  }, 2000);
};

document.addEventListener('submit', (e) => {
  //capturando los valores del formulario
  e.preventDefault();

  if (e.target === $form) {
    let nombre = $form.nombre.value;
    let tiempo = $form.tiempo.value;
    let verificar = new Date(tiempo).getTime();
    let hoy = new Date().getTime();
    console.log(verificar, hoy);
    if (nombre === '' || tiempo === '' || verificar < hoy) {
      return mensaje('Campos obligatorios');
    } else {
      agregarTarea(nombre, tiempo);
    }
    $form.reset();
  }
  buscar();
});

document.addEventListener('DOMContentLoaded', (e) => {
  pintarDB();
  eliminarTarea();
  cambiarStado();
  // tareaStado();
  buscar();
});
