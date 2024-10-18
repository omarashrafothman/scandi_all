<?php

require("types.php");
require("query.php");
require("mutations.php");

use GraphQL\GraphQL;
use GraphQL\Type\Schema;

$schema = new Schema([
    "query" => $rootQuery,
    "mutation" => null
]);

try {
    $rawInput = file_get_contents("php://input");
    $input = json_decode($rawInput, true);

    if (isset($input['query'])) {
        $query = $input['query'];

        $result = GraphQL::executeQuery($schema, $query);

        $output = $result->toArray();
    } else {
        throw new Exception("No query provided.");
    }

} catch (Exception $e) {
    $output = [
        'error' => [
            'message' => $e->getMessage()
        ]
    ];
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

echo json_encode($output);