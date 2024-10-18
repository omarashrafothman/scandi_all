<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Attributes extends Model
{

    protected $fillable = ['sku_id', 'name', 'type'];

    protected $table = "attributes";


    public $timestamps = false;


    public function product()
    {
        return $this->belongsTo(Product::class, 'attribute_id');
    }

    public function items()
    {
        return $this->hasMany(AttributeItems::class, 'attribute_id');
    }


}
