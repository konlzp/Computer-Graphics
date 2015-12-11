// See: <url:http://en.wikipedia.org/w/index.php?title=
// Tridiagonal_matrix_algorithm&oldid=634696642>
//
// In the code below, indexes start with zero. This means, replace in the
// Wikipedia article's "Method" section:
//
//     a[j] → b[j-2]
//     b[j] → b[j-1]
//     c[j] → c[j-1]
//     d[j] → d[j-1]
//     x[j] → x[j-1]
//     c'[j] → c'[j-1]
//     d'[j] → d'[j-1]

/*jslint node: true, maxerr: 50, maxlen: 80 */

// Adapted from code by Felix Klee
// https://github.com/feklee/tridiagonal-solve
/*
The MIT License (MIT)

Copyright (c) 2014 Felix E. Klee

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

//'use strict';

var createCp, createDp, solve, solve1;

// cp: c'
createCp = function (a, b, c, n) {
    var i, cp = [];

    cp[0] = c[0] / b[0];
    if (!isFinite(cp[0])) {
        return null;
    }

    for (i = 1; i < n - 1; i += 1) {
        cp[i] = c[i] / (b[i] - a[i - 1] * cp[i - 1]);
        if (!isFinite(cp[i])) {
            return null;
        }
    }

    return cp;
};

// dp: d'
createDp = function (a, b, d, cp, n) {
    var i, dp = [];

    dp[0] = d[0] / b[0];
    if (!isFinite(dp[0])) {
        return null;
    }

    for (i = 1; i < n; i += 1) {
        dp[i] = (d[i] - a[i - 1] * dp[i - 1]) / (b[i] - a[i - 1] * cp[i - 1]);
        if (!isFinite(dp[i])) {
            return null;
        }
    }

    return dp;
};

solve = function (a, b, c, d, n) {
    var i, x = [], cp, dp;

    cp = createCp(a, b, c, n);
    if (cp === null) {
        return null;
    }
    dp = createDp(a, b, d, cp, n);
    if (dp === null) {
        return null;
    }

    x[n - 1] = dp[n - 1];
    for (i = n - 2; i >= 0; i -= 1) {
        x[i] = dp[i] - cp[i] * x[i + 1];
    }

    return x;
};



