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
const lazyLoader= new IntersectionObserver((entries)=>{

    entries.forEach((entry)=>{
        // console.log({entry})
        if (entry.isIntersecting){
        const urlImg= entry.target.getAttribute("data-img");
        entry.target.setAttribute("src",urlImg);}


    })
});

function insertMovies(
    movies,
    container,
    {
        lazyLoad = false,
        clean=true} ={},
    ) {
    if(clean){
        container.innerHTML="";
    }
    movies.forEach(movie => {
        const movieContainer= document.createElement("div");
        movieContainer.addEventListener("click",()=>{
            location.hash= "#movie="+movie.id
        })
        movieContainer.classList.add("movie-container");
        const movieImg= document.createElement("img");
        movieImg.classList.add("movie-img");
        movieImg.setAttribute("alt",movie.title);
        movieImg.setAttribute(
        lazyLoad ? "data-img" : "src",
        "https://image.tmdb.org/t/p/w300"+movie.poster_path);

        movieImg.addEventListener("error",()=>{
           const movieH2Text=document.createTextNode(movie.title);
           const movieH2= document.createElement("h2");
           movieH2.appendChild(movieH2Text);
           movieContainer.appendChild(movieH2);
           movieImg.setAttribute("src","https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg")
           movieContainer.classList.remove("movie-container")
           movieContainer.classList.add("movie-noLoad")
        });
        if (lazyLoad){
            lazyLoader.observe(movieImg);
        }
 
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
    insertMovies(movies,trendingMoviesPreviewList,{lazyLoad:true,clean:true});
}

async function getCategoriesPreview(){
    const {data}= await api("genre/movie/list");
    const genres=data.genres;
    insertCategories(genres,categoriesPreviewList)
}

async function getMoviesByCategory(id,name){
    const { data }= await api("discover/movie",{
    params:{
        with_genres:id,
    }
    });
    const movies=data.results;
    maxPage=data.total_pages;
    console.log(maxPage)
    headerCategoryTitle.innerHTML=name;
   insertMovies(movies,genericSection,{lazyLoad:true,clean:true})
}
function getPaginatedByCategory(id){
    //closure
    return  async function (){
        
        const {scrollTop,scrollHeight,clientHeight}= document.documentElement;
        const scrollIsBottom=(scrollTop+clientHeight)>=(scrollHeight -10);
        const pageIsNotMax = page < maxPage;
    
        if(scrollIsBottom && pageIsNotMax){
            page++;
            console.log(page)
            const { data }= await api("discover/movie",{
                params:{
                    with_genres:id,
                    page,
                }
                });
            const movies=data.results;
            insertMovies(movies,genericSection,{lazyLoad:true,clean:false});
        }
    }

}
async function getMoviesBySearch(query){
    const { data }= await api("search/movie",{
        params:{
            query,//query:query,
        }
        });
        const movies=data.results;
        maxPage = data.total_pages;
        console.log(maxPage)
        headerCategoryTitle.innerHTML=name;
       insertMovies(movies,genericSection,{lazyLoad:true,clean:true})
}
function getPaginatedMoviesBySearch(query){
    //closure
    return  async function (){
        
        const {scrollTop,scrollHeight,clientHeight}= document.documentElement;
        const scrollIsBottom=(scrollTop+clientHeight)>=(scrollHeight -10);
        const pageIsNotMax = page < maxPage;
    
        if(scrollIsBottom && pageIsNotMax){
            page++;
            console.log(page)
            const { data }= await api("search/movie",{
                params:{
                    query,
                    page,
                }
                });
            const movies=data.results;
            insertMovies(movies,genericSection,{lazyLoad:true,clean:false});
        }
    }

}

async function getTrendingMovies (){
    const {data}= await api("trending/movie/day");
    const movies=data.results;
    maxPage=data.total_pages;
    insertMovies( movies,genericSection, {lazyLoad:true,clean:true});
    headerTitle.innerHTML="Tendencias";
}

async function getPaginatedTrendingMovies(){
    const {scrollTop,scrollHeight,clientHeight}= document.documentElement;
    const scrollIsBottom=(scrollTop+clientHeight)>=(scrollHeight);
    const pageIsNotMax = page < maxPage;

    if(scrollIsBottom && pageIsNotMax){
        page++;
        console.log(page)
        const {data}= await api("trending/movie/day",{
            params:{
                page:page,
            },
        });
        const movies=data.results;
        insertMovies(movies,genericSection,{lazyLoad:true,clean:false});
    }

}
async function getMovieById(id){
    const { data:movie }= await api("movie/"+id);
    const movieImgUrl="https://image.tmdb.org/t/p/w500"+movie.poster_path
    headerSection.style.background=`
    linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%
        ),url(${movieImgUrl})`
   
        movieDetailTitle.textContent=movie.title;
        movieDetailDescription.textContent=movie.overView;
        movieDetailScore.textContent=movie.vote_average;
        insertCategories(movie.genres,movieDetailCategoriesList);
        getRelatedMoviesById(id);
}
async function getRelatedMoviesById(id){
    const { data }= await api(`movie/${id}/recommendations`);
    const relatedMovies=data.results;
    console.log(relatedMovies)
    insertMovies(relatedMovies,relatedMoviesContainer,{lazyLoad:false,clean:true})
}