let form = document.querySelector('form');

form.addEventListener('submit', function (ev) {
  ev.preventDefault();
  let subredditBanner = document.querySelector('.subreddit-banner__subreddit');
  let userInput = form['input-text'].value;

  subredditBanner.textContent = 'r/' + userInput;
  fetchReddit(userInput);

});

