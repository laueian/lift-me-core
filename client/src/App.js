import React, { Component } from 'react';
import './App.css';
import Card from './components/Card.js';

class App extends Component {

  constructor(){
    super();
    this.state = {
      quotes: []
    };
  }

  componentDidMount() {
    fetch("/quotes").then((response) => {
      return response.json();
    }).then((data)=>{
      this.setState({quotes: data});
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <ul>
            {this.state.quotes.map((item, i) => {
              return <Card body={item.body} author={item.author} key={i} />
            })}
          </ul>    
        </header>
      </div>
    );
  }
  
}

export default App;
