<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Prices extends Model
{

    protected $fillable = ['product_id', 'amount', 'currency_label', 'currency_symbol'];

    protected $table = "prices";


    public $timestamps = false;


    public function product()
    {
        return $this->belongsTo(Product::class, 'sku_id');
    }



}
