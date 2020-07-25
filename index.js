const core = require('@actions/core');
const github = require('@actions/github');

const axios = require('axios');

async function waitForScanStatus(emboldUrl, token, repoUid, scanId) {
    try {
        // Check for upto 1 min if the scan enters processing state
        let status = null;
        for (let i = 0; i < 30; ++i) {
            status = await axios.get(emboldUrl + '/api/v1/repositories/' + repoUid + '/scans/' + scanId + '/status', {
                headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            if (status.data.scanStatus !== 'FAIL') {
                if (status.data.currentStep === 'SCANBOX_SCHEDULED_SUCCESS') {
                    // Scan is scheduled, so all good
                    console.log(`Scan with id ${scanId} is started successfully`);
                    return;
                }
            } else {
                // Scan failed, so return with failure
                throw new Error(`Scan with id ${scanId} failed with error: ${status.data.currentStep}`);
            }

            // else wait some more...
            await new Promise(r => setTimeout(r, 2000));
        }

        // If we reached here we still didn't get the expected status. 
        // This could be because the scm sync is taking longer (e.g. large repo), so we can still return
        if (status && status.data.currentStep === 'UPDATING_SOURCES') {
            console.log(`Scan with id ${scanId} is updating sources`);
        }
    } catch (error) {
        console.error(`Error while checking scan status: ${error.message} for scanId: ${scanId}`)
        throw error;
    }
}

async function launchScan(emboldUrl, token, repoUid, branch) {

    console.log(`Launching Embold scan for repo: ${repoUid} at: ${emboldUrl}`);
    try {

        let res = await axios.post(emboldUrl + '/api/v1/repositories/' + repoUid + '/scan', `repoBranchOrTag=${branch}`, {
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        // Check back on scan status with the status API until we get the expected state
        await waitForScanStatus(emboldUrl, token, repoUid, res.data.scanId);
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
}

try {
    const emboldUrl = core.getInput('emboldUrl');
    const token = core.getInput('emboldToken');
    const repoUid = core.getInput('emboldRepoUid');

    // const payload = JSON.stringify(github.context.payload, undefined, 2);
    launchScan(emboldUrl, token, repoUid, github.context.payload.ref);
    core.setOutput("status", "SUCCESS");

} catch (error) {
    core.setFailed(error.message);
}
