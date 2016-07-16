// Replace main video title
try {
    var el = document.querySelector('.watch-title');
    var title = el.innerHTML;
    el.innerHTML = title.toLowerCase();
} catch (ex) {
    console.log('Encountered error, are we not on a main video page? ;', ex);
}

// Replace other titles (sidebar, etc)
try {
    var titles = document.querySelectorAll('span.title');
    for (var i = 0; i < titles.length; i++) {
        titles[i].innerHTML = titles[i].innerHTML.toLowerCase();
    }
    titles = document.querySelectorAll('a[title]');
    for (var i = 0; i < titles.length; i++) {
        titles[i].innerHTML = titles[i].innerHTML.toLowerCase();
    }
} catch (ex) {
    console.error(ex);
}
