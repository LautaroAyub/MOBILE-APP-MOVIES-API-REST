const api= axios.create({
    baseURL:"https://api.themoviedb.org/3/",
    headers:{
        "Content-Type":"application/json;charset=utf-8"
    },
    params:{
        "api_key":API_KEY,
    }
});
console.log(api)
//Utils
function insertMovies(movies,container){
    container.innerHTML="";
    movies.forEach(movie => {
        const movieContainer= document.createElement("div");
        movieContainer.classList.add("movie-container");
        const movieImg= document.createElement("img");
        movieImg.classList.add("movie-img");
        movieImg.setAttribute("alt",movie.title);
        movieImg.setAttribute("src", "https://image.tmdb.org/t/p/w300"+movie.poster_path);
        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);

    });
}
function insertCategories(genres,container){
    container.innerHTML="";
    genres.forEach(category => {
        const categoryContainer= document.createElement("div");
        categoryContainer.classList.add("category-container");
        const categoryTitle= document.createElement("h3");
        categoryTitle.classList.add("category-title");
        categoryTitle.setAttribute("id","id"+category.id);
        categoryTitle.addEventListener("click",()=>{
            location.hash=`#category= ${category.id}-${category.name}`;
        })
        const categoryTitleText= document.createTextNode(category.name);
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);   
    });
}

//LLamados a la api
async function getTrendingMoviesPreview (){
    const {data}= await api("trending/movie/day");
    const movies=data.results;
    insertMovies(movies,trendingMoviesPreviewList);
}

async function getCategoriesPreview(){
    const {data}= await api("genre/movie/list");
    const genres=data.genres;
    insertCategories(genres,categoriesPreviewList)
}

async function getMoviesByCategory(id,name){
    const {data}= await api("discover/movie",{
    params:{
        with_genres:id,
    }
    });
    const movies=data.results;
    headerCategoryTitle.innerHTML=name;
   insertMovies(movies,genericSection)
}
