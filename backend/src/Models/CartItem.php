<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $table = "cart_items";
    protected $fillable = ['cart_id', 'sku_id', 'quantity', 'price'];

    public $timestamps = false;

    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cart_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'sku_id');
    }
}
