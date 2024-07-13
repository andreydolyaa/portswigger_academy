// function trackSearch(query) {
//   console.log(
//     '<img src="/resources/images/tracker.gif?searchTerms=' + query + '">'
//   );
// }

// trackSearch("'bro'\"/>;<script>alert('XSS')</script><!---")


function doSearchQuery(query) {
    document.getElementById('searchMessage').innerHTML = query;
}
var query = (new URLSearchParams(">\"<script>alert('XSS')</script>"));

if(query) {
    doSearchQuery(query);
}