<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Product extends Model
{

    protected $fillable = ['id', 'name', 'in_stock', 'description', 'category_id', 'brand'];

    protected $table = "products";


    public $timestamps = false;

    //relationships


    protected $primaryKey = 'sku_id'; // تحديد الـ primary key

    // علاقة مع الـ Attributes
    public function attributes()
    {
        return $this->hasMany(Attributes::class, 'sku_id');
    }


    // علاقة مع الـ Prices
    public function prices()
    {
        return $this->hasMany(Prices::class, 'product_id');
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function galleries()
    {
        return $this->hasMany(Gallery::class, 'sku_id');
    }

    public function attributesItems()
    {
        $attributes = $this->attributes()->with('attributesItems')->get();

        $items = [];

        foreach ($attributes as $attribute) {
            $items[$attribute->id] = $attribute->attributesItems;
        }

        return $items;
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'sku_id');
    }

}
