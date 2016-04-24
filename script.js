
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function validateEmail(email) { 
  // http://stackoverflow.com/a/46181/11236
  
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


var app = angular.module("app",[]);
randomBool = false;
tmpm = [];

app.filter("utf8",function(){
	return function(e){
		e.replace("ÃƒÂ§","ç");
		e.replace("ÃƒÂ©","é");
		e.replace("ÃƒÂ¨","è");
		e.replace("ÃƒÂ","à");
		return e;
	};
});

app.filter("random",function(){
	return function(s){
		var m=[];
		for(x in s){
			s[x].indexi = x;
			m.push(s[x]);
		}
		if(randomBool){
			console.log(m);
			m = shuffle(m);
			for(t in m) {
				if(m[t].nom_formation=="P vs NP"){ 
					aux = m[t];
					m[t] = m[2];
					m[2] = aux; 
				}
			}
			tmpm = m;
			randomBool = false;
			return m;
		}else{
			return tmpm;
		}
		
	};
});
app.controller("ctrl",function($scope,$http){
	
	$http.get("./showformateurs.php").success(function(data){
		$scope.formateurs = data;
		formateura = window.location.hash.substr(1);
				nom_formateur = formateura.substr(0,formateura.indexOf("_"));
				prenom_formateur = formateura.substr(formateura.indexOf("_")+1);

				nom_formateur = nom_formateur.replace("-"," ");
				prenom_formateur = prenom_formateur.replace("-"," ");

				console.log(nom_formateur+"***"+prenom_formateur);
				var formateur = null;
				for(t in data){
					if((data[t].nom.toLowerCase() == prenom_formateur.toLowerCase() &&
					 data[t].prenom.toLowerCase() == nom_formateur.toLowerCase()) || (
					 	data[t].nom.toLowerCase() == nom_formateur.toLowerCase() &&
					 data[t].prenom.toLowerCase() == prenom_formateur.toLowerCase()
					 )) {
						formateur = data[t];
						indexoff=$scope.formateurs.indexOf(formateur)+1;
					}
				}
				console.log(formateur);
				if(formateur!=null){
						console.log("scrolling down..");
						console.log("showing trainer");
						$scope.showFormf(formateur,indexoff);
					
						
				}else{
					$scope.search=formateura;
				}
		randomBool = true;
	}).error(function(){
		setTimeout(function(){
				$http.get("./showformateurs.php").success(function(data){
				$scope.formateurs = data;

				

			});
		},1000)
	});

	

	$scope.showForm = $scope.inscrireDisplay = "none";
	$scope.videoShow = "none";
	$scope.bydisplay = "1";
	$scope.alertShow = "none";

	$scope.alertMessage = ""

	$scope.nom = "";
	$scope.prenom= "";
	$scope.fac= "";
	$scope.nom_formation= "";
	$scope.discreption = "";
	$scope.image= "";
	$scope.email= "";

	$scope.bsnom = "";
	$scope.bsprenom = "";
	$scope.bsfac = "";
	$scope.bsnomformation = "";
	$scope.bsdiscreption = "";
	$scope.bsimage = "";
	$scope.bsemail = "";

	$scope.add = function(){
		if( $scope.nom.length>0 &&
			$scope.prenom.length>0 &&
			$scope.fac.length>0 &&
			$scope.nom_formation.length>0 &&
			$scope.discreption.length>0 &&
			$scope.image.length>0 &&
			validateEmail($scope.email) 

			){
			$http.post("./addformateur.php",{
				"nom":$scope.nom,
				"prenom":$scope.prenom,
				"fac":$scope.fac,
				"nom_formation":$scope.nom_formation,
				"discreption":$scope.discreption,
				"image":$scope.image,
				"email":$scope.email
			}).success(function(data){
				$scope.nom="";
				$scope.prenom="";
				$scope.fac="";
				$scope.nom_formation="";
				$scope.discreption="";
				$scope.image="";
				$scope.email="";
				$scope.inscrireDisplay = "none";
				swal("Merci!", "Vérifiez votre email dans quelques jours!", "success")
			});
		}else{
			$scope.bsnom=($scope.nom.length==0)?"0 0 10px red":"";
			$scope.bsprenom=($scope.prenom.length==0)?"0 0 10px red":"";
			$scope.bsfac=($scope.fac.length==0)?"0 0 10px red":"";
			$scope.bsnomformation=($scope.nom_formation.length==0)?"0 0 10px red":"";
			$scope.bsdiscreption=($scope.discreption.length==0)?"0 0 10px red":"";
			$scope.bsimage=($scope.image.length==0)?"0 0 10px red":"";
			$scope.bsemail=($scope.email.length==0)?"0 0 10px red":"";
		}
	}
	$scope.selectedFormation = 1;
	$scope.addVisiteur = function(){
		console.log("....  "+document.getElementById("ss").value);
		if( $scope.nom.length>0 &&
			$scope.prenom.length>0 &&
			validateEmail($scope.email)
			){
			$http.post("./addvisiteur.php",{
				"nom":$scope.nom,
				"prenom":$scope.prenom,
				"email":$scope.email,
				"formation":$scope.selectedFormation,
				"session":document.getElementById("ss").value
			}).success(function(data){
				console.log(data);
				if(data=="non1"){
					$scope.showForm = "none";
					swal("Ooops..", "Vous avez déjà pris votre place dans ce workshop ou session!", "error")
					
				}else if(data =="non2"){
					$scope.showForm = "none";
					swal("Ooops..", "il n'y a pas plus de place!", "error")
					
				}else{
					$scope.showForm = "none";
					swal("Merci!", "Vérifiez votre email dans quelques jours!", "success")
				}
			}).error(function(){
				$scope.showForm = "none";
				swal("Ooops..", "", "error")
			});
		}else{
			$scope.bsnom=($scope.nom.length==0)?"0 0 10px red":"";
			$scope.bsprenom=($scope.prenom.length==0)?"0 0 10px red":"";
			$scope.bsemail=(validateEmail($scope.email) == false)?"0 0 10px red":"";
		}
	}

	$scope.top1="0px";
	$scope.top2="100%";
	$scope.barrey="0px";
	$scope.fopacity = 0;
	$scope.showformateurs = function(){
		$scope.top1="-100%";
		$scope.top2="0px";
		$scope.mleftleft="-100%";
		$scope.mleftright="200%";
		$scope.opacity=0;
		$scope.bydisplay = "0";
		$scope.barrey="50px";
		$scope.rightof = "-1027.10027100px";
		$scope.rotate = "rotate(-73deg)";
		$scope.rightwhats = "-20px";
		$scope.transwhats = "1.2";
		$scope.bottomwhats = "100px";
		$scope.fopacity = 1;
	}

	$scope.top = function(){
		$scope.top1="0px";
		$scope.top2="100%";
		$scope.mleftleft="0";
		$scope.mleftright="135px";
		$scope.opacity=1;
		$scope.bydisplay = "1";
		$scope.barrey="0px";
		$scope.fopacity = 0;
	}

	$scope.showVideo = function(){
		$scope.videoShow = "block";
	}

	$scope.closeform = function(){
		$scope.inscrireDisplay = "none";
		$scope.showForm = "none";
		$scope.videoShow = "none";
		$scope.alertShow = "none";
	}

	$scope.showInscreption = function(){
		$scope.inscrireDisplay = "block";
	}

	$scope.bsfull = "block";
	$scope.bsfull2 = "none";
	$scope.showFormf = function(i,index){
		console.log(i);
		$scope.selectedFormation = i.id;
		$scope.formateurindex = index;
		$scope.formateurimage = i.image;
		$scope.formateurnom = i.nom;
		$scope.formateurprenom = i.prenom;
		$scope.formateurnomformation= i.nom_formation;
		$scope.bsfull= (i.full1<2 || i.full2<2 )?"block":"none";
		$scope.bsfull2= (i.full1<2 || i.full2<2)?"none":"block";
		if(i.full1>=2){
			document.getElementById("opt1").disabled=true;

			document.getElementById("opt2").selected=true;
		}else{
			document.getElementById("opt1").disabled=false;
		}
		if(i.full2>=2){
			document.getElementById("opt2").disabled=true;
			document.getElementById("opt1").selected=true;
		}else{
			document.getElementById("opt2").disabled=false;
		} 
		$scope.showForm = "block";
		$scope.formateurdiscreption = i.discreption;
		console.log("mlkmlkml");
	}

	$scope.rightof = "-100%";
	$scope.opacitywhats = 0;
	$scope.showDesc = function(){
		if($scope.rightof!="0px") {
			$scope.rightof = "0px";
			$scope.rotate = "rotate(-0deg)";
		}
		else {
			$scope.rightof = "-100%";
			$scope.rotate = "rotate(-73deg)";
		}
	}


	$scope.shadowopacity = 0;
	

	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var firstDate = Date.now();
	var secondDate = new Date(2015,01,18);

	var diffDays = Math.round(Math.abs((firstDate - secondDate.getTime())/(oneDay))) - 30;
	$scope.days = (diffDays>=10)?diffDays:"0"+diffDays;

	if(window.location.hash.substr(1).length!=0){
		$scope.showformateurs();
	}

});






$(".shadow").css("display","none");
showShadow = function(){
	if($(".holder").scrollTop() > 1){
		$(".shadow").css("opacity","0.2");
		$(".shadow").css("display","block");
	}else{
		$(".shadow").css("display","none");
		$(".shadow").css("opacity","0");
	}
}



$("body").children().each(function(i,c){
		c.style.transition = "all 1s";
		c.style.opacity = 0;
});

$(".loading").css("opacity","1");

$(window).load(function(){
	$(".loading").css("opacity","0");
	setTimeout(function(){
		if(document.getElementById("ss").options[0].innerHTML != "1"){
			document.getElementById("ss").options[0].outerHTML = ""; 
		}

		$("body").children().each(function(i,c){
			c.style.opacity = 1;
		});
		$(".loading").css("display","none");

		


		$("#ctr").css("visibility","hidden");
      	/*
        if (!$.browser.webkit) {
              $('.holder').jScrollPane();
              $('.holder2').jScrollPane();
          }
        */
	},1000);
});

