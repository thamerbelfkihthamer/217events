<?php    
	
	include("connect.php");
	$query="select * from formateur where conferme = true";
	$res=mysqli_query($con,$query);
	$a = array();
	while ($row = mysqli_fetch_assoc($res)) {
		$num1query = "select * from visiteur where session =1 and formation = ".$row['id'];
		$num1res = mysqli_query($con,$num1query);
		$row['full1'] = mysqli_num_rows($num1res);
		$num2query = "select * from visiteur where session =2 and formation = ".$row['id'];
		$num2res = mysqli_query($con,$num2query);
		$row['full2'] = mysqli_num_rows($num2res);
		$a[] = array_map("utf8_encode", $row);
	}
	echo json_encode($a);
