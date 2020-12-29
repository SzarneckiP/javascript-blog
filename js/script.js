'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
};

console.log(templates.articleLink);
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
const opt = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags.list',
  cloudClassCount: '5',
  cloudClassPrefix: 'tag-size-',
  authorsListSelector: '.list.authors',
};

function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(opt.titleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(opt.articleSelector + customSelector);
  let html = '';
  for(let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(opt.titleSelector).innerHTML;
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle}; //templates
    const linkHTML = templates.articleLink(linkHTMLData); //templates
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
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
};

const calculateCssClass = function(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opt.cloudClassCount - 1) + 1 );
  return opt.cloudClassPrefix + classNumber;
};

function generateTags(){
  let allTags = {}; /* [NEW] create a new variable allTags with an empty object  */
  /* find all articles */
  const articles = document.querySelectorAll(opt.articleSelector);
  /* START LOOP: for every article: */
  for(let article of articles) {
    /* find tags wrapper */
    const wrapperTags = article.querySelector(opt.articleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){ /* generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> '; /* add generated code to html variable */
      const linkHTMLData = {id: tag, title: tag}; //templates
      const linkHTML = templates.articleTag(linkHTMLData); //templates
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
  const tagList = document.querySelector(opt.tagsListSelector); /* [NEW] find list of tags in right column */
  const tagsParams = calculateTagsParams(allTags);
  let allTagsHTML = ''; /* [NEW] create variable for all links HTML code */

  for(let tag in allTags) { /* [NEW] START LOOP: for each tag in allTags: */
    const tagLinkHTML ='<li><a href ="#tag-' + tag + '" class="' + calculateCssClass(allTags[tag], tagsParams) + '">' + tag + '</a></li>';
    allTagsHTML += tagLinkHTML; /* [NEW] generate code of a link and add it to allTagsHTML */
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
  let allAuthors = {}; //new
  const articles = document.querySelectorAll(opt.articleSelector);

  for(let article of articles) {
    const authorWrapper = article.querySelector(opt.articleAuthorSelector);
    const authorTags = article.getAttribute('data-author');
    const linkHTML = '<a href="#author-' + authorTags + '">' + authorTags + '</a>';
    if(!allAuthors[authorTags]) { /* [NEW] check if this link is NOT already in allTags */
      allAuthors[authorTags] = 1; /* [NEW] add tag to allTags object */
    } else {
      allAuthors[authorTags]++;
    }
    authorWrapper.innerHTML = linkHTML;
  }
  const authorsList = document.querySelector(opt.authorsListSelector); /* [NEW] find list of tags in right column */
  const tagsParams = calculateTagsParams(allAuthors);
  let allAuthorsHTML = ''; /* [NEW] create variable for all links HTML code */
  for(let author in allAuthors) { /* [NEW] START LOOP: for each tag in allTags: */
    const authorLinkHTML ='<li><a href ="#author-' + author + '" class="' + calculateCssClass(allAuthors[author], tagsParams) + '">' + author + '</a></li>';
    allAuthorsHTML += authorLinkHTML; /* [NEW] generate code of a link and add it to allTagsHTML */
  }
  authorsList.innerHTML = allAuthorsHTML; /*[NEW] add HTML from allTagsHTML to tagList */
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
