require('dotenv').config()

const path = require('path')
const RouteDefinition = path.resolve(__dirname, '../protos/products.proto');

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const {
    PrismaClient
} = require('@prisma/client')

const prisma = new PrismaClient();

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

const listProducts = async (call, callback) => {
    return callback(null, await prisma.Product.findMany())
}

const findProduct = async (call, callback) => {

    const product = await prisma.Product.findFirst({
        where: {
            id: Number(call.metadata.get('id')[0])
        }
    })
    if (product) {
        callback(null, product)
    } else {
        callback({
            message: 'That product does not exist.'
        })
    }
}

const createProduct = async (call, callback) => {
    try {
        const product = await prisma.Product.create({
            data: {
                name: call.metadata.get('name')[0],
                amount: Number(call.metadata.get('amount')[0]),
                description: call.metadata.get('description')[0]
            }
        })
        callback(null, JSON.stringify(product))
    } catch (err) {
        callback({
            message: err
        })
    }
}

const updateProduct = async (call, callback) => {
    try {
        const product = await prisma.Product.update({
            where: {
                id: Number(call.metadata.get('id')[0])
            },
            data: {
                name: call.metadata.get('name')[0],
                amount: Number(call.metadata.get('amount')[0]),
                description: call.metadata.get('description')[0]
            }
        })
        callback(null, JSON.stringify(product))
    } catch (err) {
        callback({
            message: err
        })
    }
}

const deleteProduct = async (call, callback) => {

    const product = await prisma.Product.delete({
        where: {
            id: Number(call.metadata.get('id')[0])
        }
    })
    if (product) {
        callback(null, product)
    } else {
        callback({
            message: 'That product does not exist.'
        })
    }
}

/**
 * Starts an RPC server that receives requests for the Products service 
 */
(async () => {
    try {
        const routeServer = getServer();

        routeServer.bindAsync(GRPC_HOST, grpc.ServerCredentials.createInsecure(), () => {
            routeServer.start();
            console.log(">>>>>>  Running gRPC Server  <<<<<<")
        });
    } catch (err) {
        throw err
    } finally {
        await prisma.$disconnect()
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