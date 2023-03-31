import express, { urlencoded } from "express";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import _dirname from "./utils.js";
import userRoutes from "./routes/users.routes.js";
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/carts.routes.js";
import ProductManager from "./controller/productManager.js";
import path from "path";

const app = express();
const PORT = 8080;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(_dirname, "public")));

// motor de plantillas
app.set("views", path.join(_dirname, "views"));

app.engine(
  ".hbs",
  exphbs.engine({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", ".hbs");

// endpoints
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

let products = [];
const pm = new ProductManager(path.join(".", "files"));

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
