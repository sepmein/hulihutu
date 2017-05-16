from concurrent import futures
import grpc
import Hulihutu_pb2
import Hulihutu_pb2_grpc
import time
_ONE_DAY_IN_SECONDS = 60 * 60 * 24
import ai

class HulihutuServicer(Hulihutu_pb2_grpc.HulihutuServicer):
    """Provides methods that implement functionality of route guide server."""

    def GetNextMove(self, request, context):
        print(request)
        board = request
        action = ai.get_next_move(board)
        return Hulihutu_pb2.Move(row=action[0], column=action[1]) 

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
        
serve()
