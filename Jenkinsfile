pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    environment {

        SCANNER_HOME = tool 'sonar-scanner'

        IMAGE_NAME = "quiz-app"
        IMAGE_TAG  = "latest"

        NEXUS_URL  = "16.16.177.176:8082"
        REPO_NAME  = "docker-hosted"

        SONAR_TOKEN = credentials('sonar-token')
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/vivekkumar1611/quiz16.js.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            steps {

                withSonarQubeEnv('sonar-server') {

                    sh """
                    ${SCANNER_HOME}/bin/sonar-scanner \
                    -Dsonar.projectKey=quiz16 \
                    -Dsonar.projectName=quiz16 \
                    -Dsonar.sources=. \
                    -Dsonar.login=${SONAR_TOKEN}
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {

                sh """
                docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                """
            }
        }

        stage('Tag Docker Image') {
            steps {

                sh """
                docker tag ${IMAGE_NAME}:${IMAGE_TAG} \
                ${NEXUS_URL}/${REPO_NAME}/${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        stage('Push Docker Image to Nexus') {
            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'nexus-creds',
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {

                    sh """
                    echo "${NEXUS_PASS}" | docker login ${NEXUS_URL} \
                    -u ${NEXUS_USER} --password-stdin

                    docker push \
                    ${NEXUS_URL}/${REPO_NAME}/${IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Deploy Using Ansible') {
            steps {

                sh """
                cd /var/jenkins_home/ansible-project

                ansible-playbook -i inventory deploy.yml
                """
            }
        }
    }

    post {

        success {
            echo 'CI/CD Pipeline Executed Successfully!'
        }

        failure {
            echo 'Pipeline Failed!'
        }
    }
}
