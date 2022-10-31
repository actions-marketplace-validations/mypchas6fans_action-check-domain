const core = require('@actions/core');
const Dates = require('./utils/dates');
const CheckCertificate = require('./tasks/check-certificate');
// const CheckPaidTillDate = require('./tasks/check-paid-till-date');

var list = core.getInput('url').split(' ');
var mindate = 365;
for (index in list) {
    url = list[index];
    console.log(url);
    try {
        CheckCertificate(url)
            .then(url, date => {
                console.log(url + "\t\t" + date.toISOString() + "\t\t" + Dates.countDays(date));
                // console.exportVariable("GITHUB_OUTPUT",Math.min(mindate,Dates.countDays(date)));
            })
            .catch(error => {
                if (error.code === 'CERT_HAS_EXPIRED') {
                    console.log(url + "\t\tINVALID\t\t-1");
                    // console.exportVariable("GITHUB_OUTPUT", "-1");
                }

                throw error;
            })
            .catch(core.error);

    } catch (error) {
        core.setFailed(error.message);
    }
}
