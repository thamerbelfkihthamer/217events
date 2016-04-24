<?php

	$postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

	$nom           =$request->nom;
	$prenom        =$request->prenom;
	$fac           =$request->fac;
	$nom_formation =$request->nom_formation;
	$discreption   =utf8_encode($request->discreption);
	$image         =$request->image;
	$email         =$request->email;

	
	include("connect.php");

	$query = "INSERT INTO formateur VALUES (NULL , '$nom',  '$prenom',  '$fac',  '$nom_formation',  '$discreption',  '$image',  '$email', false)";

	mysqli_query($con,$query);