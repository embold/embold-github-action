# Embold Scan Action

This action downloads the BrowserStack CQ Scanner (Embold scanner CLI) and runs static code analysis on your repository locally.

## Inputs

### `emboldUrl`

**Required** URL of your Embold instance. Default: `https://packages.embold.io/`

### `emboldToken`

**Required** Your Embold access token (recommended: Use a [secret](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets))

### `emboldRepoUid`

**Required** Repository UID of the Embold repository where the results will be published

### `scannerDownloadUrl`

**Optional** URL to download the BrowserStack CQ Scanner. Default: `https://v1.embold.io/nfs/CLI/browserstack-codequality-scanner.tar.gz`

### `repositoryConfigPath`

**Optional** Path to the repository configuration JSON file. Default: `repository-configuration.json`

### `tempDirectory`

**Optional** Temporary directory for scanner artifacts. Default: `./temp`

### `baseDirectory`

**Optional** Base directory of the source code to scan. Default: `.`

### `verbose`

**Optional** Enable verbose logging. Default: `true`

### `continueOnError`

**Optional** Continue workflow execution even if scan fails. Default: `true`

## Outputs

### `status`

Status of the scan

## Example Usage

### Basic Usage

```yaml
- name: Run Embold Scan
  uses: embold/embold-github-action@v1
  with:
    emboldUrl: https://packages.embold.io/
    emboldToken: ${{ secrets.EMBOLD_TOKEN }}
    emboldRepoUid: ${{ secrets.EMBOLD_REPO_UID }}
```

### Advanced Usage with Custom Configuration

```yaml
- name: Run Embold Scan
  uses: embold/embold-github-action@v1
  with:
    emboldUrl: https://packages.embold.io/
    emboldToken: ${{ secrets.EMBOLD_TOKEN }}
    emboldRepoUid: 7205368b7f51aa0dde425b5a9065166f
    repositoryConfigPath: config/repository-configuration.json
    baseDirectory: ./src
    tempDirectory: ./embold-temp
    verbose: true
    continueOnError: false
```

### Complete Workflow Example

```yaml
name: Embold Code Quality Analysis

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  embold-scan:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
      
      - name: Run Embold Scan
        uses: embold/embold-github-action@v1
        with:
          emboldUrl: https://packages.embold.io/
          emboldToken: ${{ secrets.EMBOLD_TOKEN }}
          emboldRepoUid: ${{ secrets.EMBOLD_REPO_UID }}
          repositoryConfigPath: repository-configuration.json
          verbose: true
```

## Prerequisites

- A repository configuration JSON file (default: `repository-configuration.json` in the root directory)
- Embold access token stored as a GitHub secret
- Embold repository UID

## How It Works

1. Downloads the BrowserStack CQ Scanner from the specified URL
2. Extracts the scanner archive
3. Runs the Embold scanner with the provided configuration
4. Publishes results to the specified Embold repository

## Support

For issues and questions, please visit the [Embold documentation](https://docs.embold.io/) or contact Embold support.