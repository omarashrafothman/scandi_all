<?php
class ProductController
{
    private $database;
    private $conn;

    public function __construct()
    {
        $this->database = new Database();
        $this->conn = $this->database->getConnection();
    }



    // Method to get all cart items for a user
    public function getCartItems($user_id)
    {
        return $this->database->getCartItems($user_id);
    }

    // Method to add a product to the cart
    public function addToCart($product_id, $user_id, $quantity = 1)
    {
        return $this->database->addToCart($product_id, $user_id, $quantity);
    }

    // Method to update the quantity of a cart item
    public function updateCartItem($cart_id, $quantity)
    {
        return $this->database->updateCartItem($cart_id, $quantity);
    }

    // Method to remove an item from the cart
    public function removeFromCart($cart_id)
    {
        return $this->database->removeFromCart($cart_id);
    }
}