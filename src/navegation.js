window.addEventListener("DOMContentLoaded",navigator,false);
window.addEventListener("hashchange",navigator,false);
function navigator(){
    console.log({location});
    if(location.hash.startsWith("#trends")){
        console.log("TRENDS")
    }else if(location.hash.startsWith("#search=")){
        console.log("Search")
    }
    else if(location.hash.startsWith("#movie=")){
        console.log("Movie")
    }else if(location.hash.startsWith("#category=")){
        console.log("category")
    }else{
        console.log("home")
    }
    location.hash
}