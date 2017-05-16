from hulihutu import tictac, mdp
import numpy as np
db = mdp.DB()
policy = mdp.Policy(gamma=0.9, tao=0, db=db, default_value=0)

tt = tictac.Tictac()

"""
    Get Next Move
    input a board, get a move
"""
def get_next_move(board):
    print(board)
    tt.board[0,0] = getValue(board.one)
    tt.board[0,1] = getValue(board.two)
    tt.board[0,2] = getValue(board.three)
    tt.board[1,0] = getValue(board.four)
    tt.board[1,1] = getValue(board.five)
    tt.board[1,2] = getValue(board.six)
    tt.board[2,0] = getValue(board.seven)
    tt.board[2,1] = getValue(board.eight)
    tt.board[2,2] = getValue(board.nine)
    print(tt.board)
    num_circle = np.count_nonzero(tt.board == 1)
    num_cross = np.count_nonzero(tt.board == -1)
    if num_circle > num_cross:
        tt.color = -1
        (action, value, method) = tt.apply_policy(policy.pai, 'min')
    else:
        tt.color = 1
        (action, value, method) = tt.apply_policy(policy.pai, 'max')
    return action

def getKey(x):
    return {
        'one': (0,0),
        'two': (0,1),
        'three': (0,2),
        'four': (1,0),
        'five': (1,1),
        'six': (1,2),
        'seven': (2,0),
        'eight': (2,1),
        'nine': (2,2)
        }.get(x)

def getValue(x):
    if x == 2:
        return -1
    else:
        return x
