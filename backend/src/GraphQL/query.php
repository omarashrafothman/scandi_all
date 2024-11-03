<?php
use App\Models\Category;
use App\Models\Product;
use App\Models\Cart;
use App\Models\CartItem;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$rootQuery = new ObjectType([
    "name" => "query",
    "fields" => [
        "categories" => [
            "type" => Type::listOf($categoryType),
            "resolve" => function () {
                return Category::with('products.attributes', 'products.galleries', 'products.prices')->get();
            },
        ],
        "category" => [
            "type" => $categoryType,
            "args" => [
                "id" => Type::id(),
            ],
            "resolve" => function ($root, $args) {
                return Category::with('products:attributes.attributesItems,galleries,prices')->find($args["id"]);
            },
        ],
        'products' => [
            'type' => Type::listOf($productType),
            'resolve' => function () {
                return Product::with(['category', 'attributes', 'prices'])
                    ->whereNotNull('sku_id')
                    ->get();
            },
        ],
        "product" => [
            "type" => $productType,
            "args" => [
                "sku_id" => Type::id(),
            ],
            "resolve" => function ($root, $args) {
                $skuId = intval($args["sku_id"]);
                if ($skuId <= 0) {
                    throw new \GraphQL\Error\Error('Invalid sku_id provided. sku_id must be a positive integer.');
                }

                return Product::with(['attributes', 'galleries', 'prices'])
                    ->where("sku_id", $skuId)
                    ->first();
            },
        ],

        "cart" => [
            "type" => $cartType,
            "args" => [
                "id" => Type::id(),
            ],
            "resolve" => function ($root, $args) {
                $id = intval($args["id"]);

                $cart = Cart::with(['cartItems.product'])->where("id", $id)->first();

                if (!$cart) {
                    throw new \GraphQL\Error\Error('Cart not found.');
                }

            
                return $cart;
            },
        ],

        "cartItems" => [
            "type" => Type::listOf($cartItemType),
            "resolve" => function ($root, $args) {
                return CartItem::with('product')->where("cart_id", $args["cart_id"])->get();
            },
        ],



    ],

]);

// "cart" => [
//     "type" => $cartType, 
//     "args" => [
//         "id" => Type::int(), 
//     ],
//     "resolve" => function ($root, $args) {
//         // جلب السلة حسب ID المحدد
//         $cart = Cart::with('cartItems')->find($args["id"]);

//         // تحقق مما إذا كانت السلة موجودة
//         if (!$cart) {
//             throw new \GraphQL\Error\Error('Cart not found.');
//         }

//         return $cart;
//     },
// ],

// "cartItems" => [
//     "type" => Type::listOf($cartItemType), // تأكد من تعريف $cartItemType بشكل صحيح
//     "args" => [
//         "cart_id" => Type::int(),
//     ],
//     "resolve" => function ($root, $args) {
//         // جلب عناصر السلة حسب cart_id المحدد
//         return CartItem::where("cart_id", $args["cart_id"])->get();
//     },
// ],
