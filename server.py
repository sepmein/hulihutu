from concurrent import futures
import grpc
import Hulihutu_pb2
import Hulihutu_pb2_grpc
import time
_ONE_DAY_IN_SECONDS = 60 * 60 * 24

class HulihutuServicer(Hulihutu_pb2_grpc.HulihutuServicer):
    """Provides methods that implement functionality of route guide server."""

    def GetNextMove(self, request, context):
        return Hulihutu_pb2.Move(row=1, column=1) 

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    Hulihutu_pb2_grpc.add_HulihutuServicer_to_server(HulihutuServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    try:
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        server.stop(0)
        
if __name__ == '__main':
    serve()
