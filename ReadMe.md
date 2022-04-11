# OMDB Movie Search
- The OMDB Movie Search app allows the user to search the OMDB for movie or tv shows, the page then displaying the results. The results are shown in groups of not greater than ten for each page. 
- The user can click on each title to see more information. There’s the option to click through the pages of results in their sequential order, or skip to the last page, and scroll back from there, or to skip back to the first page of results.

## Searching for Titles
- If there is no result found for a given search, the page displays “No Result”.
- To execute the search, simply hit enter, or click on the magnifying glass icon.
- A new search can be made at anytime, no need to close or refresh anything.

## Search Results
- Search Results are shown ten at a time. To find out more about a given title, click on its poster, or click on the green More button.
- To go to the next page, click the “Page: X of Y” link.
- To skip to the last page of results, click the “Last Page” link.
- From the second page on, the user may click on “Prev” to go back to the previous page, which works all the way to the front page of results.
- On the last page of results, the user may scroll backwards through the results by clicking the “Prev” link, or skip back to the front page of results.
- Not all titles have posters in the OMDB, and sometimes they’re not a standard size, this is up to the OMDB, but the page will show a default logo for any titles not having a poster.

## Title Information
- When the user clicks a search result poster or the More button, the page scrolls up to display more information about that title. The information supplied is up to the OMDB, but hopefully it is neatly formatted here. Included in the information are the top billed cast and crew, the runtime, it’s parental guidance rating, awards, etc.,
- For more information, click the More link, which will take you to that title’s page over at the IMDB. This is possible because the title’s unique IMDB ID is included in the title’s information at the OMDB.
- Lastly in the title’s information are the ratings at IMDB, Rotten Tomatoes, and Metacritic. If any other sites are added by OMDB, they should be accounted for in this app, but not all titles have ratings from all three sites.
- To close the information display, simply click the X button, but that is simply user choice.

# Evaluation Criteria
- The page asks for the data
- Saves the results into a variable (or two)
- Displays the selected data and makes it look nice.
- Displays the search results and the data for individual titles, and works for as many results as there are.
- Gives the user control of the display, whether or not to click the More button or the image, whether or not to close the title data, and control over which page of results to view.
- There’s an input field that can find any list of titles, so long as it’s spelled right. 
	- It’s possible to implement episode or season search for TV shows, but it didn’t fit with what I wanted to do. I wanted to type a search string, and have it return anything and everything that matched. 
	- With the IMDB ID as part of the data, if you want to know even more, it’s easy enough to go to that IMDB page. The title info display shows everything that’s in the OMDB about that title, it’s a judgement call, but I felt it was enough.

- I had to use external libraries but only for Bootstrap v4 to behave as it should, and for the magnifying glass icon. I wasn’t exactly using a cheat sheet. I included JQuery, but in the lecture it was stated that it was allowed, even though it says the opposite in the criteria. For whatever it’s worth, I didn’t use much. I find I can get animations more easily working with it, it’s easier to understand, at least with animations, for me personally.
- I commented not literally every line of code, but I had my “systems expert” husband look at it. He doesn’t do JavaScript, but he could understand what was going on.
- I used plenty of CSS.
- There’s no onclicks.
- I did the best I could.
	- The code for displaying the results isn’t as elegant as it could be. I’m not using much in the way of JavaScript methods for adding elements to a page, but because I was using Bootstrap, adding lines of HTML the old-fashioned way helped me keep track of my containers and my rows, and their formatting.

