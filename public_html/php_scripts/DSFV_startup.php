<?php
    header("Content-Type: application/json; charset=UTF-8");
    $obj = json_decode($_GET["x"], false);
    
    $con = mysqli_connect('localhost:3306','eupol_wjones','DSFV@2018','eupolloc_dsfv');
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }
    
    mysqli_select_db($con,"eupolloc_dsfv");
    $sql="SELECT * FROM t_dsfv_settings_resolution";
    $result = mysqli_query($con,$sql);
    $outp = array();
    $outp = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($outp);
?>