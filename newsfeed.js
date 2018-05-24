// Fetch json. If successful sort articles on publication time and create html for each article
fetch('https://s3.eu-west-2.amazonaws.com/enfo-test-resources/api/articles.json').then(response => {
  return response.json();
}).then(data => {
  let articles = data.articles;
  articles.sort(function(a, b) {
    let date1 = getDate(a.publishedAt);
    let date2 = getDate(b.publishedAt);
    return date2 - date1;
  });
  articles.map(article => createArticleHtml(article));
}).catch(error => {
  console.log(error);
});

//Create html for artice function
function createArticleHtml(article) {
  //Create html-nodes
  let card = createNode('div'),
    img = createNode('img'),
    title = createNode('div');
    description = createNode('div');
    publishedAt = createNode('div');
    author = createNode('div');

  //Set contents of html-nodes
  img.src = article.urlToImage;
  title.innerHTML = article.title;
  description.innerHTML = article.description;
  publishedAt.innerHTML = getDate(article.publishedAt).toLocaleString();

  //Check that author has value
  if (article.author != null) {
    author.innerHTML = "Author: " + article.author;
    author.classList.add('author');
  }
  //Add classes to html-nodes
  card.classList.add('article');
  title.classList.add('title');
  img.classList.add('articleImg');
  description.classList.add('description');
  publishedAt.classList.add('publishedAt');

  //Append to #container
  const newsContainer = document.getElementById('container');
  append(card, publishedAt);
  append(card, title);
  append(card, img);
  append(card, description);
  append(card, author);
  append(newsContainer, card);
}

//Function for filtering articles on filter-value
function filterNews() {
  let input, filterValue, newsContainer, article;
  input = document.getElementById('searchField');
  filterValue = input.value.toUpperCase();
  newsContainer = document.getElementById('container');
  article = newsContainer.getElementsByClassName('article');

  //Check if filter-value matches description, author, title or publishedAt of articles - if not hide article
  for (i = 0; i < article.length; i++) {
    let desc = article[i].getElementsByClassName('description')[0].innerHTML.toUpperCase();
    let author = article[i].getElementsByClassName('author')[0] ? article[i].getElementsByClassName('author')[0].innerHTML.toUpperCase() : "";
    let title = article[i].getElementsByClassName('title')[0].innerHTML.toUpperCase();
    let publishedAt = article[i].getElementsByClassName('publishedAt')[0].innerHTML.toUpperCase();
    if (desc.indexOf(filterValue) > -1 ||
      publishedAt.indexOf(filterValue) > -1 ||
      title.indexOf(filterValue) > -1 ||
      author.indexOf(filterValue) > -1) {
      article[i].style.display = '';
    } else {
      article[i].style.display = 'none';
    }
  }
}

//Hide header on scroll function
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  let currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById('header').style.top = "0";
  } else {
    document.getElementById('header').style.top = "-72px";
  }
  prevScrollpos = currentScrollPos;
}

// ---Utility functions---
function createNode(element) {
  return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

function getDate(dateString) {
  dateString = dateString.substring(0, 4) + "-" + dateString.substring(4, dateString.length);
  dateString = dateString.substring(0, 7) + "-" + dateString.substring(7, dateString.length);

  return new Date(dateString);
}
//------------------------
