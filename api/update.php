<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    include_once '../config/database.php';
    include_once '../class/produits.php';
    
    $database = new Database();
    $db = $database->getConnection();
    
    $item = new Produit($db);
    
    $data = json_decode(file_get_contents("php://input"));
    
    $item->id = $data->id;
    
    // employee values

    $item->title = $data->title;
    $item->description = $data->description;
    $item->price = $data->price;
    $item->copies = $data->copies;
    $item->image = $data->image;
    
    if($item->updateEmployee()){
        echo json_encode("Employee data updated.");
    } else{
        echo json_encode("Data could not be updated");
    }
?>