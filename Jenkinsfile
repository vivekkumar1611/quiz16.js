pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        IMAGE_NAME = "quiz-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Clone Repository') {
            steps {
                git 'https://github.com/vivekkumar1611/quiz16.js.git'
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
                    sh '''
                    $SCANNER_HOME/bin/sonar-scanner \
                    -Dsonar.projectKey=quiz16 \
                    -Dsonar.projectName=quiz16 \
                    -Dsonar.sources=. \
                    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t quiz-app:${BUILD_NUMBER} .'
            }
        }

        stage('Push Artifact to Nexus') {
            steps {
                sh '''
                docker tag quiz-app:${BUILD_NUMBER} \
                PUBLIC-IP:8082/repository/docker-hosted/quiz-app:${BUILD_NUMBER}

                docker login PUBLIC-IP:8082 -u admin -p admin123

                docker push PUBLIC-IP:8082/repository/docker-hosted/quiz-app:${BUILD_NUMBER}
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                docker stop quiz-app || true
                docker rm quiz-app || true

                docker run -d \
                --name quiz-app \
                -p 3000:3000 \
                quiz-app:${BUILD_NUMBER}
                '''
            }
        }
    }
}
