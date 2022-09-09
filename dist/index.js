/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 671:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const https = __nccwpck_require__(687);

/**
 * Get SSL certificate expiration date
 * @param {string} domain
 * @returns {Promise<Date>}
 */
function checkCertificate(domain) {
    return new Promise((resolve, reject) => {
        https.get(domain, {agent: false}, response => {
            const certificate = response.connection.getPeerCertificate();

            if (!certificate.valid_to) reject(new Error(`Unable to get SSL-certificate expiration date for domain ${domain}`));

            resolve(new Date(certificate.valid_to));
        })
            .on('error', reject);
    });
}

module.exports = checkCertificate;

/***/ }),

/***/ 905:
/***/ ((module) => {

/**
 * Wrapper for days counting
 * @type {{countDays: (function(*, *=): number), DAY: number, getToday: (function(): *)}}
 */
const Dates = {
    /**
     * Number of seconds for one day
     * @type {number}
     */
    DAY: 86400000,

    /**
     * Get current date
     * @returns {Date}
     */
    getToday: function () {
        return new Date();
    },

    /**
     * Count number of days between two dates
     * @param {Date} toDate
     * @param {Date|Boolean} fromDate
     * @returns {number}
     */
    countDays: function (toDate, fromDate = false) {
        if (!fromDate) fromDate = Dates.getToday();

        return Math.floor((toDate - fromDate) / Dates.DAY);
    }
};

module.exports = Dates;

/***/ }),

/***/ 61:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(61);
const Dates = __nccwpck_require__(905);
const CheckCertificate = __nccwpck_require__(671);
// const CheckPaidTillDate = require('./tasks/check-paid-till-date');


try {
    /**
     * Site domain to be checked
     * @type {string}
     */
    const URL = core.getInput('url');

    /**
     * Check SSL certificate
     */
    CheckCertificate(URL)
        .then(date => {
            core.setOutput("ssl-expire-date", date.toString());
            core.setOutput("ssl-expire-days-left", Dates.countDays(date));
        })
        .catch(error => {
            if (error.code === 'CERT_HAS_EXPIRED') {
                core.setOutput("ssl-expire-date", "INVALID");
                core.setOutput("ssl-expire-days-left", -1);
            }

            throw error;
        })
        .catch(core.error);

} catch (error) {
    core.setFailed(error.message);
}

})();

module.exports = __webpack_exports__;
/******/ })()
;