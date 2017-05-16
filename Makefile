generatePythonProto:
	python3 -m grpc_tools.protoc -I./src --python_out=./server/python --grpc_python_out=./server/python src/Hulihutu.proto

startNodeServer:
	node ./server/node/index.js &

startPythonServer:
	python3 ./server/python/server.py &

start: startPythonServer startNodeServer

setup:
	cd ./server/node
	npm install
	pip3 install grpcio grpcio_tools hulihutu -U
