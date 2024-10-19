import React, { createContext, Component } from 'react';
import { GET_CART } from "../graphql/queries";
export const CartContext = createContext();

export class CartProvider extends Component {
    state = {
        cart: [],
        loading: true,
        error: null,
    };


    fetchCart = async () => {

        try {
            const response = await fetch('http://localhost/php_projects/scandiweb_store/backend/index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: GET_CART }),
            });
            const result = await response.json();
            if (result.errors) {
                this.setState({ error: result.errors[0].message, loading: false });
            } else {
                this.setState({ cart: result.data.cart.cartItems, loading: false });
            }
        } catch (err) {
            this.setState({ error: 'Failed to fetch cart', loading: false });
        }
    };


    addToCart = async (skuId) => {
        const ADD_TO_CART_MUTATION = `
      mutation add {
        addToCart(sku_id: ${skuId}) {
          id
        }
      }
    `;
        try {
            const response = await fetch('http://localhost/php_projects/scandiweb_store/backend/index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: ADD_TO_CART_MUTATION,
                    variables: { skuId },
                }),
            });
            const result = await response.json();
            if (result.errors) {
                console.error('Error adding item to cart:', result.errors);
            } else {
                this.fetchCart();
            }
        } catch (err) {
            console.error('Failed to add item to cart:', err);
        }
    };

    render() {
        return (
            <CartContext.Provider
                value={{
                    cart: this.state.cart,
                    loading: this.state.loading,
                    error: this.state.error,
                    fetchCart: this.fetchCart,
                    addToCart: this.addToCart,
                }}
            >
                {this.props.children}
            </CartContext.Provider>
        );
    }
}
