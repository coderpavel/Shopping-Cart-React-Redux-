import React, { Component } from 'react';
import axios from 'axios';
import Products from './components/Products'
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      filteredProducts: []
    }
  }

  componentWillMount() {
    axios.get("http://localhost:8000/products/")
      .then(res => this.setState({
        products: res.data,
        filteredProducts: res.data
      }));

    // fetch("http://localhost:8000/products/")
    //   .then(res => res.json())
    //   .then(data => this.setState({
    //     products: data,
    //     filteredProducts: data
    //   }));
  }

  render() {
    return (
      <div className="container">
        <h1>E-commerce Shopping Cart Application</h1>
        <hr />
        <div className="row">
          <div className="col-md-9">
            <Products products={this.state.filteredProducts} handleAddToCart={this.handleAddToCart} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
