import React, { Component } from 'react';
import ImageSlider from '../../components/slider/ImageSlider';
import { htmlToText } from 'html-to-text';
import { CartContext } from '../../context/CartContext';
import slugify from 'react-slugify';

class ProductDetails extends Component {
    static contextType = CartContext;

    constructor(props) {
        super(props);
        this.state = {
            product: null,
            loading: true,
            error: null,
            sku_id: Number(window.location.pathname.split("/")[2]),
            selectedAttributes: [],
        };
    }

    componentDidMount() {
        this.fetchProductDetails();
    }

    handleAddToCart = (skuId, color, size, capacity) => {
        this.context.addToCart(skuId, color, size, capacity);
    };

    fetchProductDetails = () => {
        const { sku_id } = this.state;

        if (sku_id) {
            const query = `
                query GetProductDetails {
                    product(sku_id: ${sku_id}) {
                        id
                        sku_id
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
                            items {
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
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.errors) {
                        this.setState({ error: data.errors[0].message, loading: false });
                    } else {
                        const productData = data.data.product;
                        const plainTextDescription = htmlToText(productData.description, {
                            wordwrap: 130,
                        });
                        const formattedDescription = plainTextDescription.replaceAll('\\n', '');
                        this.setState({
                            product: { ...productData, description: formattedDescription },
                            loading: false
                        });
                    }
                })
                .catch((error) => {
                    this.setState({ error: error.message, loading: false });
                });
        }
    };

    handleAttributeChange = (attributeName, value) => {
        this.setState((prevState) => ({
            selectedAttributes: {
                ...prevState.selectedAttributes,
                [attributeName]: value,
            },
        }));
    };

    render() {
        const { product, loading, error, selectedAttributes } = this.state;

        // تعيين قيمة افتراضية إذا لم تكن الخاصية موجودة
        const capacity = selectedAttributes['Capacity'] || null;
        const color = selectedAttributes['Color'] || null;
        const size = selectedAttributes['Size'] || null;





        if (loading) return <p>Loading...</p>;

        if (error) {
            return (
                <div>
                    <p>Error occurred:</p>
                    <p>{error}</p>
                </div>
            );
        }

        // تعديل شرط التفعيل بحيث يتأكد من وجود قيم للخصائص المتاحة فقط
        const addToCartDisabled = (product.attributes.some(attr => attr.name === 'Capacity') && !capacity) ||
            (product.attributes.some(attr => attr.name === 'Color') && !color) ||
            (product.attributes.some(attr => attr.name === 'Size') && !size);

        return (
            <div>
                <div className='container'>
                    <div className='productDetails d-flex justify-content-around flex-wrap my-5'>
                        <div className='productDetailsGallery' data-testid='product-gallery'>
                            <ImageSlider images={product.galleries} />
                        </div>
                        <div className='productDetailsContent'>
                            <h3>{product.name}</h3>

                            {product.attributes.map((attrItem) => {
                                let content;
                                switch (attrItem.name) {
                                    case "Color":
                                        content = (
                                            <div className='productColors' key={attrItem.id} data-testid={`product-attribute-${slugify(attrItem.name)}`}>
                                                <p>{attrItem.name}:</p>
                                                <div className="d-flex align-items-center w-75 sizesContainer my-2">
                                                    {attrItem.items.map((colorItem) => (
                                                        <label
                                                            className="containerBlock colorItem"
                                                            style={{ background: colorItem.value }}
                                                            key={colorItem.id}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={attrItem.name}
                                                                value={colorItem.value}
                                                                onChange={() => this.handleAttributeChange(attrItem.name, colorItem.value)}
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
                                            <div className="productSizes my-2" key={attrItem.id} data-testid={`product-attribute-${slugify(attrItem.name)}`}>
                                                <p>{attrItem.name}:</p>
                                                {attrItem.items.map((item) => (
                                                    <label className="containerBlock my-1" key={item.id}>
                                                        <input
                                                            type="radio"
                                                            name={attrItem.name}
                                                            value={item.value}
                                                            onChange={() => this.handleAttributeChange(attrItem.name, item.value)}
                                                        />
                                                        <span className="checkmark">{item.display_value}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        );
                                        break;
                                }
                                return content;
                            })}

                            <div className='productSizes'>
                                <p>PRICE:</p>
                                <p className="priceNumber">
                                    {product.prices[0].currency_symbol}{product.prices[0].amount}
                                </p>
                            </div>

                            <div className='my-4'>


                                <button
                                    className='cartBtn'
                                    type='submit'
                                    data-testid='add-to-cart'
                                    onClick={() => this.handleAddToCart(product.sku_id, color, size, capacity)}
                                    disabled={addToCartDisabled}
                                >
                                    ADD TO CART
                                </button>
                            </div>

                            <div className='productDet' data-testid='product-description'>
                                {product.description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductDetails;
