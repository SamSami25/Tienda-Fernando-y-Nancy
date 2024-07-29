let inventario = JSON.parse(sessionStorage.getItem('inventario')) || [];
let carrito = [];

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('formRegistrar')) {
        document.getElementById('formRegistrar').addEventListener('submit', function(e) {
            e.preventDefault();
            
            let nombre = document.getElementById('nombre').value.trim();
            let precio = parseFloat(document.getElementById('precio').value);
            let stockMax = parseInt(document.getElementById('stockMax').value);
            let stockMin = parseInt(document.getElementById('stockMin').value);

            if (!nombre || isNaN(precio) || precio <= 0 || isNaN(stockMax) || isNaN(stockMin) || stockMax < 0 || stockMin < 0 || stockMax > 50 || stockMin > stockMax) {
                document.getElementById('mensajeRegistro').textContent = 'Por favor, complete todos los campos con valores válidos. El stock mínimo no puede ser mayor al stock máximo.';
                return;
            }

            inventario.push({ nombre, precio, stockMax, stockMin, stockActual: stockMax });
            sessionStorage.setItem('inventario', JSON.stringify(inventario));
            document.getElementById('mensajeRegistro').textContent = 'Producto registrado correctamente.';
            document.getElementById('formRegistrar').reset();
            actualizarInventario();
        });
    }

    if (document.getElementById('btnConsultar')) {
        document.getElementById('btnConsultar').addEventListener('click', function() {
            actualizarInventario();
        });
    }

    if (document.getElementById('btnMostrarProductos')) {
        document.getElementById('btnMostrarProductos').addEventListener('click', function() {
            mostrarProductosCompra();
        });
    }

    if (document.getElementById('btnNuevaCompra')) {
        document.getElementById('btnNuevaCompra').addEventListener('click', function() {
            carrito = [];
            mostrarProductosCompra();
            document.getElementById('detalleFactura').innerHTML = '';
            document.getElementById('productosCompra').innerHTML = '';
        });
    }

    if (document.getElementById('btnFinalizarCompra')) {
        document.getElementById('btnFinalizarCompra').addEventListener('click', function() {
            carrito = [];
            document.getElementById('detalleFactura').innerHTML = '';
            document.getElementById('productosCompra').innerHTML = '';
            alert('Compra finalizada.');
        });
    }
});

function actualizarInventario() {
    if (document.getElementById('inventario') || document.getElementById('inventarioCliente')) {
        let inventarioDiv = document.getElementById('inventario') || document.getElementById('inventarioCliente');
        inventarioDiv.innerHTML = '';

        inventario.forEach((item, index) => {
            if (item.nombre && !isNaN(item.precio) && !isNaN(item.stockActual) && !isNaN(item.stockMin) && !isNaN(item.stockMax)) {
                let itemDiv = document.createElement('div');
                itemDiv.className = 'producto';
                itemDiv.innerHTML = `<p>Nombre: ${item.nombre}</p>
                                     <p>Precio: $${item.precio}</p>
                                     <p>Stock Actual: ${item.stockActual}</p>
                                     <p>Stock Mínimo: ${item.stockMin}</p>
                                     <p>Stock Máximo: ${item.stockMax}</p>`;
                inventarioDiv.appendChild(itemDiv);
            }
        });
    }
}

function mostrarProductosCompra() {
    let productosDiv = document.getElementById('productosCompra');
    productosDiv.innerHTML = '';

    inventario.forEach((item, index) => {
        if (item.nombre && !isNaN(item.precio) && !isNaN(item.stockActual) && !isNaN(item.stockMin) && !isNaN(item.stockMax)) {
            let itemDiv = document.createElement('div');
            itemDiv.className = 'producto';
            itemDiv.innerHTML = `<p>Nombre: ${item.nombre}</p>
                                 <p>Precio: $${item.precio}</p>
                                 <p>Stock Actual: ${item.stockActual}</p>
                                 <input type="number" id="cantidad-${index}" min="1" max="${item.stockActual}" placeholder="Cantidad a comprar">
                                 <button onclick="agregarAlCarrito(${index})">Agregar al Carrito</button>`;
            productosDiv.appendChild(itemDiv);
        }
    });
}

function agregarAlCarrito(index) {
    let cantidad = parseInt(document.getElementById(`cantidad-${index}`).value);
    if (isNaN(cantidad) || cantidad <= 0 || cantidad > inventario[index].stockActual) {
        alert('Cantidad inválida');
        return;
    }

    carrito.push({ ...inventario[index], cantidad });
    inventario[index].stockActual -= cantidad;
    sessionStorage.setItem('inventario', JSON.stringify(inventario));
    document.getElementById('productosCompra').innerHTML = '';
    mostrarProductosCompra();
    calcularTotal();
}

function calcularTotal() {
    let total = carrito.reduce((sum, item) => sum + item.cantidad * item.precio, 0);
    let detalleFactura = document.getElementById('detalleFactura');
    detalleFactura.innerHTML = '<h3>Detalles de la Compra</h3>';

    carrito.forEach((item) => {
        let itemDiv = document.createElement('div');
        itemDiv.className = 'producto';
        itemDiv.innerHTML = `<p>Nombre: ${item.nombre}</p>
                             <p>Cantidad: ${item.cantidad}</p>
                             <p>Precio Unitario: $${item.precio}</p>
                             <p>Subtotal: $${item.cantidad * item.precio}</p>`;
        detalleFactura.appendChild(itemDiv);
    });

    let totalDiv = document.createElement('div');
    totalDiv.className = 'total';
    totalDiv.innerHTML = `<p>Total: $${total}</p>`;
    detalleFactura.appendChild(totalDiv);
}
