# SubspaceExpressAPI
This Express App makes a call to an external API and then analyzes the response data.
To make a request to this API, Use the following methods and rules
## <code>-> < localhost >:3000/api/blog-stats</code>
###   Use a get method
### Returns stats for the blogs from external API
## <code>-> < localhost >:3000/api/blog-search?query=query</code>
 ###  Makes a case-insensitive search request within blog data and returns the filtered blog data.
 ###  Use a get method
 ###  Make sure query is not empty or not null
 ###  The app uses axios to make http calls.



## Note: This API caches the external API data after the first call because it is constant. In the case of variable external API data, we need to change the middleware that is added to all the routes so as to not store the API data,
