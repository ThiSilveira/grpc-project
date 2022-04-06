const path = require('path')
const RouteDefinition = path.resolve(__dirname, '../protos/products.proto');

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
  RouteDefinition, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

const productService = grpc.loadPackageDefinition(packageDefinition).productService;
const client = new productService.ProductService("0.0.0.0:50051", grpc.credentials.createInsecure());

function runList() {
  return new Promise((resolve, reject) => {
    client.listProducts({}, (err, res) => {
      if (err) throw err
      resolve(res)
    })
  })
}

function runFind() {
  return new Promise((resolve, reject) => {
    client.findProduct({
      id: '1'
    }, (err, res) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

function runCreate() {
  return new Promise((resolve, reject) => {
    client.createProduct({
        amount: 100,
        description: "testing products",
        name: "product one"
    }, (err, res) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

function runUpdate() {
  return new Promise((resolve, reject) => {
    client.updateProduct({
      id: '1',
      amount: 200,
      name: "product two"
    }, (err, res) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

function runDelete() {
  return new Promise((resolve, reject) => {
    client.deleteProduct({
      id: '1'
    }, (err, res) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

(async () => {
  const resCreate = await runCreate()
  console.log("Create Product")
  console.log(resCreate);

  const resFind = await runFind()
  console.log("Find Product")
  console.log(resFind);

  const resUpdate = await runUpdate()
  console.log("Update Product")
  console.log(resUpdate);

  const resList = await runList()
  console.log("List Product")
  console.log(resList)

  const resDelete = await runDelete()
  console.log("Delete Product")
  console.log(resDelete);
})()