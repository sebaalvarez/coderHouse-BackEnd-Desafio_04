import express, { urlencoded } from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import _dirname from "./utils.js";
import userRoutes from "./routes/users.routes.js";
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/carts.routes.js";

const app = express();
const PORT = 8080;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(_dirname + "/public"));

// motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", _dirname + "/views");
app.set("view engine", "handlebars");

// endpoints
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// web socket
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  // console.log("nuevo cliente conectado");

  socket.on("msg_00", (data) => {
    console.log(data);
  });

  socket.emit("msg_01", "Mensaje enviado desde el back");

  socket.broadcast.emit(
    "msg_02",
    "Mensaje para todos los sockets menos el que envía"
  );

  socketServer.emit("msg_03", "Mensaje para todos los sockets");
});
