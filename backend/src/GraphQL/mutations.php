<?php
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
// include("types.php");



$addToCartMutation = [
    'name' => 'addToCart',
    'type' => $cartType,
    'args' => [
        'sku_id' => Type::int(),
    ],
    'resolve' => function ($root, $args) {
        try {
            $skuId = intval($args['sku_id']);

            if ($skuId <= 0) {
                throw new \GraphQL\Error\Error('Invalid sku_id provided.');
            }

            $product = Product::where('sku_id', $skuId)->first();
            if (!$product) {
                throw new \GraphQL\Error\Error('Product not found.');
            }

            $price = $product->prices()->first();
            if (!$price) {
                throw new \GraphQL\Error\Error('Price not found for the product.');
            }

            $cartId = 1; // Make sure to manage the cart ID dynamically if needed
            $cart = Cart::find($cartId);

            if (!$cart) {
                throw new \GraphQL\Error\Error('Cart not found.');
            }

            $cartItem = CartItem::where('cart_id', $cartId)
                ->where('sku_id', $skuId)
                ->first();

            if ($cartItem) {
                $cartItem->quantity += 1;
                $cartItem->save();
            } else {
                CartItem::create([
                    'cart_id' => $cartId,
                    'sku_id' => $skuId,
                    'quantity' => 1,
                    'price' => $price->amount, // Add price here
                ]);
            }

            // Reload the cart data with items
            return $cart->load('cartItems');

        } catch (\Exception $e) {
            \Log::error('GraphQL error: ' . $e->getMessage());
            throw new \GraphQL\Error\Error('Failed to add item to cart: ' . $e->getMessage());
        }
    }
];



$rootMutation = new ObjectType([
    'name' => 'Mutation',
    'fields' => [
        'addToCart' => $addToCartMutation,

    ]
]);


