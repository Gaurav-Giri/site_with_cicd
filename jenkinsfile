// pipeline {
//     agent any


//     environment {
//         DOCKER_IMAGE = 'frontend-react-app'
//     }

//     stages {
//         stage('Checkout Code') {
//             steps {
//                 // You can safely use checkout scm (uses main automatically)
//                 checkout scm
//             }
//         }

//         stage('Install Dependencies') {
//             steps {
//                 bat 'npm install'
//             }
//         }

//         stage('Build React App') {
//             steps {
//                 bat 'npm run build'
//             }
//         }

//         stage('Build Docker Image') {
//             steps {
//                 bat 'docker build -t %DOCKER_IMAGE% .'
//             }
//         }

//         stage('Run Docker Container') {
//             steps {
//                 // Stop old container if running
//                 bat '''
//                 docker stop frontend-container || true
//                 docker rm frontend-container || true
//                 docker run -d -p 3000:80 --name frontend-container %DOCKER_IMAGE%
//                 '''
//             }
//         }
//     }

//     post {
//         success {
//             echo '✅ Build and deployment successful!'
//         }
//         failure {
//             echo '❌ Build failed. Check logs.'
//         }
//     }
// }


// -------------------modified jenkinsfile----------------------



pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'your-docker-registry' // e.g., Docker Hub, AWS ECR
        FRONTEND_IMAGE = 'mern-frontend'
        BACKEND_IMAGE = 'mern-backend'
        DOCKER_NAMESPACE = 'your-namespace'
        DOCKER_TAG = "${env.BUILD_ID}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    // Create .env files if needed
                    writeFile file: './frontend/.env', text: """
                    REACT_APP_API_URL=http://localhost:5000
                    REACT_APP_WS_URL=http://localhost:5000
                    """
                    
                    writeFile file: './backend/.env', text: """
                    NODE_ENV=production
                    PORT=5000
                    MONGO_URI=mongodb://localhost:27017/gmail_auth
                    RABBITMQ_URL=amqp://rabbitmq:5672
                    JWT_SECRET=your_super_secret_key
                    CLIENT_URL=http://localhost:3000
                    """
                }
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            bat 'npm install'
                        }
                    }
                }
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            bat 'npm install'
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            bat 'npm test -- --watchAll=false --coverage --passWithNoTests'
                        }
                    }
                }
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            bat 'npm test -- --passWithNoTests'
                        }
                    }
                }
            }
        }

        stage('Build Applications') {
            parallel {
                stage('Build React App') {
                    steps {
                        dir('frontend') {
                            bat 'npm run build'
                        }
                    }
                }
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            bat 'npm run build' // If you have a build script for backend
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend Image') {
                    steps {
                        script {
                            bat "docker build -t ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${FRONTEND_IMAGE}:${DOCKER_TAG} -f frontend/Dockerfile.frontend ."
                        }
                    }
                }
                stage('Build Backend Image') {
                    steps {
                        script {
                            bat "docker build -t ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${BACKEND_IMAGE}:${DOCKER_TAG} -f backend/Dockerfile.backend ."
                        }
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    // Login to Docker registry (you'll need to set up credentials in Jenkins)
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat "echo %DOCKER_PASS% | docker login %DOCKER_REGISTRY% -u %DOCKER_USER% --password-stdin"
                    }
                    
                    bat "docker push ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${FRONTEND_IMAGE}:${DOCKER_TAG}"
                    bat "docker push ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${BACKEND_IMAGE}:${DOCKER_TAG}"
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                script {
                    // Deploy using docker-compose or your orchestration tool
                    bat 'docker-compose -f docker-compose.staging.yml down'
                    bat 'docker-compose -f docker-compose.staging.yml up -d'
                    
                    // Health checks
                    bat 'timeout 30 bash -c "while ! curl -f http://localhost:3000 >/dev/null 2>&1; do sleep 2; done" || exit 1'
                    bat 'timeout 30 bash -c "while ! curl -f http://localhost:5000/health >/dev/null 2>&1; do sleep 2; done" || exit 1'
                }
            }
        }
    }

    post {
        always {
            // Clean up
            bat 'docker system prune -f'
            cleanWs()
        }
        success {
            echo '✅ MERN Stack CI/CD Pipeline completed successfully!'
            // Optional: Send notification to Slack/Teams/etc.
        }
        failure {
            echo '❌ Pipeline failed. Check logs for details.'
            // Optional: Send failure notification
        }
    }
}
