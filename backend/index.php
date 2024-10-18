<?php



// Allow from any origin
header("Access-Control-Allow-Origin: *");

// Allow specific HTTP methods
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests (OPTIONS)
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     echo 'options request';
//     // End the script for preflight requests
// }

// Your existing PHP logic for handling requests
// For example:
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Example response
    echo json_encode(["message" => "Hello from PHP!"]);
}





// namespace App\Models;

include("./vendor/autoload.php");

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;

$capsule->addConnection([
    'driver' => 'mysql',
    'host' => 'localhost',
    'database' => 'scandiweb_db',
    'username' => 'root',
    'password' => 'root*',
    'charset' => 'utf8',
    'collation' => 'utf8_general_ci',
    'prefix' => '',
]);


// Make this Capsule instance available globally via static methods... (optional)
$capsule->setAsGlobal();

// Setup the Eloquent ORM... (optional; unless you've used setEventDispatcher())
$capsule->bootEloquent();

require("src/GraphQL/boot.php");
// $cat = Category::find(2);
// var_dump($cat->products->toArray());