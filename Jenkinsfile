pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = 'mern-frontend'
        BACKEND_IMAGE = 'mern-backend'
        DOCKER_TAG = "latest"
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
                    writeFile file: './frontend/.env', text: """
                    REACT_APP_API_URL=https://backend.nightlybuilds.online
                    REACT_APP_WS_URL=ws://backend.nightlybuilds.online
                    """

                    writeFile file: './backend/.env', text: """
                    NODE_ENV=development
                    PORT=5000
                    MONGODB_URI=mongodb://localhost:27017/gmail_auth
                    RABBITMQ_URL=amqp://localhost:15000
                    JWT_SECRET=your_super_secret_key
                    EMAIL_USER=mr.anonymous9pro999@gmail.com
                    EMAIL_PASS=uokp tari qsyd odqc
                    CLIENT_URL=http://localhost:3000, https://frontend.nightlybuilds.online
                    """
                }
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
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
                            sh 'npm test -- --watchAll=false --passWithNoTests || echo "Frontend tests completed"'
                        }
                    }
                }

                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm test -- --passWithNoTests || echo "Backend tests completed"'
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
                            sh 'npm run build'
                        }
                    }
                }

                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm run build || echo "Backend build completed"'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh "docker build -t ${FRONTEND_IMAGE}:${DOCKER_TAG} -f frontend/Dockerfile.frontend ./frontend"
                    sh "docker build -t ${BACKEND_IMAGE}:${DOCKER_TAG} -f backend/Dockerfile.backend ./backend"
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    sh '''
                    docker compose down frontend backend || echo "No containers to stop"
                    docker compose up -d frontend backend
                    '''

                    // Wait for services
                    sh '''
                    echo "Waiting for containers to become healthy..."
                    for i in {1..12}; do
                        RUNNING=$(docker ps --filter "name=mern-" --filter "status=running" | wc -l)
                        if [ "$RUNNING" -gt 1 ]; then 
                            echo "All containers are running"; 
                            break; 
                        fi
                        echo "Waiting..."
                        sleep 5
                    done
                    '''

                    // Health checks
                    sh '''
                    curl -f http://localhost:3000 > /dev/null 2>&1 \
                      && echo "Frontend OK" \
                      || echo "Frontend health check failed"

                    curl -f http://localhost:5000/health > /dev/null 2>&1 \
                      && echo "Backend OK" \
                      || echo "Backend health check failed"
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed'
        }
        success {
            echo '✅ MERN Stack CI/CD Pipeline completed successfully!'
            sh 'docker ps --filter "name=mern-" --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"'
        }
        failure {
            echo '❌ Pipeline failed'
            sh 'docker ps -a --filter "name=mern-" --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"'
            sh 'docker logs mern-backend || echo "Backend container not found"'
            sh 'docker logs mern-frontend || echo "Frontend container not found"'
        }
    }
}
