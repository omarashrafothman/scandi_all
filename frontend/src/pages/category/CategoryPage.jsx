import React, { Component } from 'react';
import ProductBox from '../../components/product/ProductBox';

// المكون CategoryPage
class CategoryPage extends Component {
    state = {
        categoryName: null, // لتخزين اسم الفئة
        products: [], // لتخزين المنتجات
        loading: true, // لتحديد حالة التحميل
        error: null // لتخزين رسالة الخطأ إذا حدثت
    };

    componentDidMount() {
        // استخراج اسم الفئة من رابط الـ URL
        const categoryName = window.location.pathname.split("/")[2];
        this.setState({ categoryName }, this.fetchProducts); // تحديث اسم الفئة وجلب المنتجات بناءً عليه
    }

    // دالة fetchProducts لجلب المنتجات من الـ API باستخدام fetch
    fetchProducts = async () => {
        try {
            // هذا هو استعلام GraphQL لجلب المنتجات مع الفئات
            const query = `
                query GetAllProductsWithCategories {
                    products {
                        id
                        name
                        in_stock
                        galleries {
                            image_url
                        }
                        description
                        category {
                            id
                            name
                        }
                        sku_id
                        prices {
                            amount
                            currency_label
                            currency_symbol
                        }
                    }
                }
            `;

            // استخدام fetch لإرسال الطلب إلى الـ API
            const response = await fetch('http://localhost/php_projects/scandiweb_store/backend/index.php', {
                method: 'POST', // إرسال طلب من نوع POST
                headers: {
                    'Content-Type': 'application/json', // إعداد نوع البيانات المُرسلة
                },
                body: JSON.stringify({ query }) // إرسال استعلام GraphQL كجسم الطلب
            });

            // تحويل الاستجابة إلى JSON
            const result = await response.json();

            // التحقق من وجود أخطاء في النتيجة
            if (result.errors) {
                // إذا حدث خطأ في الاستعلام، تخزين الخطأ في الحالة
                this.setState({ error: result.errors[0].message, loading: false });
            } else {
                // إذا نجح الاستعلام، تحديث المنتجات وإيقاف التحميل
                this.setState({ products: result.data.products, loading: false });
            }
        } catch (err) {
            // إذا فشل الطلب، تخزين رسالة الخطأ في الحالة
            this.setState({ error: 'Failed to fetch products', loading: false });
        }
    };

    render() {
        const { categoryName, products, loading, error } = this.state;

        // عرض حالة التحميل
        if (loading) {
            return <p>Loading...</p>;
        }

        // عرض حالة الخطأ
        if (error) {
            return <p>Error: {error}</p>;
        }

        // تصفية المنتجات بناءً على اسم الفئة
        let filteredProducts;
        if (categoryName === 'all') {
            filteredProducts = products; // عرض جميع المنتجات إذا كانت الفئة هي 'all'
        } else {
            filteredProducts = products.filter(product =>
                product.category.name === categoryName // تصفية المنتجات بناءً على الفئة
            );
        }

        return (
            <div className='categoryPage'>
                <div className='container py-5'>
                    <h2>{categoryName ? `${categoryName}` : 'Loading...'}</h2>

                    <div className='row'>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div className='col-12 col-lg-4' key={product.id}>
                                    <ProductBox
                                        name={product.name}
                                        image={product.galleries[0]?.image_url || 'default-image-url'}
                                        price={product.prices[0]["amount"]}
                                        id={product.sku_id}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No products found in this category.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default CategoryPage;
