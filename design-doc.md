# browse reddit

recreating of the new reddit design while using the reddit api to make 'search' work.

## CSS

To make the layout flex will be used because it isn't a very complex layout that css grid is needed.

The css will follow BEM.

## HTML

Will use the semantic tags such as article and section. 

### article tag

The article tag will be used to wrap ever post in that is fetched from the reddit API.

### section

The section tag will be used to split up page into different 
sections. 


## JavaScript

When loading the script with the script tag It will need the async attribute because there will be a fetching of the API on the initial load.

### service worker

A service worker will be needed to able to able to use this app offline and display it on the home screen of a mobile device

### accessing the reddit API

To access the API all you need to do is add .json to the end of the url. The reddit API will be accessed using fetch.


