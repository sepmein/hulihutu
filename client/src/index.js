import React from 'react'
import ReactDOM from 'react-dom'
import 'whatwg-fetch'
import './index.css'

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    // Circle can't win Cross, then the Cross wins
    let countCircle = 0;
    let countCross = 0;

    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === 'O') {
            countCircle ++;
        } else if (squares[i] === 'X') {
            countCross ++;
        }
    }
    if (countCircle === 5 && countCross === 4) {
        return 'X';
    }

    return null;
}

class Square extends React.Component {
    render() {
        return (
            <button className="square" onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }
}

class Status extends React.Component {
    render() {
        const winner = calculateWinner(this.props.squares);
        let status;
        if (winner) {
            if (this.props.humanFirst)  {
                if(winner === 'O') {
                    status = 'You wins!'
                } else {
                    status = 'Hulihutu wins!';
                }
            } else {
                if(winner === 'O') {
                    status = 'Hulihutu wins!'
                } else {
                    status = 'You wins!';
                }

            }
        } else {
            //            status = 'You are playing:'+ (this.props.humanFirst?'O':'X');
            //+'\n'+ 'Next Player: ' + (this.props.xIsNext ? 'X' : 'O');
            status = 'You are playing: ' + (this.props.humanFirst ? 'O' : 'X');
        }
        return (
            <div className="status">
                <p>Human wins: {this.props.humanWinCount} / Hulihutu wins: {this.props.hulihutuWinCount}</p>
                <p>{status}</p>
            </div>
        )
    }
}

class Actions extends React.Component {
    render() {
        return (
            <div>
                <p>actions</p>
                <button onClick={this.props.handleRestart}>
                    Restart
                </button>
            </div>
        )
    }
}
class Board extends React.Component {
    constructor(){
        super();
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: false,
            humanFirst: Math.random() >= 0.5
        }
        if (!this.state.humanFirst) {
            this.hulihutuPlay();
        }
        this.getStatistics();
    }

    handleClick(i) {
        let squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({squares: squares, xIsNext: !this.state.xIsNext}, ()=> {
            squares = this.state.squares.slice();
            if (calculateWinner(squares)) {
                this.postStatistics();
            } else {
                this.hulihutuPlay();
            }
        });
    }

    handleRestart() {
        this.setState({
            squares: Array(9).fill(null),
            xIsNext: false,
            humanFirst: Math.random() >= 0.5
        },function(){
            if (!this.state.humanFirst) {
                this.hulihutuPlay();
            }
            this.getStatistics();
        });
    }

    getStatistics() {
        fetch('http://localhost:3000/statistics')
            .then(response => response.json())
            .then(json => {
                var hulihutuWinCount, humanWinCount;
                if (json[0].winner === 'hulihutu') {
                    hulihutuWinCount = json[0].count;
                    humanWinCount = json[1].count;
                } else {
                    hulihutuWinCount = json[1].count;
                    humanWinCount = json[0].count;
                }

                this.setState({
                    hulihutuWinCount: hulihutuWinCount,
                    humanWinCount: humanWinCount
                });
            });
    }

    postStatistics() {
        let mark = calculateWinner(this.state.squares);
        let winner;
        if(mark) {
            if (this.state.humanFirst) {
                if(mark === 'O') {
                    winner = 'human';
                } else {
                    winner = 'hulihutu';
                }
            } else {
                if (mark === 'O') {
                    winner = 'hulihutu';
                } else {
                    winner = 'human';
                }
            }
        }

        if(winner) {
            fetch('http://localhost:3000/statistics',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain'
                },
                body: JSON.stringify({
                    winner: winner
                })
            });
        }

    }


    hulihutuPlay() {
        function mapSymbolToCode(symbol){
            if (symbol === 'O') {
                return 1;
            } else if (symbol === 'X') {
                return 2;
            } else {
                return 0
            }
        }
        fetch('http://localhost:3000/ai',{
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'one': mapSymbolToCode(this.state.squares[0]),
                'two': mapSymbolToCode(this.state.squares[1]),
                'three': mapSymbolToCode(this.state.squares[2]),
                'four': mapSymbolToCode(this.state.squares[3]),
                'five': mapSymbolToCode(this.state.squares[4]),
                'six': mapSymbolToCode(this.state.squares[5]),
                'seven': mapSymbolToCode(this.state.squares[6]),
                'eight': mapSymbolToCode(this.state.squares[7]),
                'nine': mapSymbolToCode(this.state.squares[8])
            })})
            .then(response=> response.json())
            .then(response => {
                var i = response.row *3 + response.column ;
                let squares = this.state.squares.slice();
                if (calculateWinner(squares) || squares[i]) {
                    return;
                }
                squares[i] = this.state.xIsNext ? 'X' : 'O';
                this.setState({squares: squares, xIsNext: !this.state.xIsNext}, () => {
                    //after play
                    //send to server
                    //check winner
                    squares = this.state.squares.slice();
                    if (calculateWinner(squares)) {
                        this.postStatistics();
                    }
                });
            }, function(error){
                console.log(error);
            });
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <Status humanFirst={this.state.humanFirst}
                    squares={this.state.squares} xIsNext={this.state.xIsNext}
                    humanWinCount={this.state.humanWinCount}
                    hulihutuWinCount={this.state.hulihutuWinCount}
                />
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
                <Actions handleRestart={() => this.handleRestart()}/>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

