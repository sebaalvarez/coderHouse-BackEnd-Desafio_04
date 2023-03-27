// configuracion del socket del lado del cliente
const socket = io();
// alert("prueba");
socket.emit("msg_00", "Hola, me estoy comunicando desde el socket!!!");

socket.on("msg_01", (data) => {
  console.log(data);
  // alert(data);
});

socket.on("msg_02", (data) => {
  console.log(data);
  // alert(data);
});

socket.on("msg_03", (data) => {
  console.log(data);
  // alert(data);
});
