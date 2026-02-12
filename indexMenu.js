function cargarMenuDesdeJSON(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.entrada && !data.principal && !data.postre) {
                throw new Error("El archivo JSON no tiene la estructura esperada.");
            }
            return data;
        })
        .catch(error => {
            console.error('Error al cargar el menú:', error);
            return { entrada: [], principal: [], postre: [] };
        });
}

function llenarSelectConOpciones(selectElement, opciones, subMenuElement, dataCompleta) {
    selectElement.innerHTML = '';
    subMenuElement.innerHTML = '';

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

    selectElement.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        const selectedOption = opciones.find(op => op.nombre === selectedValue);
        const containerDiv = subMenuElement.closest('div');

        if (selectedOption) {
            let submenu = selectedOption.submenu;
            if (!submenu && selectedOption.submenu_ref) {
                submenu = dataCompleta[selectedOption.submenu_ref] || [];
            }

            if (submenu && submenu.length > 0) {
                subMenuElement.innerHTML = '';
                submenu.forEach(subOptionText => {
                    const subOption = document.createElement('option');
                    subOption.textContent = subOptionText;
                    subMenuElement.appendChild(subOption);
                });
                if (containerDiv) containerDiv.style.display = 'block';
            } else {
                subMenuElement.innerHTML = '';
                if (containerDiv) containerDiv.style.display = 'none';
            }
        }
    });
}

function inicializarMenu() {
    const entradaSelect = document.getElementById('entrada-select');
    const platoPrincipalSelect = document.getElementById('plato-principal-select');
    const postreSelect = document.getElementById('postre-select');
    const entradaSubmenuSelect = document.getElementById('entrada-submenu');
    const platoPrincipalSubmenuSelect = document.getElementById('plato-principal-submenu');
    const postreSubmenuSelect = document.getElementById('postre-submenu');

    cargarMenuDesdeJSON('menus.json')
        .then(menuData => {
            llenarSelectConOpciones(entradaSelect, menuData.entrada || [], entradaSubmenuSelect, menuData);
            llenarSelectConOpciones(platoPrincipalSelect, menuData.principal || [], platoPrincipalSubmenuSelect, menuData);
            llenarSelectConOpciones(postreSelect, menuData.postre || [], postreSubmenuSelect, menuData);
        });
}

window.onload = inicializarMenu;
