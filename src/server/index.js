require('dotenv').config();

const path = require('path');
const RouteDefinition = path.resolve(__dirname, '../protos/products.proto');

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const {
    listProducts,
    findProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('./service/product');

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

/**
 * Starts an RPC server that receives requests for the Products service 
 */
(async () => {
    try {
        const routeServer = getServer();

        routeServer.bindAsync(GRPC_HOST, grpc.ServerCredentials.createInsecure(), () => {
            routeServer.start();
            console.log(`>>>>> 🚀  Server gRPC is running on ${GRPC_HOST} <<<<<`)
        });
    } catch (err) {
        throw err
    }
})()

function getServer() {
    const server = new grpc.Server();

    server.addService(productService.ProductService.service, {
        listProducts,
        findProduct,
        createProduct,
        updateProduct,
        deleteProduct
    });

    return server;
}