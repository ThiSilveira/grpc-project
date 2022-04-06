
## gRPC Project

Node, gRPC, MySQL and Prisma CRUD example.


## Getting started

Run gPRC Server

```bash
# Clone the repository
git clone git@github.com:ThiSilveira/grpc-project.git
cd src/grpc-project

# Copy the file .env.example to .env
cp .env.example .env

# Run Docker
docker-compose up
```

Run gPRC Client

```bash
# Go to Postman API Platform 
[Postman API Platform](https://www.postman.com)

# Create a gRPC request
    # Put a server URL
    # Import a protobuf file example: products.proto

#Or

# Go to folder client and Run app.js
cd client
node app.js
```

## Authors

- [@thisilveira](https://github.com/ThiSilveira)


## References and Learn More

 - [gRPC Documentation](https://www.grpc.io/docs/)
 - [Prisma Documentation](https://www.prisma.io/docs/)

