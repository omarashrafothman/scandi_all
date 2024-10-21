<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Order extends Model
{

    protected $fillable = ['cart_id', 'total_price', 'status', 'created_at', 'updated_at'];

    protected $table = "orders";


    public $timestamps = true;


    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cart_id');
    }




}
