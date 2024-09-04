class Estudiante {
    constructor(nombre, grupo) {
        this.nombre = nombre;
        this.grupo = grupo;
        this.notas = [];
    }

    agregarNota(nota) {
        this.notas.push(nota);
        this.guardarEnLocalStorage();
    }

    async calcularPromedio() {
        if (this.notas.length === 0) return 0;
        const suma = this.notas.reduce((a, b) => a + b, 0);
        return (suma / this.notas.length).toFixed(2);
    }

    guardarEnLocalStorage() {
        let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
        estudiantes = estudiantes.filter(est => est.nombre !== this.nombre); 
        estudiantes.push(this);
        localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
    }

    static cargarDesdeLocalStorage() {
        const estudiantesData = JSON.parse(localStorage.getItem('estudiantes')) || [];
        return estudiantesData.map(est => {
            const estudiante = new Estudiante(est.nombre, est.grupo);
            estudiante.notas = est.notas;
            return estudiante;
        });
    }
}

let estudiantes = Estudiante.cargarDesdeLocalStorage();

function mostrarMensaje(elemento, mensaje, tipo) {
    const mensajeDiv = document.getElementById(elemento);
    mensajeDiv.textContent = mensaje;
    mensajeDiv.className = tipo; 
    mensajeDiv.style.display = 'block';
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 3000);
}

document.getElementById('AgregarEstuForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const grupo = document.getElementById('grupo').value;
    const nuevoEstudiante = new Estudiante(nombre, grupo);
    estudiantes.push(nuevoEstudiante);
    nuevoEstudiante.guardarEnLocalStorage();
    mostrarMensaje('resultado', `Estudiante ${nombre} agregado al grupo ${grupo}`, 'exito');
    event.target.reset();
    console.log(estudiantes);
});

document.getElementById('BuscarEstuForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('buscar-estu').value;
    const estudiante = estudiantes.find(est => est.nombre === nombre);
    if (estudiante) {
        mostrarMensaje('resultado', `Estudiante encontrado: ${estudiante.nombre}, Grupo: ${estudiante.grupo}`, 'exito');
    } else {
        mostrarMensaje('resultado', 'Estudiante no encontrado', 'error');
    }
});

document.getElementById('AgregarNotaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombreNota').value;
    const nota = parseFloat(document.getElementById('nota').value);
    const estudiante = estudiantes.find(est => est.nombre === nombre);
    if (estudiante) {
        estudiante.agregarNota(nota);
        mostrarMensaje('resultado', `Nota ${nota} agregada a ${estudiante.nombre}`, 'exito');
    } else {
        mostrarMensaje('resultado', 'Estudiante no encontrado', 'error');
    }
    event.target.reset();
    console.log(estudiante.notas); 
});

document.getElementById('promedioForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombrePromedio').value;
    const estudiante = estudiantes.find(est => est.nombre === nombre);
    if (estudiante) {
        const promedio = await estudiante.calcularPromedio();
        document.getElementById('resultado').textContent = `El promedio de ${estudiante.nombre} es ${promedio}`;
    } else {
        mostrarMensaje('resultado', 'Estudiante no encontrado', 'error');
    }
});
