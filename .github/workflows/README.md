# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD automation.

## Workflows

### `build-and-push.yaml`
Builds and deploys the application to Azure when code is pushed to the `main` branch.

**Triggers:**
- Push to `main` branch
- Semver tags (`v*.*.*`)
- Manual workflow dispatch

### `pr-validation.yaml`
Validates pull requests to the `main` branch with automated deployment and load testing.

**Triggers:**
- Pull requests targeting `main` branch

**Features:**
- Builds and pushes Docker images with PR-specific tags
- Deploys to isolated test environment (separate resource group per PR)
- Runs automated load tests against the deployed PR environment
- Posts load test results as PR comments
- Automatically cleans up resources when PR is merged

## Required Secrets

The following GitHub secrets must be configured in your repository settings (`Settings > Secrets and variables > Actions`):

### Azure Authentication

| Secret Name | Description | Example/Format |
|-------------|-------------|----------------|
| `AZURE_CREDENTIALS` | Azure Service Principal credentials for authentication | JSON object with `clientId`, `clientSecret`, `subscriptionId`, `tenantId` |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID (used for portal links) | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |

#### Creating AZURE_CREDENTIALS

```bash
# Create a service principal with Contributor role
az ad sp create-for-rbac \
  --name "github-actions-tester-cest-douter" \
  --role Contributor \
  --scopes /subscriptions/{subscription-id} \
  --sdk-auth

# The output JSON should be stored as the AZURE_CREDENTIALS secret
```

### Resource Configuration

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `RESOURCE_GROUP` | Base resource group name for deployments | `rg-albums-demo` |
| `LOAD_TEST_RESOURCE` | Azure Load Testing resource name | `loadtest-albums-api` |
| `LOAD_TEST_RESOURCE_GROUP` | Resource group containing the Load Testing resource | `rg-albums-loadtest` |

### Notes on Resource Naming

**PR Validation Workflow:**
- Each PR creates a temporary resource group: `{RESOURCE_GROUP}-pr-{PR_NUMBER}`
- Example: PR #42 creates `rg-albums-demo-pr-42`
- Resources are automatically deleted when PR is merged or closed

**Load Testing:**
- One shared Azure Load Testing resource is used for all PRs
- Each PR creates a separate test: `albums-api-pr-{PR_NUMBER}`
- Tests are deleted when PR is merged

## Setting Up Secrets

### 1. Create Azure Service Principal

```bash
# Set your subscription
az account set --subscription "Your Subscription Name"

# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

# Create service principal
az ad sp create-for-rbac \
  --name "github-actions-tester-cest-douter" \
  --role Contributor \
  --scopes "/subscriptions/$SUBSCRIPTION_ID" \
  --sdk-auth > azure-credentials.json

# View the output
cat azure-credentials.json
```

Copy the entire JSON output and add it as the `AZURE_CREDENTIALS` secret.

### 2. Create Azure Load Testing Resource

```bash
# Create resource group for load testing
az group create \
  --name rg-albums-loadtest \
  --location eastus

# Create Azure Load Testing resource
az load create \
  --name loadtest-albums-api \
  --resource-group rg-albums-loadtest \
  --location eastus
```

### 3. Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to `Settings > Secrets and variables > Actions`
3. Click `New repository secret`
4. Add each secret with its corresponding value:
   - `AZURE_CREDENTIALS`: Paste the JSON from step 1
   - `AZURE_SUBSCRIPTION_ID`: Your Azure subscription ID
   - `RESOURCE_GROUP`: `rg-albums-demo` (or your preferred base name)
   - `LOAD_TEST_RESOURCE`: `loadtest-albums-api`
   - `LOAD_TEST_RESOURCE_GROUP`: `rg-albums-loadtest`

## Workflow Behavior

### Pull Request Lifecycle

1. **PR Opened/Updated:**
   - Builds Docker images tagged with PR number
   - Deploys to isolated environment: `{RESOURCE_GROUP}-pr-{PR_NUMBER}`
   - Creates/updates load test: `albums-api-pr-{PR_NUMBER}`
   - Runs load test and posts results as PR comment

2. **PR Merged:**
   - Cleans up PR-specific resource group
   - Deletes PR-specific load test
   - Main branch deployment happens via `build-and-push.yaml`

3. **PR Closed (not merged):**
   - Manual cleanup required (or add a workflow for this)

### Load Test Results

After each PR build, the workflow posts a comment with:
- ✅/❌ Status indicator
- Performance metrics (response times, error rates, throughput)
- Link to detailed results in Azure Portal
- Link to downloadable artifacts

Example comment:
```markdown
## ✅ Load Test Results - PR #42

**Status:** DONE
**Test Run ID:** `albums-api-pr-42-20250109-143022`
**API Endpoint:** https://album-api-42.azurecontainerapps.io

### Performance Metrics
| Metric | Value |
|--------|-------|
| Total Requests | 150,000 |
| Failed Requests | 75 |
| Error % | 0.05% |
| Avg Response Time | 245 ms |
| P95 Response Time | 450 ms |
| P99 Response Time | 890 ms |
| Requests/sec | 500 |

### Links
- [View detailed results in Azure Portal](https://portal.azure.com/...)
- [Download results artifact](https://github.com/.../actions/runs/...)
```

## Troubleshooting

### Workflow Fails: "Azure CLI not authenticated"
- Verify `AZURE_CREDENTIALS` secret is correctly formatted JSON
- Ensure service principal has Contributor role on subscription

### Load Test Creation Fails
- Verify `LOAD_TEST_RESOURCE` and `LOAD_TEST_RESOURCE_GROUP` exist
- Check that service principal has permissions on the load testing resource
- Install Azure Load Testing extension: `az extension add --name load`

### PR Comment Not Posted
- Verify GitHub token has write permissions
- Check the workflow run logs for script errors
- Ensure test results file was generated

### Resources Not Cleaned Up
- Check that the cleanup job ran successfully
- Manually delete: `az group delete -n rg-albums-demo-pr-{PR_NUMBER} --yes`
- Manually delete test: `az load test delete --test-id albums-api-pr-{PR_NUMBER} ...`

## Customization

### Adjust Load Test Duration

Edit the `load-test-pr.yaml` generation in `pr-validation.yaml`:
```yaml
env:
  - name: TEST_DURATION
    value: "180"  # Change from 300 to 180 seconds
```

### Change Number of Load Test Engines

Modify `engineInstances` in the load test creation step:
```bash
--engine-instances 5  # Change from 3 to 5 for more load generation capacity
```

### Add Additional Validation Steps

Add new jobs to `pr-validation.yaml` after the `package-services` job:
```yaml
run-integration-tests:
  runs-on: ubuntu-latest
  needs: [deploy-test-environment]
  steps:
    - name: Run integration tests
      run: |
        # Your test commands here
```

## Cost Considerations

**Per PR:**
- Azure Container Apps: Pay-per-use (minimal cost for test duration)
- Azure Load Testing: ~$0.003 per virtual user hour
- Typical PR test cost: < $1.00

**Cost Optimization:**
- Load tests run for ~5 minutes per PR
- Resources are automatically cleaned up after merge
- Consider limiting load test runs to specific PR labels if needed

## Additional Resources

- [Azure Load Testing Documentation](https://learn.microsoft.com/en-us/azure/load-testing/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure Container Apps Documentation](https://learn.microsoft.com/en-us/azure/container-apps/)
