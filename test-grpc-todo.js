const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

async function main() {
  const protoPath = path.join(__dirname, 'packages/shared-contracts/src/ports/proto/todo.proto');
  console.log('Loading proto from:', protoPath);

  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [path.join(__dirname, 'packages/shared-contracts/src/ports/proto')],
  });

  const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;

  const client = new todoProto.TodoService('localhost:5004', grpc.credentials.createInsecure());

  console.log('Calling GetUserTodos...');
  client.getUserTodos({ userId: 'some-user-id' }, (err, response) => {
    if (err) {
      console.error('Error returned by gRPC:', err);
    } else {
      console.log('Response returned by gRPC:', response);
    }
  });
}

main().catch(console.error);
