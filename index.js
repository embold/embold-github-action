const core = require('@actions/core');
const github = require('@actions/github');

const axios = require('axios');

async function launchScan(emboldUrl, token, repoUid, branch) {

    console.log(`Launching Embold scan for repo: ${repoUid} at: ${emboldUrl}`);
    try {

        let res = await axios.post(emboldUrl + '/api/v1/repositories/' + repoUid + '/scan', `repoBranchOrTag=${branch}`, {
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/x-www-form-urlencoded' }
          });
        console.log(res.data.status);
    } catch(error) {
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
