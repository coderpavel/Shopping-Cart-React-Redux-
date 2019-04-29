import React, { Component } from 'react';
import axios from 'axios';
import Filter from './components/Filter';
import Products from './components/Products';
import Basket from './components/Basket';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      filteredProducts: [],
      cartItems: []
    }

    this.handleChangeSort = this.handleChangeSort.bind(this);
    this.handleChangeSize = this.handleChangeSize.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleRemoveFromCart = this.handleRemoveFromCart.bind(this);
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

    if(localStorage.getItem('cartItems')){
      this.setState({
        cartItems: JSON.parse(localStorage.getItem('cartItems'))
      });
    }
  }

  handleRemoveFromCart(e, item) {
   
    this.setState(state => {
      const cartItems = state.cartItems.filter(cartItem => item.id !== cartItem.id );
      localStorage.setItem('cartItems', cartItems);
      return {cartItems};
    });

    
  }

  handleAddToCart(e, product) {
    this.setState(state => {
      const { cartItems } = state;
      let isProductInCart = false;

      cartItems.forEach(item => {
        if (item.id === product.id) {
          isProductInCart = true;
          item.count++;
        }
      });

      if (!isProductInCart) {
        cartItems.push({ ...product, count: 1 });
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return cartItems;

    })
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
          <div className="col-md-8">
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
          <div className="col-md-4">
            <Basket cartItems={this.state.cartItems} handleRemoveFromCart={this.handleRemoveFromCart} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
