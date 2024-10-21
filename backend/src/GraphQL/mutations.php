<?php
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;




$addToCartMutation = [
    'name' => 'addToCart',
    'type' => $cartType,
    'args' => [
        'sku_id' => Type::int(),
        'color' => Type::string(),
        'size' => Type::string(),
        'capacity' => Type::string(),
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

            $cartId = 1;
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
                    'price' => $price->amount,
                    'color' => $args['color'] ?? null,
                    'size' => $args['size'] ?? null,
                    'capacity' => $args['capacity'] ?? null,
                ]);
            }


            return $cart->load('cartItems');

        } catch (\Exception $e) {
            \Log::error('GraphQL error: ' . $e->getMessage());
            throw new \GraphQL\Error\Error('Failed to add item to cart: ' . $e->getMessage());
        }
    }
];

$removeFromCartMutation = [
    'name' => 'removeFromCart',
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

            $cartId = 1;
            $cart = Cart::find($cartId);

            if (!$cart) {
                throw new \GraphQL\Error\Error('Cart not found.');
            }


            $cartItem = CartItem::where('cart_id', $cartId)
                ->where('sku_id', $skuId)
                ->first();

            if (!$cartItem) {
                throw new \GraphQL\Error\Error('Cart item not found.');
            }


            $cartItem->delete();


            return $cart->load('cartItems');

        } catch (\Exception $e) {
            \Log::error('GraphQL error: ' . $e->getMessage());
            throw new \GraphQL\Error\Error('Failed to remove item from cart: ' . $e->getMessage());
        }
    }
];

$createOrder = [
    'name' => 'createOrder',
    'type' => Type::nonNull($orderType),
    'args' => [
        'cart_id' => Type::nonNull(Type::int()),
        'total_price' => Type::nonNull(Type::float()),
        'status' => Type::string(),
    ],
    'resolve' => function ($root, $args) {
        try {
            $cartId = $args['cart_id'];
            $totalPrice = $args['total_price'];
            $status = $args['status'] ?? 'Pending';

            // Check if the cart exists
            $cart = Cart::find($cartId);
            if (!$cart) {
                throw new \GraphQL\Error\Error('Cart not found.');
            }


            $order = Order::create([
                'cart_id' => $cartId,
                'total_price' => $totalPrice,
                'status' => $status,
                'created_at' => date('Y-m-d H:i:s'), // Use Carbon to get the current timestamp
            ]);
            $cart->cartItems()->delete();
            return $order; // Return the newly created order
    
        } catch (\Exception $e) {
            \Log::error('GraphQL error: ' . $e->getMessage());
            throw new \GraphQL\Error\Error('Failed to create order: ' . $e->getMessage());
        }
    }
];
$clearCart = [
    'name' => 'clearCart',
    'type' => Type::nonNull(Type::boolean()),
    'resolve' => function ($root, $args) {
        try {
            $cartId = 1;
            $cart = Cart::find($cartId);

            if (!$cart) {
                throw new \GraphQL\Error\Error('Cart not found.');
            }


            $cart->cartItems()->delete();

            return true;

        } catch (\Exception $e) {
            \Log::error('GraphQL error: ' . $e->getMessage());
            throw new \GraphQL\Error\Error('Failed to clear cart: ' . $e->getMessage());
        }
    }
];


$rootMutation = new ObjectType([
    'name' => 'Mutation',
    'fields' => [
        'addToCart' => $addToCartMutation,
        'removeFromCart' => $removeFromCartMutation,
        'createOrder' => $createOrder,
        'clearCart' => $clearCart

    ]
]);


