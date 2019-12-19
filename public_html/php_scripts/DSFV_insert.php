<?php
/*
	header("Content-Type: application/json; charset=UTF-8");
	$obj = json_decode($_GET["x"], false);
	
	$con = mysqli_connect('localhost:3306','eupol_wjones','DSFV@2018','eupolloc_dsfv');
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }
    
    mysqli_select_db($con,"eupolloc_dsfv");
	$sql="INSERT INTO `t_dsfv_rundata`(`xMin`, `xMax`, `yMin`, `yMax`, `equation`, `widthResolution`, `heightResolution`, `negativeColor`, `zeroColor`, `positiveColor`, `renderDateTime`)
								VALUES (".$obj->xMin. "," .$obj->xMax. "," .$obj->yMin. "," .$obj->yMax. ",'" .$obj->equation. "'," .$obj->resWidth. "," .$obj->resHeight.",'".$obj->negColor. "','" .$obj->zeroColor. "','" .$obj->posColor. "',NOW())";
	mysqli_query($con,$sql);
	
	//echo $sql;
	//echo json_encode($sql);
	*/

    header("Content-Type: application/json; charset=UTF-8");
    $obj = json_decode($_GET["x"], false);

    $servername = "localhost:3306";
    $username = "eupol_wjones";
    $password = "DSFV@2018";
    $dbname = "eupolloc_dsfv";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql="INSERT INTO `t_dsfv_rundata`(`xMin`, `xMax`, `yMin`, `yMax`, `equation`, `widthResolution`, `heightResolution`, `negativeColor`, `zeroColor`, `positiveColor`, `renderDateTime`)
								VALUES (".$obj->xMin. "," .$obj->xMax. "," .$obj->yMin. "," .$obj->yMax. ",'" .$obj->equation. "'," .$obj->resWidth. "," .$obj->resHeight.",'".$obj->negColor. "','" .$obj->zeroColor. "','" .$obj->posColor. "',NOW())";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
?>