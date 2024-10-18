<?php
// use App\Models\Cart;
// use App\Models\CartItem;
// use GraphQL\Type\Definition\ObjectType;
// use GraphQL\Type\Definition\Type;
// require("types.php");

/*

$addToCartMutation = [
    'name' => 'addToCart',
    'type' => $cartType,
    'args' => [
        'sku_id' => Type::int(),
    ],
    'resolve' => function ($root, $args) {

        $skuId = intval($args['sku_id']);
        if ($skuId <= 0) {
            throw new \GraphQL\Error\Error('Invalid sku_id provided.');
        }


        $sessionId = session_id();
        if (empty($sessionId)) {
            session_start();
            $sessionId = session_id();
        }


        $cart = Cart::firstOrCreate(['session_id' => $sessionId]);


        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('sku_id', $skuId)
            ->first();


        if ($cartItem) {

        } else {

            CartItem::create([
                'cart_id' => $cart->id,
                'sku_id' => $skuId,
                'quantity' => 1,

            ]);
        }


        return $cart->load('cart_items');
    },
];


$rootMutation = new ObjectType([
    'name' => 'Mutation',
    'fields' => [
        'addToCart' => $addToCartMutation,

    ]
]);

*/
