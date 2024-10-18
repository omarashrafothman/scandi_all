import React, { Component } from 'react';
import logo from "../../assets/images/logo.png";
import Cart from '../cart/Cart';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            cart: [],
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.fetchCategories();
        this.fetchCart();

    }

    fetchCategories = async () => {
        try {

            const query = `
                query GetCategories {
                    categories {
                        name
                    }
                }
            `;

            // طلب fetch لواجهة GraphQL API
            const response = await fetch('http://localhost/php_projects/scandiweb_store/backend/index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const result = await response.json();

            if (result.errors) {
                this.setState({ error: result.errors[0].message, loading: false });
            } else {
                this.setState({ categories: result.data.categories, loading: false });
            }
        } catch (err) {
            this.setState({ error: 'Failed to fetch categories', loading: false });
        }
    };

    fetchCart = async () => {

        try {

            const query = `
                query GetCart {
                    cart(id: 1) {
                        id


                        cartItems {

                        id
                        cart_id
                        sku_id
                        quantity
                        price
                        product {
                            id
                            name

                            prices{
                            amount
                            currency_symbol
                            }
                             attributes {
          name
          items {
            attribute_id
            display_value
            value
          }
        }
           galleries{
          image_url
        }
                        }
                        }
                    }
                }
            `;
            const response = await fetch('http://localhost/php_projects/scandiweb_store/backend/index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });
            const result = await response.json();


            if (result.errors) {
                this.setState({ error: result.errors[0].message, loading: false });
            } else {
                this.setState({ cart: result.data.cart.cartItems, loading: false });
            }

        }
        catch (err) {

            this.setState({ error: 'Failed to fetch cart', loading: false });
        }

    }






    render() {
        const { categories, loading, error } = this.state;
        const { items, params } = this.props;

        if (loading) return <p>Loading categories...</p>;
        if (error) return <p>Error: {error}</p>;

        return (
            <header>
                <nav className="navbar navbar-expand-lg ">
                    <div className="container">
                        <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
                            <ul className="m-0 d-flex align-items-center pt-3">
                                {categories.map((category) => (
                                    <li
                                        data-testid='category-link'
                                        className={params === category.name ? "nav-item active" : "nav-item"}
                                        key={category.name}
                                    >
                                        <a
                                            className="nav-link"
                                            aria-current="page"
                                            href={"/category/" + category.name}
                                            data-testid={params === category.name ? 'active-category-link' : 'category-link'}
                                        >
                                            {category.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <a className="navbar-brand" href={items[0].to}>
                                    <img src={logo} alt='logo' />
                                </a>
                            </div>
                            <div className='shoppingCart'>
                                <Cart cartElements={this.state.cart} />
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}

export default Header;
