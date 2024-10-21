<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Cart extends Model
{

    protected $fillable = ['total_price', 'created_at', 'updated_at'];

    protected $table = "carts";


    public $timestamps = false;

    //relationships
    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'cart_id');
    }
    public function order()
    {
        return $this->hasMany(Order::class, 'cart_id');
    }


}
