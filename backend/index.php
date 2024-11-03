<?php



// Allow from any origin
header("Access-Control-Allow-Origin: *");

// Allow specific HTTP methods
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");


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
    'host' => 'sql102.infinityfree.com',
    'database' => 'if0_37568504_scandiweb',
    'username' => 'if0_37568504',
    'password' => 'zyNziuCAoD6G',
    'charset' => 'latin1',
    'collation' => 'latin1_swedish_ci',
    'prefix' => '',
]);




$capsule->setAsGlobal();


$capsule->bootEloquent();

require("src/GraphQL/boot.php");

