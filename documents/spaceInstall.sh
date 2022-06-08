#!/usr/bin/env bash

sudo echo "spaceInstall.sh started" >>/tmp/spaceInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/3DSpace-V6R2022x.Linux64.tar.gz /tmp/3DSpace-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_3dspaceGA.xml /tmp/UserIntentions_3dspaceGA.xml
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes
cd /tmp
sudo tar xvfz /tmp/3DSpace-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/3DSpace-V6R2022x.Linux64.tar.gz
sudo echo "before installing 3dspace platform" >>/tmp/spaceInstall.log
date >>/tmp/spaceInstall.log
sudo /tmp/3DSpace.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_3dspaceGA.xml
sudo echo "after installing 3dspace platform" >>/tmp/spaceInstall.log
date >>/tmp/spaceInstall.log
sudo rm -f -R /tmp/3DSpace.Linux64
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/DS_Installer-V6R2022x.Linux64.tar.gz /tmp/DS_Installer-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/3DExplore-V6R2022x.Linux64.tar.gz /tmp/3DExplore-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_3dexploreGA.xml /tmp/UserIntentions_3dexploreGA.xml
cd /tmp
sudo tar xvfz /tmp/DS_Installer-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/DS_Installer-V6R2022x.Linux64.tar.gz
sudo tar xvfz /tmp/3DExplore-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/3DExplore-V6R2022x.Linux64.tar.gz
sudo /tmp/3DExplore.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/UserIntentions_3dexploreGA.xml
sudo rm -f -R /tmp/3DExplore.Linux64
### 1 Collab Tasks
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Webapps/ENOVIACollaborativeTasksFoundation-V6R2022x.Linux64.tar.gz /tmp/ENOVIACollaborativeTasksFoundation-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_collabTasksGA.xml /tmp/UserIntentions_collabTasksGA.xml
cd /tmp
sudo tar xvfz /tmp/ENOVIACollaborativeTasksFoundation-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/ENOVIACollaborativeTasksFoundation-V6R2022x.Linux64.tar.gz
sudo /tmp/ENOVIACollaborativeTasksFoundation.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/UserIntentions_collabTasksGA.xml
sudo rm -f -R /tmp/ENOVIACollaborativeTasksFoundation.Linux64
### 2 Library central
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Webapps/ENOVIAIPClassificationFoundation-V6R2022x.Linux64.tar.gz /tmp/ENOVIAIPClassificationFoundation-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_librarycentralGA.xml /tmp/UserIntentions_librarycentralGA.xml
cd /tmp
sudo tar xvfz /tmp/ENOVIAIPClassificationFoundation-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/ENOVIAIPClassificationFoundation-V6R2022x.Linux64.tar.gz
sudo /tmp/ENOVIAIPClassificationFoundation.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/UserIntentions_librarycentralGA.xml
sudo rm -f -R /tmp/ENOVIAIPClassificationFoundation.Linux64
### 3 IEF
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Webapps/ENOVIAIntegrationExchangeFramework-V6R2022x.Linux64.tar.gz /tmp/ENOVIAIntegrationExchangeFramework-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_iefGA.xml /tmp/UserIntentions_iefGA.xml
cd /tmp
sudo tar xvfz /tmp/ENOVIAIntegrationExchangeFramework-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/ENOVIAIntegrationExchangeFramework-V6R2022x.Linux64.tar.gz
sudo /tmp/ENOVIAIntegrationExchangeFramework.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/UserIntentions_iefGA.xml
sudo rm -f -R /tmp/ENOVIAIntegrationExchangeFramework.Linux64
### 4 Enterprise Change Management
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Webapps/ENOVIAEnterpriseChangeManagement-V6R2022x.Linux64.tar.gz /tmp/ENOVIAEnterpriseChangeManagement-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_ecMgtGA.xml /tmp/UserIntentions_ecMgtGA.xml
cd /tmp
sudo tar xvfz /tmp/ENOVIAEnterpriseChangeManagement-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/ENOVIAEnterpriseChangeManagement-V6R2022x.Linux64.tar.gz
sudo /tmp/ENOVIAEnterpriseChangeManagement.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/UserIntentions_ecMgtGA.xml
sudo rm -f -R /tmp/ENOVIAEnterpriseChangeManagement.Linux64
### 5 MSF
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_msfGA.xml /tmp/UserIntentions_msfGA.xml
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Webapps/ENOVIACollaborationforMicrosoftServer-V6R2022x.Linux64.tar.gz /tmp/ENOVIACollaborationforMicrosoftServer-V6R2022x.Linux64.tar.gz
cd /tmp
sudo tar xvfz /tmp/ENOVIACollaborationforMicrosoftServer-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/ENOVIACollaborationforMicrosoftServer-V6R2022x.Linux64.tar.gz
sudo /tmp/ENOVIACollaborationforMicrosoftServer.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/UserIntentions_msfGA.xml
sudo rm -f -R /tmp/ENOVIACollaborationforMicrosoftServer.Linux64
### 6 UnifiedX-CAD
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_unifiedxcadGA.xml /tmp/UserIntentions_unifiedxcadGA.xml
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Webapps/ENOVIAUnifiedX-CADDesignManagement-V6R2022x.Linux64.tar.gz /tmp/ENOVIAUnifiedX-CADDesignManagement-V6R2022x.Linux64.tar.gz
cd /tmp
sudo tar xvfz /tmp/ENOVIAUnifiedX-CADDesignManagement-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/ENOVIAUnifiedX-CADDesignManagement-V6R2022x.Linux64.tar.gz
sudo /tmp/ENOVIAUnifiedX-CADDesignManagement.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/UserIntentions_unifiedxcadGA.xml
sudo rm -f -R /tmp/ENOVIAUnifiedX-CADDesignManagement.Linux64
### 7 Requirement central
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_requirementMgtGA.xml /tmp/UserIntentions_requirementMgtGA.xml
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Webapps/ENOVIATraceableRequirementsManagementFoundation-V6R2022x.Linux64.tar.gz /tmp/ENOVIATraceableRequirementsManagementFoundation-V6R2022x.Linux64.tar.gz
cd /tmp
sudo tar xvfz /tmp/ENOVIATraceableRequirementsManagementFoundation-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/ENOVIATraceableRequirementsManagementFoundation-V6R2022x.Linux64.tar.gz
sudo /tmp/ENOVIATraceableRequirementsManagementFoundation.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/UserIntentions_requirementMgtGA.xml
sudo rm -f -R /tmp/ENOVIATraceableRequirementsManagementFoundation.Linux64
### 8 Program central
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_progcentralGA.xml /tmp/UserIntentions_progcentralGA.xml
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Webapps/ENOVIAProjectManagementFoundation-V6R2022x.Linux64.tar.gz /tmp/ENOVIAProjectManagementFoundation-V6R2022x.Linux64.tar.gz
cd /tmp
sudo tar xvfz /tmp/ENOVIAProjectManagementFoundation-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/ENOVIAProjectManagementFoundation-V6R2022x.Linux64.tar.gz
sudo /tmp/ENOVIAProjectManagementFoundation.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/UserIntentions_progcentralGA.xml
sudo rm -f -R /tmp/ENOVIAProjectManagementFoundation.Linux64
### 9 Document Management
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_documentMgtGA.xml /tmp/UserIntentions_documentMgtGA.xml
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Webapps/ENOVIADocumentManagement-V6R2022x.Linux64.tar.gz /tmp/ENOVIADocumentManagement-V6R2022x.Linux64.tar.gz
cd /tmp
sudo tar xvfz /tmp/ENOVIADocumentManagement-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/ENOVIADocumentManagement-V6R2022x.Linux64.tar.gz
sudo /tmp/ENOVIADocumentManagement.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/UserIntentions_documentMgtGA.xml
sudo rm -f -R /tmp/ENOVIADocumentManagement.Linux64
### 10 engineering central
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_engcentralGA.xml /tmp/UserIntentions_engcentralGA.xml
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Webapps/ENOVIAEngineeringBOMManagementFoundation-V6R2022x.Linux64.tar.gz /tmp/ENOVIAEngineeringBOMManagementFoundation-V6R2022x.Linux64.tar.gz
cd /tmp
sudo tar xvfz /tmp/ENOVIAEngineeringBOMManagementFoundation-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/ENOVIAEngineeringBOMManagementFoundation-V6R2022x.Linux64.tar.gz
sudo /tmp/ENOVIAEngineeringBOMManagementFoundation.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/UserIntentions_engcentralGA.xml
sudo rm -f -R /tmp/ENOVIAEngineeringBOMManagementFoundation.Linux64
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 9080
sudo semanage port -a -t http_port_t -p tcp 8070
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo echo "spaceInstall.sh ended" >>/tmp/spaceInstall.log
