import fs from "fs";
import Product from "../model/product.js";

class ProductManager {
  dirName = "";
  fileName = "products.json";
  ruta = "";

  constructor(dirName) {
    this.dirName = dirName;
    this.ruta = this.dirName + "/" + this.fileName;
    this.crearDirectorio(this.dirName);
    this.validarExistenciaArchivo(this.ruta);
    this.arrayP = JSON.parse(fs.readFileSync(this.ruta, "utf-8"));
  }

  crearDirectorio = async (directorio) => {
    try {
      await fs.promises.mkdir(directorio, { recursive: true });
    } catch (err) {
      console.error(`ERROR al crear directorio del producto: ${err}`);
    }
  };

  validarExistenciaArchivo = (ruta) => {
    try {
      if (!fs.existsSync(ruta)) fs.writeFileSync(ruta, "[]");
    } catch (err) {
      console.error(`ERROR no se pudo crear el archivo del Producto: ${err}`);
    }
  };

  addProduct = async (product) => {
    try {
      this.validarExistenciaArchivo(this.ruta);
      if (this.validaIngresos(product)[0] == 0) {
        let prod = new Product(
          product.title,
          product.description,
          product.price,
          product.thumbnail,
          product.code,
          product.stock,
          product.status,
          product.category
        );

        this.arrayP.push(prod);
        console.log(`Se cargo el producto ${product.code}`);
        await fs.promises.writeFile(this.ruta, JSON.stringify(this.arrayP));
      }
    } catch (err) {
      console.error(`ERROR agregando Productos: ${err}`);
    }
  };

  getProducts = async () => {
    try {
      this.validarExistenciaArchivo(this.ruta);
      return JSON.parse(await fs.promises.readFile(this.ruta, "utf-8"));
    } catch (err) {
      console.error(`ERROR obteniendo Productos: ${err}`);
    }
  };

  getProductById = async (id) => {
    try {
      let prod = {};
      this.validarExistenciaArchivo(this.ruta);
      let arrayP = JSON.parse(await fs.promises.readFile(this.ruta, "utf-8"));
      for (const obj of arrayP) if (obj.id === id) prod = { ...obj };

      return prod;
    } catch (err) {
      console.error(`ERROR obteniendo Producto por ID: ${err}`);
    }
  };

  updateProductById = async (id, product) => {
    try {
      this.validarExistenciaArchivo(this.ruta);
      let arryP = JSON.parse(await fs.promises.readFile(this.ruta, "utf-8"));
      for (const obj of arryP) {
        if (obj.id === id) {
          if (this.validaIngresos(product)[0] == 0) {
            obj.title = product.title;
            obj.description = product.description;
            obj.price = product.price;
            obj.thumbnail = [...product.thumbnail];
            obj.code = product.code;
            obj.stock = product.stock;
            obj.status = product.status;
            obj.category = product.category;
          }
        }
      }
      await fs.promises.writeFile(this.ruta, JSON.stringify(arryP));
      console.log(`El producto id: ${id} fue actualizado correctamente`);
    } catch (err) {
      console.error(`ERROR actualizando Producto: ${err}`);
    }
  };

  deleteProductoById = async (id) => {
    try {
      this.validarExistenciaArchivo(this.ruta);
      let arryP = JSON.parse(await fs.promises.readFile(this.ruta, "utf-8"));
      let arryNew = new Array();

      for (const obj of arryP) if (obj.id !== id) arryNew.push({ ...obj });

      await fs.promises.writeFile(this.ruta, JSON.stringify(arryNew));
      console.log(`El producto id: ${id} fue eliminado correctamente`);
    } catch (err) {
      console.log(`ERROR borrando Producto por ID: ${err}`);
    }
  };

  getProductByCode = (code) => {
    for (const obj of this.arrayP) if (obj.code === code) return obj;
  };

  validaIngresos = (product) => {
    if (
      product.title == "" ||
      product.description == "" ||
      product.price == "" ||
      product.thumbnail == "" ||
      product.code == "" ||
      product.stock == "" ||
      product.status == "" ||
      product.category == ""
    ) {
      return [1, "Existen parámetros de ingreso en blanco"];
    }
    if (
      product.title == undefined ||
      product.description == undefined ||
      product.price == undefined ||
      product.thumbnail == undefined ||
      product.code == undefined ||
      product.stock == undefined ||
      product.status == undefined ||
      product.category == undefined
    ) {
      return [1, "Faltan parámetros de ingreso"];
    }

    if (this.getProductByCode(product.code) != undefined) {
      return [1, `El código ${product.code} ya existe para otro producto`];
    }

    return [0, "Validaciones OK"];
  };
}

export default ProductManager;
