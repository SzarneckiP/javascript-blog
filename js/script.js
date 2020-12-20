'use strict';

const titleClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;

  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active');

  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  const articleSelector = clickedElement.getAttribute('href');
  const targetArticle = document.querySelector(articleSelector);
  targetArticle.classList.add('active');
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector ='.post-author',
  optTagsListSelector = '.tags.list';

function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for(let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  for(let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

const calculateTagsParams = function(tags) {
  const params = {
    max: '0',
    min: '999999',
  };
  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
};


function generateTags(){
  let allTags = {}; /* [NEW] create a new variable allTags with an empty object  */
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles) {
    /* find tags wrapper */
    const wrapperTags = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';
      /* add generated code to html variable */
      html = html + linkHTML;
      if(!allTags[tag]) { /* [NEW] check if this link is NOT already in allTags */
        allTags[tag] = 1; /* [NEW] add tag to allTags object */
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    wrapperTags.innerHTML = html;
  /* END LOOP: for every article: */
  }
  const tagList = document.querySelector('.tags'); /* [NEW] find list of tags in right column */
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  let allTagsHTML = ''; /* [NEW] create variable for all links HTML code */
  for(let tag in allTags) { /* [NEW] START LOOP: for each tag in allTags: */
    allTagsHTML += tag + '('+ allTags[tag] +')'; /* [NEW] generate code of a link and add it to allTagsHTML */
  }
  tagList.innerHTML = allTagsHTML; /*[NEW] add HTML from allTagsHTML to tagList */
}

generateTags();

const tagClickHandler = function(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', ''); // wydobycie fragmentu tekstu
  /* find all tag links with class active */
  const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let tagLink of tagLinks) {
    /* remove class active */
    tagLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const allTagLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let allTagLink of allTagLinks) {
    /* add class active */
    allTagLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
};

function addClickListenersToTags() {
  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for(let link of links) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);

  for(let article of articles) {
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    const authorTags = article.getAttribute('data-author');
    const linkHTML = '<a href="#author-' + authorTags + '">' + authorTags + '</a>';
    authorWrapper.innerHTML = linkHTML;
  }
}

generateAuthors();

const authorClickHandler = function(event) {
  event.preventDefault(); /* prevent default action for this event */
  const clickedElement = this; /* make new constant named "clickedElement" and give it the value of "this" */
  const href = clickedElement.getAttribute('href'); /* make a new constant "href" and read the attribute "href" of the clicked element */
  const author = href.replace('#author-', ''); /* make a new constant "tag" and extract tag from the "href" constant */
  const authorLinks = document.querySelectorAll('a.active[href^="#author-"]'); /* find all tag links with class active */
  for(let authorLink of authorLinks) {
    authorLink.classList.remove('active'); /* remove class active */
  }
  const allAuthorLinks = document.querySelectorAll('a[href="' + href + '"]'); /* find all tag links with "href" attribute equal to the "href" constant */
  for(let allAuthorLink of allAuthorLinks) {
    allAuthorLink.classList.add('active'); /* add class active */
  }
  generateTitleLinks('[data-author="' + author + '"]'); /* execute function "generateTitleLinks" with article selector as argument */
};

function addClickListenersToAuthors() {
  const links = document.querySelectorAll('a[href^="#author-"]');
  for (let link of links) {
    link.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();
