import express, { urlencoded } from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import _dirname from "./utils.js";
// import userRoutes from "./routes/users.routes.js";
import productRoutes from "./routes/products.routes.js";
// import cartRoutes from "./routes/carts.routes.js";
import ProductManager from "./controller/productManager.js";
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
// app.use("/api/users", userRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/carts", cartRoutes);

app.use("/", productRoutes);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

let products = [];
const pm = new ProductManager("./files");

// web socket
const socketServer = new Server(httpServer);

/***     Manejo de socket ***/
socketServer.on("connection", (socket) => {
  // mensaje de nuevo cliente conectado
  socket.on("inicio", async (data) => {
    console.log(data);
    products = await pm.getProducts();
    socketServer.emit("productos", { products });
  });

  // Para eliminar producto
  socket.on("deleteProduct", async (data) => {
    await pm.deleteProductoById(parseInt(data));
    products = await pm.getProducts();
    socketServer.emit("productos", { products });
  });

  // Para agregar producto
  socket.on("addProduct", async (data) => {
    let arrVali = pm.validaIngresos(data);

    if (arrVali[0] === 1) {
      socket.emit("error", arrVali[1]);
    } else {
      await pm.addProduct(data);
    }

    products = await pm.getProducts();
    socketServer.emit("productos", { products });
  });
});
