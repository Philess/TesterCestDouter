// Main Bicep template for Albums API deployment to Azure Container Apps
targetScope = 'resourceGroup'

@minLength(1)
@maxLength(64)
@description('Name of the environment used to generate a short unique hash for resources.')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string = resourceGroup().location

@description('Id of the user or app to assign application roles')
param principalId string = ''

// Resource token for unique naming
var resourceToken = uniqueString(subscription().id, resourceGroup().id, location, environmentName)

// Resource name prefixes (≤3 characters, alphanumeric only)
var logAnalyticsName = 'la${resourceToken}'
var applicationInsightsName = 'ai${resourceToken}'
var containerRegistryName = 'acr${resourceToken}'
var containerAppsEnvironmentName = 'cae${resourceToken}'
var managedIdentityName = 'mi${resourceToken}'

// Container App specific names
var albumsApiServiceName = 'albums-api'
var albumsApiContainerAppName = 'ca${resourceToken}'

// Create Log Analytics Workspace
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      searchVersion: 1
      legacy: 0
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

// Create Application Insights
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

// Create Container Registry
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-11-01-preview' = {
  name: containerRegistryName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: false
    anonymousPullEnabled: false
    publicNetworkAccess: 'Enabled'
  }
}

// Create User-Assigned Managed Identity
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: managedIdentityName
  location: location
}

// Assign AcrPull role to managed identity for container registry access
resource acrPullRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(containerRegistry.id, managedIdentity.id, subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d'))
  scope: containerRegistry
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Create Container Apps Environment
resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: containerAppsEnvironmentName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

// Create Albums API Container App
resource albumsApiContainerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: albumsApiContainerAppName
  location: location
  tags: {
    'azd-service-name': albumsApiServiceName
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3000
        transport: 'http'
        allowInsecure: false
        corsPolicy: {
          allowedOrigins: ['*']
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
          allowedHeaders: ['*']
          allowCredentials: false
        }
      }
      registries: [
        {
          server: containerRegistry.properties.loginServer
          identity: managedIdentity.id
        }
      ]
      secrets: [
        {
          name: 'appinsights-connection-string'
          value: applicationInsights.properties.ConnectionString
        }
      ]
    }
    template: {
      containers: [
        {
          name: albumsApiServiceName
          image: 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
          env: [
            {
              name: 'PORT'
              value: '3000'
            }
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              secretRef: 'appinsights-connection-string'
            }
          ]
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 10
        rules: [
          {
            name: 'http-rule'
            http: {
              metadata: {
                concurrentRequests: '100'
              }
            }
          }
        ]
      }
    }
  }
  dependsOn: [
    acrPullRoleAssignment
  ]
}

// Outputs
@description('The resource group ID')
output RESOURCE_GROUP_ID string = resourceGroup().id

@description('The container registry endpoint')
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.properties.loginServer

@description('The container registry name')
output AZURE_CONTAINER_REGISTRY_NAME string = containerRegistry.name

@description('The Albums API endpoint')
output ALBUMS_API_ENDPOINT string = 'https://${albumsApiContainerApp.properties.configuration.ingress.fqdn}'

@description('The Application Insights connection string')
output APPLICATION_INSIGHTS_CONNECTION_STRING string = applicationInsights.properties.ConnectionString

@description('The managed identity ID')
output AZURE_CLIENT_ID string = managedIdentity.properties.clientId