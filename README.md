# MenuPers - Sistema de Gestión de Menús SUTEBA

Sistema web interactivo para la gestión y visualización de menús diarios, diseñado para SUTEBA (Unión de Trabajadores de la Educación). Incluye dos módulos principales: menú media pensión y menú pensión completa para jubilados.

## 🎯 Finalidad del Proyecto

MenuPers permite:
- **Gestionar menús digitales** de forma dinámica con entrada, plato principal y postre
- **Imprimir menús** en formato A4 con estilos profesionales
- **Administrar contenido** mediante panel web sin editar código
- **Planificar menús semanales** para programas de jubilados (almuerzo y cena)
- **Personalizar opciones** con submenús dinámicos y detalles específicos

## ✨ Características Principales

### Página Principal (index.html)
- Diseño moderno con cards de selección
- Navegación clara entre los sistemas de menú y acceso al panel admin
- Interfaz responsive y profesional

### Menú Media Pensión (indexMenuPers.html)
- Menú individual con 3 categorías: entrada, principal y postre
- Submenús dinámicos según el plato seleccionado
- Campo de detalles personalizados por categoría
- Optimizado para impresión en A4
- Tipografía Ubuntu con estilos serif

### Menú Pensión Completa de Jubilados (menuDiario.html)
- Planificación de almuerzo y cena separados
- Selector de días (1-4) con opciones específicas por día (bloque `dias`)
- 6 selectores independientes (3 por comida)
- Mismo catálogo de platos que media pensión
- Diseño optimizado para impresión con márgenes reducidos

### Panel de Administración (adminMenu.html)
- Carga y edición del archivo `data/menus.json`
- Interfaz visual para modificar platos disponibles
- Guardar cambios mediante API REST
- Gestión de submenús compartidos (acompañamientos, salsas, postres)
- Edición opcional de menús por día en el bloque `dias`

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3 (con tipografía Ubuntu), JavaScript vanilla
- **Backend**: Python 3 con servidor HTTP y API REST
- **Datos**: JSON con estructura de submenús por referencia
- **Impresión**: Media queries CSS optimizadas para A4

## 📋 Requisitos

- Python 3.x
- Navegador web moderno (Chrome, Firefox, Edge)
- Conexión HTTP local (no funciona con `file://`)

## 🚀 Desarrollo Local

El proyecto requiere servirse por HTTP para cargar `data/menus.json` correctamente.

### Iniciar Servidor

**Opcion 1: Script automatico**
```bash
./serve.sh
```

**Opcion 2: Comando directo**
```bash
python3 server/serve.py --port 5500
```

### Acceder a la Aplicación

- **Pagina principal**: http://localhost:5500/index.html
- **Menu Media Pension**: http://localhost:5500/indexMenuPers.html
- **Menu Pension Completa de Jubilados**: http://localhost:5500/menuDiario.html
- **Panel Admin**: http://localhost:5500/adminMenu.html

## 🌐 Acceso desde Otra Máquina en la Red

```bash
python3 server/serve.py --host 0.0.0.0 --port 5500
```

Reemplazar `localhost` por la IP de la máquina servidor.

## 🔄 Flujo de GitHub

Flujo sugerido para trabajar en equipo sin romper `main`:

1. Actualizar rama principal local:
  ```bash
  git checkout main
  git pull origin main
  ```
2. Crear rama de trabajo por cambio:
  ```bash
  git checkout -b feat/nombre-cambio
  ```
3. Hacer cambios, probar localmente y commitear:
  ```bash
  git add .
  git commit -m "feat: descripcion breve"
  ```
4. Subir rama y abrir Pull Request:
  ```bash
  git push -u origin feat/nombre-cambio
  ```
5. Esperar CI en verde y luego mergear a `main`.

## 🤖 CI (GitHub Actions)

Se incluye workflow en `.github/workflows/ci.yml` que valida en cada push/PR:

- Sintaxis de scripts shell (`serve.sh`, `sort-menus.sh`)
- Sintaxis Python del servidor (`server/serve.py`)
- Validez JSON (`data/menus.json`)

## 📁 Estructura del Proyecto

```
menuPers/
├── assets/
│   ├── css/                   # Estilos
│   ├── img/                   # Logos e imagenes
│   └── js/                    # Logica frontend
├── data/
│   ├── menuDiario.json        # Archivo auxiliar/legacy (no fuente principal)
│   └── menus.json             # Fuente única: catálogo + menús por día
├── server/
│   └── serve.py               # Servidor HTTP con API REST
├── index.html                 # Página principal con cards de selección
├── indexMenuPers.html         # Menú individual pensión completa
├── menuDiario.html            # Menú diario almuerzo/cena
├── adminMenu.html             # Panel de administración
├── serve.sh                   # Script de inicio rápido
├── .gitignore                 # Exclusiones locales
└── README.md                  # Este archivo
```

## 📊 Estructura de Datos (data/menus.json)

```json
{
  "entrada": [
    {
      "nombre": "Plato 1",
      "submenu": []
    }
  ],
  "principal": [
    {
      "nombre": "Plato Principal",
      "submenu": ["Opción A", "Opción B"]
    }
  ],
  "postre": [
    {
      "nombre": "Postre",
      "submenu_ref": "acompanamientos_postres"
    }
  ],
  "acompanamientos_carnicos": ["Guarnición 1", "Guarnición 2"],
  "salsas_pastas": ["Salsa 1", "Salsa 2"],
  "acompanamientos_postres": ["Acompañamiento 1", "Acompañamiento 2"],
  "dias": {
    "1": {
      "almuerzo": { "entrada": [], "principal": [], "postre": [] },
      "cena": { "entrada": [], "principal": [], "postre": [] }
    }
  }
}
```

### Patrón submenu_ref
Los platos pueden usar `submenu_ref` para referenciar listas compartidas de acompañamientos, evitando duplicación de datos.

## 🎨 Estilos y Diseño

- **Tipografía principal**: Ubuntu (Liberation Sans fallback)
- **Paleta de colores**: Gradientes azules en página principal
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Print-ready**: Optimizado para impresión A4 con márgenes de 15-20mm
- **Navegación**: Links superiores para volver al menú principal

## 🖨️ Impresión

Para imprimir los menús:
1. Abrir la página deseada en el navegador
2. Usar Ctrl+P (Cmd+P en Mac) o menú Archivo → Imprimir
3. Los estilos se ajustan automáticamente para A4
4. Los elementos de navegación se ocultan en impresión

## 🔧 Panel de Administración

El panel admin requiere que `server/serve.py` esté en ejecución para acceder al endpoint `/api/menus`:

- **GET /api/menus**: Carga el contenido actual de `data/menus.json`
- **POST /api/menus**: Guarda los cambios en `data/menus.json`

**Nota**: El servidor básico de Python (`python -m http.server`) no incluye esta API.

## 📝 Historial de Cambios Recientes

### Febrero 2026
- ✅ Creada página principal con diseño de cards
- ✅ Implementado sistema de menú diario para jubilados
- ✅ Unificada tipografía Ubuntu en ambos sistemas
- ✅ Mejorado estilo de navegación superior
- ✅ Optimizadas reglas de impresión para A4
- ✅ Integrados estilos de documentos ODT originales
- ✅ Refactorizado JSON con patrón submenu_ref
- ✅ Unificada la fuente de datos activa en `data/menus.json` para ambas pantallas
- ✅ Normalizados nombres de platos y ordenadas listas JSON
- ✅ Ajustada visualización de impresión A4 y separación superior de cabeceras

## 🤝 Contribuciones

Proyecto desarrollado para SUTEBA - Unión de Trabajadores de la Educación.

## 📄 Licencia

Proyecto de uso interno para SUTEBA.

---

**Última actualización**: Febrero 2026  
**Versión**: 2.0
