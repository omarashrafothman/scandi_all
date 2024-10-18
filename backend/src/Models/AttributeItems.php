<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class AttributeItems extends Model
{

    protected $fillable = ['attribute_id', 'display_value', 'value'];

    protected $table = "attribute_items";


    public $timestamps = false;


    public function items()
    {
        return $this->belongsTo(Attributes::class, 'attribute_id');
    }



}
