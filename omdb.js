//---Javascript Project 2 for Laura UAS Javascript Course: OMDBapi---

/*Global variables are set for the JSON object that handles the search results for all movies, and the JSON object that handles specific titles. I decided to keep these two separate, I think I'd run into problems later on with pagination. The index counter for number of pages of results is also global, given how many functions need access to it.*/

var jsonObj;
var jsonObj2;
var index = 1;


//Listens for the enter key, modified to work on mobile devices.

document.addEventListener("keyup", function(event) {
    if (event.code === 'Enter') {

        index = 1;
        mainSearch(index);
       
//Makes the keyboard popup go back down on mobiles and tablets
        document.activeElement.blur(); 
    }
});


/*Listens for the click on the search input and goes to the mainSearch function, passing along the index counter, which is reset to 1 here again as an ounce of prevention.*/

document.getElementById('mySearch').addEventListener('click', function(){
    
    index = 1;
    document.activeElement.blur();
    
    mainSearch(index);
});


/*JQuery animation for the Scroll to Top button, such that it scrolls smooth and slow. Animations aren't my thing, and I find I get them working better in JQuery, even if JQuery is also not really my thing.*/

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


//Accepts the input from the search bar, sending that value to the JSON parser, to then return the results.

function mainSearch() {
    
/*Hides the revelant tags so that there's no leftover styling in between new searches. This function handles multiple pages for the same search result, hence all the re-clearing of HTML tags.*/

    var x = document.getElementById("hide");
    x.style.display = "none";
    var y = document.getElementById("results");
    y.style.display = "none";
        
    document.getElementById('footer').innerHTML = "";

//Puts the search value and the current index as the page number for the search results into the URL.
    var movie = document.getElementById("myInput").value;

//The movie and index variables feed the search string and the page to start out on to the URL. 
    var url = 'https://www.omdbapi.com/?s='+movie+'&page='+index+'&apikey=b823da4c';
    var xmlhttp = new XMLHttpRequest();

//Added this innerHTML to clear some styling from previous searches.    
    document.getElementById('content').innerHTML = "";

/*If the search field is empty, give an error message. Otherwise, clear that error message and input field, get the XML, and send the JSON object to the mainResults function for parsing.*/

    if (movie == null || movie == "") {

        document.getElementById("myInput").placeholder = "Please enter at least one character";

        document.getElementById("myInput").classList.add('input-placeholder-false');
        document.getElementById("myInput").style.border = "2px solid";
        document.getElementById("myInput").style.borderColor = "red";

    } else {
        
//Stores the value typed into the search field in sessionstorage, to call back later when clicking through pages of search results.
        sessionStorage.setItem('movie', document.getElementById("myInput").value);
        
//Resets the look of the input field.
        document.getElementById("myInput").classList.remove('input-placeholder-false');
        document.getElementById("myInput").style.border = "none";
        document.getElementById("myInput").placeholder = "Please enter the name of your movie or TV show here...";

        document.getElementById("myInput").value = "";

// Queries OMDB for the data, sends the JSON object for parsing.
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

        xmlhttp.onreadystatechange = function() {

        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                var x = document.getElementById("hide");
                x.style.display = "";

//If there's no values returned in the results, the page defaults to this.
                x.innerHTML = "<h1>No Results Found</h1>";

                var y = document.getElementById("footer");
                footer.innerHTML = "";

            jsonObj = JSON.parse(xmlhttp.responseText);

            mainResults(jsonObj);

            }
        }
    }
}


/*Queries OMDB for results of the specific movie clicked on from the search results. Then passes that object to the showMovie function for parsing of the JSON object.*/

function movieSearch(movie) {

    var title = movie;

    var url = "https://www.omdbapi.com/?i="+title+"&apikey=b823da4c";
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


/*Basically parses the JSON object of search results and displays them on the page, but of course does much more than that, setting up the page to later do this for multiple pages of search results.*/

function mainResults(jsonObj) {

//The totalPages variable takes the totalResults value from OMDB and divides it by ten, to get the number of pages, as it's ten results per page.

    var data = jsonObj;
    var endRow = '</div>';
    var list = '<div class="row d-flex justify-content-center">';
    var totalPages = data.totalResults / 10;

//Rounds up the total number of pages.
    totalPages = Math.ceil(totalPages);

//Sets up the div to display the results
    var x = document.getElementById("hide");
    x.style.display = "";

//Iterates through the search results from OMDB, and formats the HTML.
    for(var i = 0; i < data.Search.length; i++) {

        list += '<div class="col-md-4 text-center results"><h3>' + data.Search[i].Title + '</h3>';
        list += '<ul class="movielist">';
        list += '<li><b>Year:</b> ' + data.Search[i].Year + '</li>';
        list += '<li><b>Type:</b> ' + data.Search[i].Type + '</li>';
        list += '</ul>';
        
//If there's a poster at OMDB, formats the display and adds a More button. Adds a default image if there's no poster.

        if(data.Search[i].Poster !== "N/A") {

            list += '<img class="thumbnail" src='+data.Search[i].Poster+'</img></br>';
            list += '<button type="button" class="btn btn-success">More</button>' + endRow;

        } else {

            list += '<img class="thumbnail" src="images/generic.png"</img></br>';
            list += '</br><button type="button" class="btn btn-success">More</button>' + endRow;
        }
    }
    
//Prints out the HTML to the div.   
    document.getElementById("hide").innerHTML = list + endRow;

/*If the search results are only one page (10 or less), let the footer be empty. Otherwise, send the number of pages to the footer function, for formatting of the pagination in the footer.*/
    
    if(index == 1 && totalPages == 1) {

        document.getElementById('footer').innerHTML = "";
        
    } else {

        footer(totalPages);
    }

/*Sets up the More buttons, iterates through them, returns the given IMDB ID to the movieSearch function to query OMDB for the correct movie. JQueary for animation to scroll to that div, to more easily see the results.*/    

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

/*Without this bind, the event listener was blissfully unaware of the i counter, and it's needed to match the right button click to the right IMDB ID. Credit to Stack Overflow.*/

        }.bind(null, i));
    }

//Repeat of the above, but for the movie poster, giving the user the option of what to click on.

    var posters = document.getElementsByClassName("thumbnail");
    
    for(var i = 0; i < posters.length; i++) {

        posters[i].addEventListener("click", function(i) {

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

//Formats the footer to show the correct page, and the total number of pages, passing on the number of pages to the goForward function.

function footer(totaPages) {

    var more = document.getElementById("footer");
    var endRow = '</div>';
    var pages = totaPages;

    //console.log(index);

    var list = '<div class="col-md-4 text-center">';
    list += '<a href="#" id="continue">Page ' + index +  ' of ' + pages + '</a>' + endRow;
    list += '<div class="col-md-4 text-center">';
    list += '<a href="#" id="last">Last Page</a>' + endRow;

    more.innerHTML = list;


//Sends the total number of pages to the goForward function, to handle clicking through to the next page.  
    goForward(pages);

//If the index counter for what page we're on is greater than 2, then format the footer to show Prev and Last page links.
    
    if(index > 1) {

        list = '<div class="col-md-4 text-center">';
        list += '<a href="#" id="prev">Prev </a>' + endRow;
        list += '<div class="col-md-4 text-center">';
        list += '<a href="#" id="continue">Page ' + index +  ' of ' + pages + '</a>' + endRow;
        list += '<div class="col-md-4 text-center">';
        list += '<a href="#" id="last">Last</a>' + endRow;

        more.innerHTML = list;

        //console.log(more.innerHTML);

/*Calls the goBack function, as it has the event listener for the Prev link to go back. Calls the goForward function, passing the number of pages to the function, so that it can go to the last page.*/

        goBack();

        goForward(pages);
    }

/*Listens for when the Continue link is clicked, adding to the index and sending it back to the mainSearch function, so that it processes the query for that page of results.*/

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
    
/*If the page we're on is greater or equal to the number of pages, then format the footer such that you can go back to the previous page, or go back to the first.*/    

    if(index >= pages) {

        list = '<div class="col-md-6 text-center">';
        list += '<a href="#" id="prev">Prev </a>' + endRow;
        list += '<div class="col-md-6 text-center">';
        list += '<a href="#" id="first">First Page</a>' + endRow;
        list += endRow;

        more.innerHTML = list;

        //console.log(more.innerHTML);

//Calls the goBack function for the previous page link.
        goBack();

        var first = document.getElementById("first");

        first.addEventListener("click", function() {

//Sets the index to 1 so that the search results start from the 1st page.
        index = 1;

/*If there's an input value in session storage, then get it now, and make it the value being searched, and return the index of the page of results to process to the mainSearch function.*/
        
        if(sessionStorage.getItem('movie', document.getElementById('myInput').value) !== null) {

            document.getElementById("myInput").value = sessionStorage.getItem('movie');
        }   

        mainSearch(index);

        });
    }
}


//Function for the Prev link in the footer, to go back to the previous page of search results

function goBack() {
    
//Sets up the eventlistener for clicking on the Prev link.

    var previous = document.getElementById("prev");

    previous.addEventListener("click", function() {

/*If the page number is two or more, then subtract 1 from the page number. Then if sessionstorage has the input value originally entered, then get that value and put it back, and then call the mainSearch function, with the given page number, to give the results for the previous page.*/

        if(index > 1) {

            index -= 1
        }

        if(sessionStorage.getItem('movie', document.getElementById('myInput').value) !== null) {

            document.getElementById("myInput").value = sessionStorage.getItem('movie');

        }   

        mainSearch(index);

    });
}


/*Sets up the event listerner for clicking on the link in the footer to go to the last page of search results, calling back up the searched-for value from sessionstorage, and  sending that index to the mainSearch for displaying the last page of the search results.*/

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

//Parses the JSON object that contains the results for a given movie, and formats the HTML. Also adds a link to IMDB, given that we have the IMDB ID.

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
    
/*Iterates through the ratings from IMDB, Rotten Tomatoes and Metacritic. They're always 0,1,2 in the OMDB, so this loop adds the right logo depending on the index, and allows for a new ratings site if one is added.*/

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
    
//Handles if there is a poster at OMDB or not.  

    if(data.Poster !== "N/A") {

        text += img+'<img class="d-block m-auto" src='+data.Poster+'</img></br>';

    } else {

        text += img + endRow;
    }
    
//Sets up the divs to display the results
    document.getElementById('content').style.display = "";
    document.getElementById('content').innerHTML = text;

    //console.log(document.getElementById('content').innerHTML);
    
//Handles the close button for the results
    
    var close = document.querySelectorAll(".close");

    for(var i = 0; i < close.length; i++) {

        close[i].addEventListener("click", function(i) {

        document.getElementById('content').innerHTML = "";

        var y = document.getElementById("results");
        y.style.display = "none";

        }.bind(null, i));
    }   
}

