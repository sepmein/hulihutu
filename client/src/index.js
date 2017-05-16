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
            xIsNext: false
        }
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({squares: squares, xIsNext: !this.state.xIsNext});
        this.handleRequest();
    }

    handleRestart() {
        this.setState({
            squares: Array(9).fill(null),
            xIsNext: false
        });
    }

    handleRequest() {
        fetch('http://localhost:3000',{
            method: 'POST',
            body: JSON.stringify({
                'one': this.state.squares[0],
                'two': this.state.squares[1],
                'three': this.state.squares[2],
                'four': this.state.squares[3],
                'five': this.state.squares[4],
                'six': this.state.squares[5],
                'seven': this.state.squares[6],
                'eight': this.state.squares[7],
                'nine': this.state.squares[8]
            })}).then(function(response){
                console.log(response);
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

