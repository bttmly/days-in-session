[![Build Status](https://travis-ci.org/nickb1080/days-in-session.svg?branch=master)](https://travis-ci.org/nickb1080/days-in-session)

# Days In Session

Couldn't find a decent data source for getting the days in session for the US Congress. This module scrapes [congress.gov](https://beta.congress.gov/congressional-record/browse-by-date/) and parses the HTML. No guarantees on accuracy!

Exports a single function which can be called with either a year (1995-now) or a Congress number (104-113). Returns an array of dates as strings. You can map them with `new Date(str)` to get Date objects.

```javascript
var daysInSession = require('days-in-session');

// with a year
daysInSession(2014).then(function (days) {
  console.log(days);
  // [ 'August 08, 2014',
  // 'August 05, 2014',
  // 'August 04, 2014',
  // ... etc ...
  // 'January 03, 2014' ]
});

// also works with a Congress number
daysInSession(113).then(function (days) {
  console.log(days);
});

```
