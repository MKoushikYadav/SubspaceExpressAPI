/* Made by M.Koushik Yadav

This Express App makes a call to an external API and then analyzes the response data.
To make a request to this API, Use the following methods and rules
 -> <localhost>:3000/api/blog-stats
    Use a get method
 -> <localhost>:3000/api/blog-search?query=query
    Makes a case-insensitive search request within blog data and returns the filtered blog data.
    Use a get method
    Make sure query is not empty or not null

    The app uses axios to make http calls.

*/

const express = require('express');
const axios = require('axios')
const lodash = _ = require('lodash');
const app = express();

//Initializing blogData to be 0
let blogData= null;

// Retrieving blogData across all routes by implementing it on middleware
const fetchDataIfNotAvailable = async (req, res, next) => {
  if (!blogData) {
    try {
        const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs',
        {headers: {
          'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'}
        });

        blogData = response.data.blogs;}
    catch(error) {
      return res.status(500).send('Server is currently down try again\n\n'+ error.message);
    }
  }
  next();
}; 

// Apply the middleware to all routes
app.use(fetchDataIfNotAvailable);


//API Route for blog-stats
app.get('/api/blog-stats',async (req, res) => {
    
    const blogArray = blogData
    const jsonResponse = {
      TotalCount:_.size(blogArray),
      LongestTitle: _.maxBy(blogArray,entry=>entry.title.length).title,
      OnesWithPrivacy:_.size(_.filter(blogArray,entry=>entry.title.toLowerCase().includes('privacy'))),
      UniqueTitle:_.uniqBy(blogArray,entry=>entry.title.toLowerCase()).map(entry=>entry.title),
    }
    
    res.send(jsonResponse);
})


//function for filtering data based on query
function filterBlog(data,query){
  return _.filter(data,entry=>entry.title.toLowerCase().includes(query.toLowerCase()))
}

//memoized function of filterBlog
const memoizedFilterBlog = _.memoize(filterBlog)



//API route for blog-search
app.get('/api/blog-search',(req, res) => {
  if (!req.query|| req.query.query=='' ||!req.query.query){
    res.send({error:"Please attach a query parameter with a valid search query."})
  }else{
  const uniqBlogData = _.uniqBy(blogData,entry=>entry.title.toLowerCase())
  const filteredArray = memoizedFilterBlog(uniqBlogData,req.query.query)
  const jsonResponse = {
    filteredBlogs:  filteredArray
  }
  res.send(jsonResponse);
}})



// This method sends an error if the wrong method is used for accessing any route
const reportInvalidMethod =(req,res,next)=>{
  if (req.method!='GET') {
  res.send({
    error:"Invalid method. Use GET",
    method_used:req.method
  })}
  else(next())
}

//Using the all method to apply the invalidMethod Reporter
app.all('/api/blog-search',reportInvalidMethod)
app.all('/api/blog-stats',reportInvalidMethod)


app.listen(3000,()=>
{
  console.log('listening on port 3000')
});