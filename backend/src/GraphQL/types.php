<?php
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;


$attributeItemType = new ObjectType([
    'name' => 'AttributeItem',
    'fields' => [
        'id' => Type::int(),
        'attribute_id' => Type::id(),
        'display_value' => Type::string(),
        'value' => Type::string(),
    ],
]);



$attributeType = new ObjectType([
    'name' => 'Attribute',
    'fields' => function () use (&$attributeItemType) {
        return [
            'id' => Type::id(),
            'name' => Type::string(),
            'sku_id' => Type::int(),
            'type' => Type::string(),
            'items' => [
                'type' => Type::listOf($attributeItemType),
                'resolve' => function ($attribute) {
                    return $attribute->items; // جلب items لكل attribute
                }
            ],
        ];
    },
]);





$galleryType = new ObjectType([
    'name' => 'Gallery',
    'fields' => [
        'sku_id' => Type::id(),
        'image_url' => Type::string(),
    ],
]);
$pricesType = new ObjectType([
    'name' => 'prices',
    'fields' => [
        'product_id' => Type::id(),
        'amount' => Type::string(),
        'currency_label' => Type::string(),
        'currency_symbol' => Type::string()
    ],
]);

$categoryType = new ObjectType([
    'name' => 'Category',
    'fields' => function () use (&$productType) { // استخدام دالة لتهيئة الحقول
        return [
            'id' => Type::id(),
            'name' => Type::string(),
            'products' => Type::listOf($productType),
        ];
    },
]);



$productType = new ObjectType([
    'name' => 'Product',
    'fields' => function () use (&$categoryType, &$attributeType, &$galleryType, &$pricesType) {
        return [
            'sku_id' => Type::int(),
            'id' => Type::string(),
            'name' => Type::string(),
            'prices' => Type::listOf($pricesType),
            'description' => Type::string(),

            'attributes' => [
                'type' => Type::listOf($attributeType),
                'resolve' => function ($product) {
                    return $product->attributes; // جلب attributes مع product
                }
            ],
            'galleries' => Type::listOf($galleryType),
            'in_stock' => Type::boolean(),
            'category' => $categoryType,
        ];
    }
]);






$cartItemType = new ObjectType([
    'name' => 'CartItem',
    'fields' => function () use (&$productType) {
        return [
            'id' => Type::id(),
            'cart_id' => Type::id(),
            'sku_id' => Type::id(), // Use Type::id() for better type consistency
            'quantity' => Type::int(),
            'price' => Type::float(),
            'product' => [
                'type' => $productType,
                'resolve' => function ($cartItem) {
                    return $cartItem->product;
                }
            ],
        ];
    },
]);







$cartType = new ObjectType([
    'name' => 'Cart',
    'fields' => [
        'id' => Type::id(),
        'cartItems' => Type::listOf($cartItemType),
        'created_at' => Type::string(),
        'updated_at' => Type::string(),
        "total_price" => [
            "type" => Type::float(),
            "resolve" => function ($cart) {
                return $cart->cartItems->sum(function ($cartItem) {
                    return $cartItem->product->price->amount * $cartItem->quantity;
                });
            },
        ],
    ],
]);


// $cartType = new ObjectType([
//     'name' => 'Cart',
//     'fields' => function () use (&$cartItemType) {
//         return [
//             'id' => Type::int(),
//             'total_price' => Type::string(),
//             'session_id' => Type::string(),
//             'created_at' => Type::string(),
//             'updated_at' => Type::string(),
//             'cart_items' => [
//                 'type' => Type::listOf($cartItemType),
//                 'resolve' => function ($cart) {
//                     return $cart->cart_items;
//                 }
//             ],
//         ];
//     },
// ]);
