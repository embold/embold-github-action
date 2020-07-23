# Embold scan action

This action run an Embold scan for your repository on a remote Embold server

## Inputs

### `emboldUrl`

**Required** URL of your Embold instance

### `emboldToken`

**Required** URL of your Embold instance (recommended: Use a [secret](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets))

### `emboldRepoUid`

**Required** Repository UID of the Embold repository where the results will be published

## Outputs

### `status`

Status of the launch of scan

## Example usage
```yaml
uses: actions/embold-github-action@v1
with:
    emboldUrl: ${{ secrets.EMB_URL }}
    emboldToken: ${{ secrets.EMB_TOKEN }}
    emboldRepoUid: ${{ secrets.EMB_REPOUID }}
```