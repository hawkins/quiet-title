
// Load case
var titleCase = '';
chrome.storage.sync.get('case', function(item) {
    if (item.case) {
        titleCase = item.case;
    } else {
        titleCase = 'lower';
        // Save it, too
        chrome.storage.sync.set({'case': titleCase}, function() { console.log('Case saved'); });
    }

    // Now continue
    // Replace main video title
    try {
        var el = document.querySelector('.watch-title');
        var title = el.innerHTML;
        if (titleCase === 'lower')
            el.innerHTML = title.toLowerCase();
        if (titleCase === 'all')
            el.innerHTML = title.toUpperCase();
    } catch (ex) {
        console.log('Encountered error, are we not on a main video page? ;', ex);
    }

    // Replace other titles (sidebar, etc)
    try {
        var titles = document.querySelectorAll('span.title');
        for (var i = 0; i < titles.length; i++) {
            if (titleCase === 'lower')
                titles[i].innerHTML = titles[i].innerHTML.toLowerCase();
            if (titleCase === 'all')
                titles[i].innerHTML = titles[i].innerHTML.toUpperCase();
        }
        titles = document.querySelectorAll('a[title]');
        for (var i = 0; i < titles.length; i++) {
            if (titleCase === 'lower')
                titles[i].innerHTML = titles[i].innerHTML.toLowerCase();
            if (titleCase === 'all')
                titles[i].innerHTML = titles[i].innerHTML.toUpperCase();
        }
    } catch (ex) {
        console.error(ex);
    }
});
