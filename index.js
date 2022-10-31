const core = require('@actions/core');
const Dates = require('./utils/dates');
const CheckCertificate = require('./tasks/check-certificate');
// const CheckPaidTillDate = require('./tasks/check-paid-till-date');

var list = core.getInput('url').split(' ');
for (index in list) {
    url = list[index];
    console.log(url);
    try {
        CheckCertificate(url)
            .then(date => {
                console.log("\t\t" + date.toISOString() + "\t\t" + Dates.countDays(date));
            })
            .catch(error => {
                if (error.code === 'CERT_HAS_EXPIRED') {
                    console.log("\t\tINVALID\t\t-1");
                }

                throw error;
            })
            .catch(core.error);

    } catch (error) {
        core.setFailed(error.message);
    }
}
