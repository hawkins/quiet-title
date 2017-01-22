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
        if (index > 0
            && index + match.length !== title.length
            && match.search(smallWords) > -1
            && title.charAt(index - 2) !== ":"
            && (title.charAt(index + match.length) !== '-'
                || title.charAt(index - 1) === '-')
            && title.charAt(index - 1).search(/[^\s-]/) < 0) {
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
    if (!titleCase || titleCase === 'original') return str;

    if (titleCase === 'lower') return str.toLowerCase();
    if (titleCase === 'title') return str.toTitleCase();
    if (titleCase === 'start') return str.toStartCase();
    if (titleCase === 'camel') return str.toCamelCase();
    if (titleCase === 'all')   return str.toUpperCase();
}

var titleCase = '';
function applyTitleFormat() {
    // Load case
    chrome.storage.sync.get('case', function(item) {
        if (item.case) {
            titleCase = item.case;
        } else {
            titleCase = 'lower';
            // Save it, too
            chrome.storage.sync.set({'case': titleCase}, function() {
                console.log('Case saved');
            });
        }

        // Now replace every title on page via css selectors
        var selectors = [ '.watch-title'
                        , 'span.title'
                        , 'a.content-link'
                        , 'a.ytp-title-link > span'
                        , '.yt-ui-ellipsis'
                        ];
        selectors.forEach(function (selector) {
            try {
                document.querySelectorAll(selector).forEach(function (element) {
                    element.innerHTML = getDesiredCase(element.innerHTML);
                });
            } catch (ex) {
                console.error(ex);
            }
        });
    });
}

// Apply on first load
applyTitleFormat();

// HACK: Listen for video loads to keep titles formatted properly to fix Issue #1
document.body.addEventListener('transitionend', function(event) {
    applyTitleFormat();
}, true);

// HACK: Listen for scroll down to fix Issue #3
window.addEventListener("scroll", function(e) {
    applyTitleFormat();
});
