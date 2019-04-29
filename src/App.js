import React, { Component } from 'react';
import axios from 'axios';
import Filter from './components/Filter';
import Products from './components/Products'
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      filteredProducts: []
    }

    this.handleChangeSort = this.handleChangeSort.bind(this);
    this.handleChangeSize = this.handleChangeSize.bind(this);
  }

  componentDidMount() {
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

  handleChangeSort(e) {
    this.setState({ sort: e.target.value });
    this.listProducts();
  }

  handleChangeSize(e) {
    this.setState({ size: e.target.value });
    this.listProducts();
  }

  listProducts() {
    this.setState(state => {
      if (state.sort !== '') {
        state.products.sort((a, b) => (state.sort === 'lowest') ? (a.price > b.price ? 1 : -1) : (a.price < b.price ? 1 : -1)
        );
      } else {
        state.products.sort((a, b) => (a.id < b.id ? 1 : -1));
      }

      if (state.size !== '') {
        return {
          filteredProducts: state.products.filter(product => product.availableSizes.indexOf(state.size.toUpperCase()) >= 0)
        }
      }
      return { filteredProducts: state.products }
    })
  }

  render() {
    return (
      <div className="container">
        <h1>E-commerce Shopping Cart Application</h1>
        <hr />
        <div className="row">
          <div className="col-md-9">
            <Filter
              size={this.state.size}
              sort={this.state.sort}
              count={this.state.filteredProducts.length}
              handleChangeSize={this.handleChangeSize}
              handleChangeSort={this.handleChangeSort}
            />
            <Products
              products={this.state.filteredProducts}
              handleAddToCart={this.handleAddToCart}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
