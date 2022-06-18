<?php
    class Produit{
        // Connection
        private $conn;
        // Table
        private $db_table = "produit";
        // Columns
        public $id;
        public $title;
        public $description;
        public $price;
        public $copies;
        public $image;
        // Db connection
        public function __construct($db){
            $this->conn = $db;
        }
        // GET ALL
        public function getEmployees(){
            $sqlQuery = "SELECT id, title, description, price, copies, image FROM " . $this->db_table . "";
            $stmt = $this->conn->prepare($sqlQuery);
            $stmt->execute();
            return $stmt;
        }
        // CREATE
        public function createEmployee(){
            $sqlQuery = "INSERT INTO
                        ". $this->db_table ."
                    SET
                        title = :title, 
                        description = :description, 
                        price = :price, 
                        copies = :copies, 
                        image = :image";
        
            $stmt = $this->conn->prepare($sqlQuery);
        
            // sanitize
            $this->title=htmlspecialchars(strip_tags($this->title));
            $this->description=htmlspecialchars(strip_tags($this->description));
            $this->price=htmlspecialchars(strip_tags($this->price));
            $this->copies=htmlspecialchars(strip_tags($this->copies));
            $this->image=htmlspecialchars(strip_tags($this->image));
        
            // bind data
            $stmt->bindParam(":title", $this->title);
            $stmt->bindParam(":description", $this->description);
            $stmt->bindParam(":price", $this->price);
            $stmt->bindParam(":copies", $this->copies);
            $stmt->bindParam(":image", $this->image);
        
            if($stmt->execute()){
               return true;
            }
            return false;
        }
        // READ single
        public function getSingleEmployee(){
            $sqlQuery = "SELECT
                        id, 
                        title, 
                        description, 
                        price, 
                        copies, 
                        image
                      FROM
                        ". $this->db_table ."
                    WHERE 
                       id = ?
                    LIMIT 0,1";
            $stmt = $this->conn->prepare($sqlQuery);
            $stmt->bindParam(1, $this->id);
            $stmt->execute();
            $dataRow = $stmt->fetch(PDO::FETCH_ASSOC);
            
            $this->title = $dataRow['title'];
            $this->description = $dataRow['description'];
            $this->price = $dataRow['price'];
            $this->copies = $dataRow['copies'];
            $this->image = $dataRow['image'];
        }        
        // UPDATE
        public function updateEmployee(){
            $sqlQuery = "UPDATE
                        ". $this->db_table ."
                    SET
                        title = :title, 
                        description = :description, 
                        price = :price, 
                        copies = :copies,
                        image = :image 
                    WHERE 
                        id = :id";
        
            $stmt = $this->conn->prepare($sqlQuery);
        
            $this->title=htmlspecialchars(strip_tags($this->title));
            $this->description=htmlspecialchars(strip_tags($this->description));
            $this->price=htmlspecialchars(strip_tags($this->price));
            $this->copies=htmlspecialchars(strip_tags($this->copies));
            $this->id=htmlspecialchars(strip_tags($this->id));
            $this->image=htmlspecialchars(strip_tags($this->image));
        
            // bind data
            $stmt->bindParam(":title", $this->title);
            $stmt->bindParam(":description", $this->description);
            $stmt->bindParam(":price", $this->price);
            $stmt->bindParam(":copies", $this->copies);
            $stmt->bindParam(":id", $this->id);
            $stmt->bindParam(":image", $this->image);
        
            if($stmt->execute()){
               return true;
            }
            return false;
        }
        // DELETE
        function deleteEmployee(){
            $sqlQuery = "DELETE FROM " . $this->db_table . " WHERE id = ?";
            $stmt = $this->conn->prepare($sqlQuery);
        
            $this->id=htmlspecialchars(strip_tags($this->id));
        
            $stmt->bindParam(1, $this->id);
        
            if($stmt->execute()){
                return true;
            }
            return false;
        }
    }
?>