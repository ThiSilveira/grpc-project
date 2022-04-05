require('dotenv').config()

const path = require('path')
const RouteDefinition = path.resolve(__dirname, '../protos/products.proto');

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const {
  GRPC_HOST
} = process.env

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
  client.list({}, (err, res) => {
    if (err) throw err
  })
}

function runFind() {
  return new Promise((resolve, reject) => {
    client.find({
      id: '2'
    }, (err, res) => {
      if (err) reject(err)

      resolve(res)
    })
  })
}

(async () => {

  console.log(JSON.stringify(GRPC_HOST))
  const resFind = await runFind()

  console.log(resFind);

  const resList = await runList()

  console.log(resList)
})()

/**
 * Run all of the demos inß order
 */
//(function main() {
//async.series([
//runList,
//runFind
//]);
//})()

exports.runList = runList;
exports.runFind = runFind;