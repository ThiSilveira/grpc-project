const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const listProducts = async (call, callback) => {
    const products = await prisma.Product.findMany()
    return callback(null, {
        products
    })
}

const findProduct = async (call, callback) => {
    const product = await prisma.Product.findFirst({
        where: {
            id: Number(call.request.id)
        }
    })
    if (product) {
        callback(null, product)
    } else {
        callback({
            // code: grpc.status.NOT_FOUND,
            message: 'Requested resource was not found'
        })
    }
}

const createProduct = async (call, callback) => {
    try {
        const product = await prisma.Product.create({
            data: {
                name: call.request.name,
                amount: Number(call.request.amount),
                description: call.request.description
            }
        })
        callback(null, product)
    } catch (err) {
        callback({
            // code: grpc.status.UNKNOWN,
            message: err.message
        })
    }
}

const updateProduct = async (call, callback) => {
    try {
        const product = await prisma.Product.update({
            where: {
                id: Number(call.request.id)
            },
            data: {
                name: call.request.name,
                amount: Number(call.request.amount),
                description: call.request.description
            }
        })
        callback(null, product)
    } catch (err) {
        callback({
            // code: grpc.status.UNKNOWN,
            message: err.message
        })
    }
}

const deleteProduct = async (call, callback) => {
    const product = await prisma.Product.delete({
        where: {
            id: Number(call.request.id)
        }
    })
    if (product) {
        callback(null, product)
    } else {
        callback({
            // code: grpc.status.NOT_FOUND,
            message: 'Requested resource was not found'
        })
    }
}

module.exports = {
    listProducts,
    findProduct,
    createProduct,
    updateProduct,
    deleteProduct
}