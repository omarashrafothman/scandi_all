import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import shoppingCart from "../../assets/images/cart.png";
export default class ProductBox extends Component {
    render() {
        const { image, name, price, id } = this.props;
        return (
            <div className='productBox'>
                <button className='addToCart bo'>
                    <img src={shoppingCart} alt='add to cart' />
                </button>
                <div className='productImageBox'>
                    <Link to={"/product/" + id}> <img src={image} className='productImage' alt='product' /></Link>
                </div>
                <p className='productName'>{name}</p>
                <p className='productPrice'>${price}</p>
            </div>
        )
    }
}
