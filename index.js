const core = require('@actions/core');
const Dates = require('./utils/dates');
const CheckCertificate = require('./tasks/check-certificate');
// const CheckPaidTillDate = require('./tasks/check-paid-till-date');


try {
    /**
     * Site domain to be checked
     * @type {string}
     */
    console.log(core.getInput('url'));
    var list = core.getInput('url').split(' ');
    console.log(list);
    for(url in list) {
        /**
         * Check SSL certificate
         */
        CheckCertificate(url)
            .then(date => {
                console.log(url + "\t\t" + date.toISOString() + "\t\t" + Dates.countDays(date));
            })
            .catch(error => {
                if (error.code === 'CERT_HAS_EXPIRED') {
                    console.log(url + "\t\tINVALID\t\t-1");
                }

                throw error;
            })
            .catch(core.error);
    }

} catch (error) {
    core.setFailed(error.message);
}
