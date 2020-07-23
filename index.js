const core = require('@actions/core');
const github = require('@actions/github');

const axios = require('axios');

async function launchScan(emboldUrl, token, repoUid) {

  console.log(`Launching Embold scan for repo: ${repoUid} at: ${emboldUrl}`);
  const config = {
    method: 'post',
    url: emboldUrl + '/api/v1/repositories/' + repoUid + '/scan',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/x-www-form-urlencoded' }
  }

  try {
    let res = await axios(config);
    console.log(res.data.status);
  } catch(error) {
    core.setFailed(error.message);
  }
}

try {
    const emboldUrl = core.getInput('emboldUrl');
    console.log(`emboldUrl: ${emboldUrl}`);

    const token = core.getInput('emboldToken');
    const repoUid = core.getInput('emboldRepoUid');
    console.log(`emboldRepoUid: ${repoUid}`);
    launchScan(emboldUrl, token, repoUid);
    core.setOutput("status", "SUCCESS");

} catch (error) {
  core.setFailed(error.message);
}
