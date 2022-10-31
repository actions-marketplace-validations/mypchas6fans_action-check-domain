const core = require('@actions/core');
const Dates = require('./utils/dates');
const CheckCertificate = require('./tasks/check-certificate');
// const CheckPaidTillDate = require('./tasks/check-paid-till-date');


try {
    /**
     * Site domain to be checked
     * @type {string}
     */
    var list = core.getInput('url').split('\n');
    
    for(index in list) {
        /**
         * Check SSL certificate
         */
        CheckCertificate(list[index])
            .then(date => {
                core.setOutput("ssl-expire-date", date.toISOString());
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
    }

} catch (error) {
    core.setFailed(error.message);
}
