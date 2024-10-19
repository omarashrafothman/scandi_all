import React, { Component } from 'react';
import cart from "../../assets/images/shopping-cart.png";

export default class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartElements: this.props.cartElements || [], // Ensure it's an array even if undefined
        };
    }

    componentDidUpdate(prevProps) {
        // Update state if new props are received
        if (prevProps.cartElements !== this.props.cartElements) {
            this.setState({
                cartElements: this.props.cartElements,
            });
        }
    }

    // Increment quantity of cart items
    incrementQuantity = (cartItemId) => {
        this.setState((prevState) => {
            const updatedCart = prevState.cartElements.map((item) => {
                if (item.id === cartItemId) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                    };
                }
                return item;
            });
            return { cartElements: updatedCart };
        });
    };

    // Decrement quantity of cart items
    decrementQuantity = (cartItemId) => {
        this.setState((prevState) => {
            const updatedCart = prevState.cartElements.map((item) => {
                if (item.id === cartItemId && item.quantity > 1) {
                    return {
                        ...item,
                        quantity: item.quantity - 1,
                    };
                }
                return item;
            });
            return { cartElements: updatedCart };
        });
    };

    // Function to calculate total price for each cart item based on quantity
    calculateTotalPrice = (cartItem) => {
        return cartItem.quantity * cartItem.product.prices[0].amount;
    };

    // Function to calculate total cart price
    calculateTotalCartPrice = () => {
        const { cartElements } = this.state;
        return cartElements.reduce(
            (acc, cartItem) => acc + this.calculateTotalPrice(cartItem),
            0
        ).toFixed(2); // Ensure only 2 decimal points
    };

    render() {
        const { cartElements } = this.state;

        return (
            <div>
                <button
                    type="button"
                    className="btn position-relative"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                >

                    {cartElements.length <= 0 ? "" : <span className="cartCount">{cartElements.length}</span>}
                    <img src={cart} alt="cart icon" />
                </button>

                <div className="modal fade" id="exampleModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="cartHeading d-flex align-items-center">
                                    <h4>My Bag, </h4>
                                    <p className="m-0">{cartElements.length} items</p>
                                </div>

                                <div className="cartItemsContainer my-2">
                                    {cartElements.length > 0 ? (
                                        cartElements.map((cartItem) => (
                                            <div className="cartItem w-100 d-flex" key={cartItem.id}>
                                                <div className="w-50 cartItemContent">
                                                    <h5 className="itemName">{cartItem.product.name}</h5>
                                                    <p className="m-0 itemPrice">
                                                        {cartItem.product.prices[0].currency_symbol}
                                                        {this.calculateTotalPrice(cartItem).toFixed(2)}
                                                    </p>

                                                    <div className="productAttr">
                                                        {cartItem.product.attributes.map((attrItem) => {
                                                            let content;
                                                            switch (attrItem.name) {
                                                                case "Color":
                                                                    content = (
                                                                        <div className="productColors">
                                                                            <p>{attrItem.name}:</p>
                                                                            <div className="d-flex align-items-center w-75 sizesContainer my-2">
                                                                                {attrItem.items.map((item, index) => (
                                                                                    <label
                                                                                        className="containerBlock colorItem"
                                                                                        style={{ background: item.value }}
                                                                                        key={index}
                                                                                    >
                                                                                        <input
                                                                                            type="radio"
                                                                                            name="color"
                                                                                            value={item.value}
                                                                                        />
                                                                                        <span className="checkmark"></span>
                                                                                    </label>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                    break;

                                                                default:
                                                                    content = (
                                                                        <div className="productSizes my-2">
                                                                            <p>{attrItem.name}:</p>
                                                                            {attrItem.items.map((item, index) => (
                                                                                <label
                                                                                    className="containerBlock my-1"
                                                                                    key={index}
                                                                                >
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={"size"}
                                                                                        value={item.display_value}
                                                                                    />
                                                                                    <span className="checkmark">
                                                                                        {item.display_value}
                                                                                    </span>
                                                                                </label>
                                                                            ))}
                                                                        </div>
                                                                    );
                                                                    break;
                                                            }
                                                            return content;
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="w-50 d-flex justify-content-between align-items-center">
                                                    <div className="d-flex align-items-center justify-content-between flex-column cartItemquantity">
                                                        <button
                                                            className="d-flex align-items-center justify-content-center"
                                                            onClick={() => this.incrementQuantity(cartItem.id)}
                                                        >
                                                            +
                                                        </button>
                                                        <span>{cartItem.quantity}</span>
                                                        <button
                                                            className="d-flex align-items-center justify-content-center"
                                                            onClick={() => this.decrementQuantity(cartItem.id)}
                                                        >
                                                            -
                                                        </button>
                                                    </div>

                                                    <div className="itemImage">
                                                        <img
                                                            src={cartItem.product.galleries[0].image_url}
                                                            alt="product image"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Your cart is empty.</p>
                                    )}
                                </div>
                                {cartElements.length > 0 && (
                                    <div className="totalPrice d-flex align-items-center justify-content-between">
                                        <p className="m-0">Total</p>
                                        <p className="m-0">
                                            {cartElements[0]?.product.prices[0]?.currency_symbol}
                                            {this.calculateTotalCartPrice()}
                                        </p>
                                    </div>
                                )}

                                {cartElements.length > 0 && (
                                    <div className="placeOrder">
                                        <div className="my-4">
                                            <button className="cartBtn">PLACE ORDER</button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
