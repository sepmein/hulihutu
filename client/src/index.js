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
            status = 'Winner: ' + winner;
        } else {
            status = 'Next Player: ' + (this.props.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="status">{status}</div>
        )
    }
}

class Actions extends React.Component {
    render() {
        return (
            <div>
                <p>actions</p>
                <button onClick={()=> this.props.handleRestart()}>
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
            console.log(this.state)
            this.hulihutuPlay();
        }
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({squares: squares, xIsNext: !this.state.xIsNext}, ()=> {
            this.hulihutuPlay();
        });
    }

    handleRestart() {
        this.setState({
            squares: Array(9).fill(null),
            xIsNext: false,
            humanFirst: Math.random >= 0.5
        });
    }

    hulihutuPlay() {
        var that = this;
        function mapSymbolToCode(symbol){
            if (symbol == 'O') {
                return 1;
            } else if (symbol == 'X') {
                return 2;
            } else {
                return 0
            }
        }
        fetch('http://localhost:3000',{
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
                console.log(response);
                var i = response.row *3 + response.column ;
                console.log(i)
                const squares = this.state.squares.slice();
                if (calculateWinner(squares) || squares[i]) {
                    return;
                }
                squares[i] = this.state.xIsNext ? 'X' : 'O';
                this.setState({squares: squares, xIsNext: !this.state.xIsNext});
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
                <Status squares={this.state.squares} xIsNext={this.state.xIsNext}/>
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
                <Actions handleRestart={this.handleRestart}/>
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

