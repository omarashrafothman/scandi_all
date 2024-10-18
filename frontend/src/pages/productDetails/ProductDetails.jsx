import React, { Component } from 'react';
import ImageSlider from '../../components/slider/ImageSlider';
class ProductDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: null,
            loading: true,
            error: null,
            sku_id: Number(window.location.pathname.split("/")[2]),
        };
    }

    componentDidMount() {


        this.fetchProductDetails();

    }

    fetchProductDetails = () => {
        const { sku_id } = this.state;



        if (sku_id) {

            const query = `
                query GetProductDetails {
                    product(sku_id: ${sku_id}) {
                        id
      name
      description
      galleries {
        image_url
      }
      prices {
        currency_symbol
        amount
      }
      attributes {
        name
        items{
        id
      value
        display_value
        }
      }
                       
                    }
                }
            `;

            fetch('http://localhost/php_projects/scandiweb_store/backend/index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    variables: {
                        sku_id: 1
                    },
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.errors) {
                        this.setState({ error: data.errors[0].message, loading: false });
                    } else {
                        this.setState({ product: data.data.product, loading: false });
                    }
                })
                .catch((error) => {
                    this.setState({ error: error.message, loading: false });
                });
        }
    };

    render() {
        const { product, loading, error } = this.state;

        if (loading) return <p>Loading...</p>;

        if (error) {
            return (
                <div>
                    <p>Error occurred:</p>
                    <p>{error}</p>
                </div>
            );
        }

        function addToCart() {


            fetch('http://localhost/php_projects/scandiweb_store/backend/index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
            mutation {
                addToCart(sku_id: 123) {
                    id
                  
                }
            }
        `,
                }),
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error('Error:', error));





        }

        return (
            <div>
                <div className='container'>
                    <div className='productDetails d-flex justify-content-around flex-wrap my-5'>
                        <div className='productDetailsGallery'>


                            <ImageSlider images={product.galleries} />

                        </div>
                        <div className='productDetailsContent'>
                            <h3>{product.name}</h3>


                            {
                                product.attributes.map((attrItem) => {
                                    let content;
                                    switch (attrItem.name) {
                                        case "Color":
                                            content = (
                                                <div className='productColors'>
                                                    <p>{attrItem.name}:</p>
                                                    <div className="d-flex align-items-center w-75 sizesContainer my-2" key={attrItem.id}>
                                                        {attrItem.items.map((colorItem) => (
                                                            <label className="containerBlock colorItem" style={{ background: colorItem.value }}>
                                                                <input type="radio" name="color" value={colorItem.value} />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                            break;

                                        default:
                                            content = (
                                                <div className="productSizes my-2" key={attrItem.id}>
                                                    <p>{attrItem.name}:</p>
                                                    {attrItem.items.map((item) => (
                                                        <label className="containerBlock my-1" key={item.id}>
                                                            <input type="radio" name={attrItem.name} value={item.value} />
                                                            <span className="checkmark">{item.display_value}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            );
                                            break;
                                    }

                                    return content;
                                })
                            }





                            <div className='productSizes'>
                                <p className=''>PRICE:</p>

                                <p className="priceNumber"> {product.prices[0].currency_symbol}{product.prices[0].amount}</p>

                            </div>
                            <div className='my-4' >
                                <button className='cartBtn' type='submit' onClick={addToCart}>ADD TO CART</button>
                            </div>
                            <div className='productDet' dangerouslySetInnerHTML={{ __html: product.description ? product.description.replaceAll('\\n', '<br />') : '' }} />



                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductDetails;
