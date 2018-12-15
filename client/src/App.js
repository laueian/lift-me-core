import React, { Component } from "react";
import "./App.css";
import Card from "./components/Card.js";
import Header from "./components/Header.js";

class App extends Component {
  constructor() {
    super();
    this.state = {
      quotes: []
    };
  }

  componentDidMount() {
    fetch("https://life-me.herokuapp.com/quotes")
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ quotes: data });
      });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <ul className="Cards">
          {this.state.quotes.map((item, i) => {
            return <Card body={item.body} author={item.author} key={i} />;
          })}
        </ul>
      </div>
    );
  }
}

export default App;
