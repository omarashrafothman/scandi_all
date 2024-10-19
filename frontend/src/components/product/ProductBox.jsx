import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import shoppingCart from "../../assets/images/cart.png";
import { CartContext } from '../../context/CartContext.js';

export default class ProductBox extends Component {
    static contextType = CartContext; // استخدام Context

    handleAddToCart = (skuId) => {
        this.context.addToCart(skuId); // استدعاء دالة إضافة إلى العربة
    };
    // addToCart = async (skuId) => {

    //     const ADD_TO_CART_MUTATION = `
    //         mutation add {
    //             addToCart(sku_id: ${skuId}) {
    //                 id
    //             }
    //         }
    //     `;


    //     const response = await fetch('http://localhost/php_projects/scandiweb_store/backend/index.php', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             query: ADD_TO_CART_MUTATION,
    //             variables: { skuId },
    //         }),
    //     });

    //     const result = await response.json();
    //     console.log(result);

    //     if (result.errors) {
    //         console.error('Error adding item to cart:', result.errors);
    //     } else {
    //         console.log('Item added to cart:', result.data.addToCart);
    //     }
    // };

    render() {
        const { image, name, price, id, stock } = this.props;

        return (
            <div className='productBox'>
                <button className='addToCart bo' onClick={() => this.handleAddToCart(id)}>
                    <img src={shoppingCart} alt='add to cart' />
                </button>
                {stock ? <span className='stockStatus'>
                    <p>OUT OF STOCK</p>
                </span> : ""}
                <div className='productImageBox'>
                    <Link to={"/product/" + id}>
                        <img src={image} className='productImage' alt='product' />
                    </Link>
                </div>
                <p className='productName'>{name}</p>
                <p className='productPrice'>${price}</p>
            </div>
        );
    }
}
