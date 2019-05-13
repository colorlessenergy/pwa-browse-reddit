/*
  this file will create a function that fetches the reddit api with 1 argument that will be a string and be given by the user.
*/

let fetchReddit = (function () {
  const wrapper = document.querySelector('.posts');
  function fetchReddit(subreddit) {
    wrapper.innerHTML = "";
    fetch('https://www.reddit.com/r/'+ subreddit + '.json', { mode: 'cors' })
      .then(function (res) {
        // readable stream
        if (!res.ok) {
          return console.log('something went wrong when requesting the data')
        }
        return res.json();
      })
      .then(function (json) {
        // the API returns the data in a very nested object.
        const nestedData = json.data.children;

        nestedData.forEach(function (apiData) {
          apiData = apiData.data;
          let data = extractDataFromApi(apiData);

          // console.log(apiData);

          return renderDataFromApi(data);
        });
      })
      .catch(function (err) {
        if (err) return console.log(err);
      })
  }

  function extractDataFromApi (obj) {
    let data = {};

    data.author = obj.author;
    data.title = obj.title;
    data.url = 'https://www.reddit.com' + obj.permalink;

    data.picUrl = obj.url;

    if (obj.secure_media && obj.secure_media.reddit_video && obj.secure_media.reddit_video.scrubber_media_url) {
      data.video = obj.media.reddit_video.scrubber_media_url;
    }

    if (obj.selftext) {
      data.text = obj.selftext;
    }

    // youtube iframe
    if (obj.domain === 'youtube.com') {
      data.youtubeIframe = parseUrlToHtml(obj.secure_media_embed.content);
    }

    return data;
  }

  /*
  the HTML structure this function will create

  <article>
    <a class="post" href="#">
      <div class="content">
        <p class="content__author">posted by: brian</p>
        <div class="content__data">
          <h3 class="content__title">a title will go here</h3>
          <p class="content__body">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti corrupti id vel cum molestiae voluptates eos a
            iste, facere modi? Facilis harum odit reprehenderit cum. Enim dolorum non facilis dolores?
          </p>
        </div>
      </div>
    </a>
  </article>
  */

  function renderDataFromApi (obj) {
    const container = document.createElement('article');
    const contentWrapper = document.createElement('div');
    const pAuthor = document.createElement('p');
    const divContent = document.createElement('div');
    let h3Title = document.createElement('h3');
    let pText = document.createElement('p');
    let video = document.createElement('video');
    let aWrapper = document.createElement('a');
    let img = document.createElement('img');


    aWrapper.classList.add('post');
    aWrapper.href = obj.url;

    contentWrapper.classList.add('content');

    pAuthor.classList.add('content__author');
    pAuthor.textContent = 'posted by: ' + obj.author;

    divContent.classList.add('content__data');

    h3Title.textContent = obj.title;
    h3Title.classList.add('content__title');

    divContent.appendChild(h3Title);

    if (obj.text) {
      pText.textContent = obj.text;
      pText.classList.add('content__body');
      divContent.appendChild(pText);
    }

    if (obj.video && !obj.text) {
      video.src = obj.video;
      video.classList.add('content__video');

      video.autoplay = true;
      video.loop = true;
      video.muted = true;

      divContent.appendChild(video);
    }

    if (obj.picUrl && !obj.text && !obj.youtubeIframe && !obj.video) {
      img.src = obj.picUrl;
      img.classList.add('content__img');

      divContent.appendChild(img);
    }

    if (obj.youtubeIframe) {
      divContent.innerHTML += (obj.youtubeIframe);
    }

    contentWrapper.appendChild(pAuthor);
    contentWrapper.appendChild(divContent);

    aWrapper.appendChild(contentWrapper);

    container.appendChild(aWrapper);
    
    wrapper.appendChild(container);
  }

  function parseUrlToHtml(str) {
    let regexLeftAngleBracket = /&lt;/g;
    let regexRightAngleBracket = /&gt;/g;
    
    str = str.replace(regexLeftAngleBracket, '<');
    str = str.replace(regexRightAngleBracket, '>');

    return str;
  }

  fetchReddit('leagueoflegends');

  return fetchReddit;
})();

// register service worker

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(swReg => {
        console.log('Service Worker is registered', swReg);
      })
      .catch(err => {
        console.error('Service Worker Error', err);
      });
  });
}