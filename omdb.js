var jsonObj;
var jsonObj2;
var index = 1;

document.addEventListener("keyup", function(event) {
    if (event.code === 'Enter') {
       
			index = 1;
       mainSearch(index);
       document.activeElement.blur();
    }
});

document.getElementById('mySearch').addEventListener('click', function(){
	
	index = 1;
	document.activeElement.blur();
	
	mainSearch(index);
	
});

$(document).ready(function() {
	
	$(window).scroll(function() {
		
		if ($(this).scrollTop() > 20) {
			
			$('#toTopBtn').fadeIn();

		} else {
			
			$('#toTopBtn').fadeOut();
		}
	});

	$('#toTopBtn').click(function() {

		$("html, body").animate({
		
			scrollTop: 0

		}, 1000);
	
	return false;
	
	});
});

function mainSearch() {
	
	var x = document.getElementById("hide");
    x.style.display = "none";
    var y = document.getElementById("results");
    y.style.display = "none";
		
	document.getElementById('footer').innerHTML = "";

	var movie = document.getElementById("myInput").value;
	
	

	var url = 'http://www.omdbapi.com/?s='+movie+'&page='+index+'&apikey=b823da4c';
	var xmlhttp = new XMLHttpRequest();

	document.getElementById('content').innerHTML = "";

	if (movie == null || movie == "") {

		document.getElementById("myInput").placeholder = "Please enter at least one character";

		document.getElementById("myInput").classList.add('input-placeholder-false');
		document.getElementById("myInput").style.border = "2px solid";
		document.getElementById("myInput").style.borderColor = "red";

	} else {

		sessionStorage.setItem('movie', document.getElementById("myInput").value);

		document.getElementById("myInput").classList.remove('input-placeholder-false');
		document.getElementById("myInput").style.border = "none";
		document.getElementById("myInput").placeholder = "Please enter the name of your movie or TV show here...";

		document.getElementById("myInput").value = "";

		xmlhttp.open("GET", url, true);
		xmlhttp.send();

		xmlhttp.onreadystatechange = function() {

		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

				var x = document.getElementById("hide");
        		x.style.display = "";

        		x.innerHTML = "<h1>No Results Found</h1>";

        		var y = document.getElementById("footer");
        		footer.innerHTML = "";

			jsonObj = JSON.parse(xmlhttp.responseText);

			mainResults(jsonObj);

			}
		}
	}
}

function movieSearch(movie) {

	var title = movie;

	var url = "http://www.omdbapi.com/?i="+title+"&apikey=b823da4c";
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.open("GET", url, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange = function() {

		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

			jsonObj2 = JSON.parse(xmlhttp.responseText);

			//console.log(xmlhttp.responseText);

			showMovie(jsonObj2);
		}
	}
}


function mainResults(jsonObj) {

	var data = jsonObj;
	var endRow = '</div>';
	var list = '<div class="row d-flex justify-content-center">';
	var totalPages = data.totalResults / 10;

	totalPages = Math.ceil(totalPages);

	var x = document.getElementById("hide");
    x.style.display = "";

	for(var i = 0; i < data.Search.length; i++) {

		list += '<div class="col-md-4 text-center results"><h3>' + data.Search[i].Title + '</h3>';
		list += '<ul class="movielist">';
		list += '<li><b>Year:</b> ' + data.Search[i].Year + '</li>';
		list += '<li><b>Type:</b> ' + data.Search[i].Type + '</li>';
		list += '</ul>';

		if(data.Search[i].Poster !== "N/A") {

			list += '<img class="thumbnail" src='+data.Search[i].Poster+'</img></br>';
			list += '<button type="button" class="btn btn-success">More</button>' + endRow;

		} else {

			list += '<img class="thumbnail" src="images/generic.png"</img></br>';
			list += '</br><button type="button" class="btn btn-success">More</button>' + endRow;
		}
	}
	
	document.getElementById("hide").innerHTML = list + endRow;

	if(index == 1 && totalPages == 1) {

		document.getElementById('footer').innerHTML = "";
	
	} else {

		footer(totalPages);
	}
	

	var buttons = document.getElementsByClassName("btn-success");
	
	for(var i = 0; i < buttons.length; i++) {

		buttons[i].addEventListener("click", function(i) {

			document.getElementById("results").style.display = "";

			var movie = data.Search[i].imdbID;

			//console.log(movie);

			movieSearch(movie);
        	
			$('html, body').animate({
  			scrollTop: $("#results").offset().top
			});

		}.bind(null, i));
	}
}


function footer(totaPages) {

	var more = document.getElementById("footer");
	var endRow = '</div>';
	var pages = totaPages;

	console.log(index);

	var list = '<div class="col-md-4 text-center">';
	list += '<a href="#" id="continue">Page ' + index +  ' of ' + pages + '</a>' + endRow;
	list += '<div class="col-md-4 text-center">';
	list += '<a href="#" id="last">Last</a>' + endRow;

	more.innerHTML = list;

	goForward(pages);

	if(index > 1) {

		list = '<div class="col-md-4 text-center">';
		list += '<a href="#" id="prev">Prev </a>' + endRow;
		list += '<div class="col-md-4 text-center">';
		list += '<a href="#" id="continue">Page ' + index +  ' of ' + pages + '</a>' + endRow;
		list += '<div class="col-md-4 text-center">';
		list += '<a href="#" id="last">Last</a>' + endRow;

		more.innerHTML = list;

		//console.log(more.innerHTML);

		goBack();

		goForward(pages);
	}

	var keepGoing = document.getElementById("continue");

	keepGoing.addEventListener("click", function() {

		
		if(index < pages) {

			index += 1;
		}

		if(sessionStorage.getItem('movie', document.getElementById('myInput').value) !== null) {

			document.getElementById("myInput").value = sessionStorage.getItem('movie');

		}	

		mainSearch(index);
	});

	if(index >= pages) {

		list = '<div class="col-md-6 text-center">';
		list += '<a href="#" id="prev">Prev </a>' + endRow;
		list += '<div class="col-md-6 text-center">';
		list += '<a href="#" id="first">First Page</a>' + endRow;
		list += endRow;

		more.innerHTML = list;

		//console.log(more.innerHTML);

		goBack();

		var first = document.getElementById("first");

		first.addEventListener("click", function() {

		index = 1;

		if(sessionStorage.getItem('movie', document.getElementById('myInput').value) !== null) {

			document.getElementById("myInput").value = sessionStorage.getItem('movie');

		}	

		mainSearch(index);

		});
	}
}


function goBack() {

	var previous = document.getElementById("prev");

	previous.addEventListener("click", function() {

		if(index > 1) {

			index -= 1
		}

		if(sessionStorage.getItem('movie', document.getElementById('myInput').value) !== null) {

			document.getElementById("myInput").value = sessionStorage.getItem('movie');

		}	

		mainSearch(index);

	});
}


function goForward(pages) {

	var totalPages = pages;
	var last = document.getElementById("last");

	last.addEventListener("click", function() {

		index = pages;

		if(sessionStorage.getItem('movie', document.getElementById('myInput').value) !== null) {

			document.getElementById("myInput").value = sessionStorage.getItem('movie');

		}	

		mainSearch(index);

	});
}



function showMovie(jsonObj2) {

	var data = jsonObj2;
	var endRow = '</div>';
	var text = '<div class="col-md-8">';
	var img = '<div class="col-md-4">';

	var y = document.getElementById("results");
    y.style.display = "";

   text += '<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	text += '<h3>' + data.Title + '</h3>';
	text += '<ul>';
	text += '<li><b>Year</b>: ' + data.Year + '</li>';
	text += '<li><b>Rated:</b> ' + data.Rated + '</li>';
	text += '<li><b>Released:</b> ' + data.Released + '</li>';
	text += '<li><b>Runtime:</b> ' + data.Rutime + '</li>';
	text += '<li><b>Genre:</b> ' + data.Genre + '</li>';
	text += '<li><b>Language:</b> ' + data.Language + '</li>';
	text += '<li><b>Country:</b> ' + data.Country + '</li>';
	text += '<li><b>Awards:</b> ' + data.Awards + '</li>';
	text += '<li><img style="margin-right: 10px;" src="images/imdb.png" alt="Link to IMDB"/><a href="https://www.imdb.com/title/'+data.imdbID+'" target="_blank">More...</a></li></br>';
	text += '<li><b>Director:</b> ' + data.Director + '</li>';
	text += '<li><b>Writer:</b> ' + data.Writer + '</li>';
	text += '<li><b>Actors:</b> ' + data.Actors + '</li></br>';
	text += '<li><b>Plot:</b></br><p> ' + data.Plot + '</p></li></br>';
	text += '</ul>';

	text += '<ul class="list-inline space">'

	for(var i = 0; i < data.Ratings.length; i++) {

		if(i == 0) {

			text += '<li class="list-inline-item space"><img class="imgspace" src="images/imdb.png" alt="IMDB" title="IMDB" />' + data.Ratings[i].Value + '</li>';
		}

		else if(i == 1) {

			text += '<li class="list-inline-item space"><img class="imgspace" src="images/rt.png" alt="Rotten Tomatoes" title="Rotten Tomatoes" />' + data.Ratings[i].Value + '</li>';
		}

		else if(i == 2) {

			text += '<li class="list-inline-item space"><img class="imgspace" src="images/mc.png" alt="Metacritic" title="Metacritic" />' + data.Ratings[i].Value + '</li>';
		}

		else {
			
			text += '<li class="list-inline-item space"><b>'+data.Ratings[i].Source+':</b> ' + data.Ratings[i].Value + '</li>';
		}
	}

	text += '</ul>';
	text += endRow;

	if(data.Poster !== "N/A") {

		text += img+'<img class="d-block m-auto" src='+data.Poster+'</img></br>';

	} else {

		text += img + endRow;
	}

	document.getElementById('content').style.display = "";
	document.getElementById('content').innerHTML = text;

	//console.log(document.getElementById('content').innerHTML);

	var close = document.querySelectorAll(".close");

	for(var i = 0; i < close.length; i++) {

		close[i].addEventListener("click", function(i) {

		document.getElementById('content').innerHTML = "";

        var y = document.getElementById("results");
        y.style.display = "none";

		}.bind(null, i));
	}	
}

