// configuracion del socket del lado del cliente
const socket = io();

// Mensaje de inicio cuando se conecta un nuevo cliente
socket.emit("inicio", "Cliente conectado");

// Elimina un producto por ID
document.getElementById("btnDelete").addEventListener("click", () => {
  socket.emit("deleteProduct", document.getElementById("idProd").value);
});

// Agrega Producto
document.getElementById("btnAdd").addEventListener("click", () => {
  let obj = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    status: document.getElementById("status").value,
    category: document.getElementById("category").value,
  };
  socket.emit("addProduct", obj);
});

// Lista todos los productos del archivo
socket.on("productos", (data) => {
  let logs = "";

  data.products.forEach((log) => {
    logs += `Id: ${log.id} || Nombre: ${log.title} || descripción: ${log.description} || Precio: ${log.price} || Imágen: ${log.thumbnail} || Código: ${log.code} || Stock: ${log.stock} || Estado: ${log.status} || Categoría: ${log.category}  <br/>`;
  });
  document.getElementById("lista-productos").innerHTML = logs;
});

// En el caso de error de validación en la carga manda mensaje solamente para quien esta cargando
socket.on("error", (data) => {
  if (data !== "0") alert(data);
});
