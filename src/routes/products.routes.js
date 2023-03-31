import { Router } from "express";
import path from "path";
import ProductManager from "../controller/productManager.js";

const router = Router();
let products = [];
const pm = new ProductManager(path.join(".", "files"));

/****************************/
/***  Salida por plantillas   **/
/***************************/

/***  Obtiene Todos los productos y los muestra por navegador  ***/
router.get("/", async (req, res) => {
  products = await pm.getProducts();

  res.render("home", { products });
});

/***  Manejo de WebSockets ***/
router.get("/realtimeproducts", async (req, res) => {
  res.render("index", {});
});

/****************************/
/*****  Salida por url  *******/
/***************************/

/***   Obtiene Todos los productos ***/
router.get("/all", async (req, res) => {
  products = await pm.getProducts();
  let limit = req.query.limit;

  res.status(200).send({
    status: "Success",
    message: !limit ? products : products.slice(0, limit),
  });
});

/***   Obtiene producto por ID ***/
router.get("/:pid", async (req, res) => {
  products = await pm.getProductById(parseInt(req.params.pid));

  if (!products) {
    res.status(202).send({
      status: "info",
      error: `No se encontró el producto con ID: ${req.params.pid}`,
    });
  } else {
    res.status(200).send({ status: "Success", message: products });
  }
});

/***   Carga producto ***/
router.post("/", async (req, res) => {
  let user = req.body;
  let arrVali = pm.validaIngresos(user);

  if (arrVali[0] === 1) {
    res.status(400).send({ status: "Error", message: arrVali[1] });
  } else {
    await pm.addProduct(user);
    res.status(200).send({
      status: "Success",
      message: `Se cargo el producto Cod: ${user.code}`,
    });
  }
});

/*** Actualiza producto por ID ***/
router.put("/:pid", async (req, res) => {
  let user = req.body;
  let pid = parseInt(req.params.pid);
  let arrVali = pm.validaIngresos(user);

  if (arrVali[0] === 1) {
    res.status(400).send({ status: "Error", message: arrVali[1] });
  } else {
    await pm.updateProductById(pid, user);
    res.status(200).send({
      status: "Success",
      message: `Se actualizó el producto Id: ${pid}`,
    });
  }
});

/***   Elimina producto por ID ***/
router.delete("/:pid", async (req, res) => {
  let arrVali = await pm.deleteProductoById(parseInt(req.params.pid));
  if (arrVali[0] === 1) {
    res.status(400).send({ status: "Error", message: arrVali[1] });
  } else {
    res.status(200).send({
      status: "Success",
      message: `Se eliminó el producto ID: ${req.params.pid}`,
    });
  }
});

export default router;
