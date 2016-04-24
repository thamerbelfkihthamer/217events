<?php

	$postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

	$nom           =$request->nom;
	$prenom        =$request->prenom;
	$email         =$request->email;
	$formation     =$request->formation;

	if (isset($request->session)) {
	$session = $request->session;
	} 
	else {$session =1;}
	
	include("connect.php");

	$numquery = "select * from visiteur where email='".$email."' and (session= ".$session." or formation=".$formation.")";
	$numres = mysqli_query($con,$numquery);

	
	$num1query = "select * from visiteur where session= ".$session." and formation=".$formation."";
	$num1res = mysqli_query($con,$num1query);
	

     if(mysqli_num_rows($numres) <1 && mysqli_num_rows($num1res ) <7  )
	{
	    
		$query1 = "INSERT INTO visiteur VALUES (NULL , '$nom',  '$prenom',  '$email',  $formation,  $session)";

		if (mysqli_query($con,$query1)) {echo  "yes";}
		
		

		$to      = $email;
		$subject = 'the subject';
		$message = 'Merci, tu as pris ta place. On va vous envoyer votre billet dans quelques jours (sur cette adresse mail)';
		$headers = 'From: webmaster@217event.net' . "\r\n" .
		'Reply-To: webmaster@217event.net' . "\r\n" .
		'X-Mailer: PHP/' . phpversion();


	}else if(mysqli_num_rows($numres) >=1) {
		echo "non1";
	}else{
		echo "non2";
	}


	

mail($to, $subject, $message, $headers);