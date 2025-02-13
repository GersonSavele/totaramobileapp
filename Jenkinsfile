// This pipeline only runs local pre-build steps,
// the actual build will be executed on Expo infrastructure.

pipeline {
    // Set the Node image used for the run
    agent {
        docker {
            image 'node:lts-alpine'
        }
    }

    options {
        ansiColor('xterm')
    }

    // Set the environment variables for the job
    // These are pretty much just used to tell EAS which app variant to build
    parameters {
        // TODO: Replace these with actual environments used by Totara
        // Select an environment. This also affects which build type is generated:
        // - `dev` will create an ad-hoc internal distribution build for internal testing
        // - `uat` will create a TestFlight/Internal testing build for wider testing
        // - `prod` will create a AppStore/Play Store compatible build for public distribution
        choice(name: 'APP_ENV', choices: ['dev', 'uat', 'prod'], description: "The environment that the app will be pointing to")
        string(name: 'GIT_REF', description: 'Commit, branch, or tag to run the build from')
    }

    
    environment {
        APP_ENV = "${params.APP_ENV}"
        GIT_REF = "${params.GIT_REF}"
        EXPO_TOKEN = "EXPO_TOKEN"
        NPM_CONFIG_PREFIX = "${env.WORKSPACE}/.npm-global"  
        PATH = "${env.PATH}:${env.WORKSPACE}/.npm-global/bin" 
    }

   stages {
      stage('Checkout code') {
        when {
            expression { return params.GIT_REF != null && params.GIT_REF != '' }
        }
        steps {
            echo "Git reference: ${params.GIT_REF}"
            checkout([
                $class: 'GitSCM', 
                branches: [[name: "origin/${params.GIT_REF}"]], 
                doGenerateSubmoduleConfigurations: false, 
                extensions: [], 
                submoduleCfg: []
            ])
          }
        }

        stage('Install dependencies') {
            steps {
                script {
                    dir('totara-mobile-app') {
                        sh 'npm ci'
                        sh 'npm install -g eas-cli'
                    }
                }
            }
        }

        stage('Run lint checks') {
            steps {
                script {
                    dir('totara-mobile-app') {
                        // Failing lint checks will not fail the build for now
                        // TODO: Make this step required once we've sorted out all the lint issues
                        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                            sh 'npm run lint'
                        }
                    }
                }
            }
        }
        
        stage('Run type checks') {
            steps {
                script {
                    dir('totara-mobile-app') {
                        // Failing type checks will not fail the build for now
                        // TODO: Make this step required once we've sorted out all the type issues
                        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                            sh 'npm run lint:types'
                        }
                    }
                }
            }
        }
        stage('Run unit tests') {
            steps {
                script {
                    dir('totara-mobile-app') {
                        sh 'npm run test:ci'
                    }
                }
            }
        }

        stage('Start build in EAS') {
            steps {
                script {
                    dir('totara-mobile-app') {
                        withCredentials([string(credentialsId: 'EAS_ACCESS_TOKEN', variable: 'EXPO_TOKEN')]) {
                            // TODO: Uncomment when we're happy to run builds on each PR
                            // sh "EAS_BUILD=1 EAS_NO_VCS=1 npm run eas:build:${APP_ENV}"
                        }
                    }
                }
            }
        }
    }
}
