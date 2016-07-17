// Add string methods
String.prototype.toCamelCase = function() {
    return this
        .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
}
String.prototype.toStartCase = function() {
    for (var i = 0; i < this.length; i++) {0
        if (this.charAt(i).match(/[a-z]/i)) {
            var char = this.charAt(i).toUpperCase();
            return (this.slice(0, i) + char + this.slice(i + 1, this.length).toLowerCase());
        }
    }
    return this;
}
String.prototype.toTitleCase = function(){
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

    return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
        if (index > 0 && index + match.length !== title.length &&
          match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
          (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
          title.charAt(index - 1).search(/[^\s-]/) < 0) {
            return match.toLowerCase();
        }

        if (match.substr(1).search(/[A-Z]|\../) > -1) {
            return match;
        }

        return match.charAt(0).toUpperCase() + match.substr(1);
    });
};

// Function to get desired case
function getDesiredCase (str) {
    if (!titleCase)
        return;

    if (titleCase === 'lower')
        return str.toLowerCase();
    if (titleCase === 'title')
        return str.toTitleCase();
    if (titleCase === 'start')
        return str.toStartCase();
    if (titleCase === 'camel')
        return str.toCamelCase();
    if (titleCase === 'all')
        return str.toUpperCase();
}

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
        el.innerHTML = getDesiredCase(title);
    } catch (ex) {
        console.log('Encountered error, are we not on a main video page? ;', ex);
    }
    // Replace other titles (sidebar, etc)
    try {
        var titles = document.querySelectorAll('span.title');
        for (var i = 0; i < titles.length; i++) {
            titles[i].innerHTML = getDesiredCase(titles[i].innerHTML);
        }
        titles = document.querySelectorAll('a[title]');
        for (var i = 0; i < titles.length; i++) {
            titles[i].innerHTML = getDesiredCase(titles[i].innerHTML);
        }
    } catch (ex) {
        console.error(ex);
    }
});
