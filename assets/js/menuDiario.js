function cargarMenuDesdeJSON(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} al cargar ${url}`);
            }
            return response.json();
        })
        .then(data => {
            const tieneCatalogoBase = data.entrada || data.principal || data.postre;
            const tieneBloqueDias = data.dias && typeof data.dias === 'object';
            if (!tieneCatalogoBase && !tieneBloqueDias) {
                throw new Error("El archivo JSON no tiene la estructura esperada.");
            }
            return data;
        })
        .catch(error => {
            if (window.location.protocol === 'file:') {
                console.warn('Abriste el archivo con file://. Usa un servidor local para evitar CORS.');
            }
            console.error('Error al cargar el menú:', error);
            return { entrada: [], principal: [], postre: [] };
        });
}

function obtenerOpcionesCategoria(menuData, dia, comida, categoria) {
    const opcionesCatalogo = menuData[categoria] || [];
    const opcionesDia = menuData.dias?.[dia]?.[comida]?.[categoria];

    if (Array.isArray(opcionesDia) && opcionesDia.length > 0) {
        const clavesDia = new Set(opcionesDia.map(item => item?.nombre).filter(Boolean));
        const opcionesCatalogoRestantes = opcionesCatalogo.filter(item => !clavesDia.has(item?.nombre));
        return [...opcionesDia, ...opcionesCatalogoRestantes];
    }

    return opcionesCatalogo;
}

function llenarSelectConOpciones(selectElement, opciones, subMenuElement, dataCompleta) {
    selectElement.innerHTML = '';
    subMenuElement.innerHTML = '';
    const containerDiv = subMenuElement.closest('div');

    if (!opciones || opciones.length === 0) {
        const emptyOption = document.createElement('option');
        emptyOption.textContent = '—';
        emptyOption.value = '';
        selectElement.appendChild(emptyOption);
        if (containerDiv) containerDiv.style.display = 'none';
        return;
    }

    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.textContent = opcion.nombre;
        option.value = opcion.nombre;

        const tieneSubmenu =
            (opcion.submenu && opcion.submenu.length > 0) ||
            (opcion.submenu_ref && dataCompleta[opcion.submenu_ref]);

        if (tieneSubmenu) {
            option.classList.add('has-submenu');
        }

        selectElement.appendChild(option);
    });

    const updateSubmenu = (selectedOption) => {
        if (!selectedOption) {
            subMenuElement.innerHTML = '';
            if (containerDiv) containerDiv.style.display = 'none';
            return;
        }

        let submenu = selectedOption.submenu;
        if (!submenu && selectedOption.submenu_ref) {
            submenu = dataCompleta[selectedOption.submenu_ref] || [];
        }

        if (submenu && submenu.length > 0) {
            subMenuElement.innerHTML = '';
            submenu.forEach(subOptionText => {
                const subOption = document.createElement('option');
                if (typeof subOptionText === 'string' && subOptionText.trim() === '--') {
                    subOption.textContent = ' ';
                    subOption.value = '';
                } else {
                    subOption.textContent = subOptionText;
                    subOption.value = subOptionText;
                }
                subMenuElement.appendChild(subOption);
            });
            if (containerDiv) containerDiv.style.display = 'block';
        } else {
            subMenuElement.innerHTML = '';
            if (containerDiv) containerDiv.style.display = 'none';
        }
    };

    selectElement.onchange = (event) => {
        const selectedValue = event.target.value;
        const selectedOption = opciones.find(op => op.nombre === selectedValue);
        updateSubmenu(selectedOption);
    };

    const initialOption = opciones.find(op => op.nombre === selectElement.value) || opciones[0];
    updateSubmenu(initialOption);
}

function cargarMenuDelDia(menuData, diaSeleccionado) {
    // Almuerzo
    llenarSelectConOpciones(
        document.getElementById('almuerzo-entrada-select'),
        obtenerOpcionesCategoria(menuData, diaSeleccionado, 'almuerzo', 'entrada'),
        document.getElementById('almuerzo-entrada-submenu'),
        menuData
    );
    llenarSelectConOpciones(
        document.getElementById('almuerzo-principal-select'),
        obtenerOpcionesCategoria(menuData, diaSeleccionado, 'almuerzo', 'principal'),
        document.getElementById('almuerzo-principal-submenu'),
        menuData
    );
    llenarSelectConOpciones(
        document.getElementById('almuerzo-postre-select'),
        obtenerOpcionesCategoria(menuData, diaSeleccionado, 'almuerzo', 'postre'),
        document.getElementById('almuerzo-postre-submenu'),
        menuData
    );

    // Cena
    llenarSelectConOpciones(
        document.getElementById('cena-entrada-select'),
        obtenerOpcionesCategoria(menuData, diaSeleccionado, 'cena', 'entrada'),
        document.getElementById('cena-entrada-submenu'),
        menuData
    );
    llenarSelectConOpciones(
        document.getElementById('cena-principal-select'),
        obtenerOpcionesCategoria(menuData, diaSeleccionado, 'cena', 'principal'),
        document.getElementById('cena-principal-submenu'),
        menuData
    );
    llenarSelectConOpciones(
        document.getElementById('cena-postre-select'),
        obtenerOpcionesCategoria(menuData, diaSeleccionado, 'cena', 'postre'),
        document.getElementById('cena-postre-submenu'),
        menuData
    );
}

function inicializarMenu() {
    const diaSelect = document.getElementById('dia-select');
    
    cargarMenuDesdeJSON('data/menus.json')
        .then(menuData => {
            const diaActual = diaSelect.value || '1';
            cargarMenuDelDia(menuData, diaActual);
            
            diaSelect.addEventListener('change', () => {
                cargarMenuDelDia(menuData, diaSelect.value);
            });
        });
}

function calcularPxPorMilimetro() {
    const medidor = document.createElement('div');
    medidor.style.position = 'absolute';
    medidor.style.left = '-9999px';
    medidor.style.top = '0';
    medidor.style.width = '10mm';
    medidor.style.height = '100mm';
    document.body.appendChild(medidor);
    const pxPorMm = medidor.getBoundingClientRect().height / 100;
    document.body.removeChild(medidor);
    return pxPorMm > 0 ? pxPorMm : (96 / 25.4);
}

function actualizarModoCompactoImpresion() {
    const encabezado = document.querySelector('header');
    const contenido = document.querySelector('main');
    if (!encabezado || !contenido) {
        document.body.classList.remove('print-compact');
        return;
    }

    document.body.classList.remove('print-compact');

    const pxPorMm = calcularPxPorMilimetro();
    const altoDisponibleA4 = (297 - 20) * pxPorMm;
    const altoContenido = encabezado.getBoundingClientRect().height + contenido.getBoundingClientRect().height;

    if (altoContenido > altoDisponibleA4) {
        document.body.classList.add('print-compact');
    }
}

window.addEventListener('beforeprint', actualizarModoCompactoImpresion);
window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-compact');
});

window.onload = inicializarMenu;
