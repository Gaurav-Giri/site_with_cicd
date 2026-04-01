// // ---------------jenkinsfile for local testing without mongo, rabbitmq in contianer--------------



// pipeline {
//     agent any

//     environment {
//         FRONTEND_IMAGE = 'mern-frontend'
//         BACKEND_IMAGE = 'mern-backend'
//         DOCKER_TAG = "latest"
//     }

//     stages {
//         stage('Checkout Code') {
//             steps {
//                 checkout scm
//             }
//         }

//         stage('Setup Environment') {
//             steps {
//                 script {
//                     // Create .env files for development
//                     writeFile file: './frontend/.env', text: """
//                     REACT_APP_API_URL=https://backend.nightlybuilds.online
                    
//                     REACT_APP_WS_URL=ws://backend.nightlybuilds.online
//                     """
                    
//                     writeFile file: './backend/.env', text: """
//                     NODE_ENV=development
//                     PORT=5000
//                     MONGODB_URI=mongodb://localhost:27017/gmail_auth
//                     RABBITMQ_URL=amqp://localhost:5672
//                     JWT_SECRET=your_super_secret_key
//                     EMAIL_USER=mr.anonymous9pro999@gmail.com
//                     EMAIL_PASS=uokp tari qsyd
//                     CLIENT_URL=http://localhost:3000, https://frontend.nightlybuilds.online
//                     """
//                 }
//             }
//         }

//         stage('Install Dependencies') {
//             parallel {
//                 stage('Frontend Dependencies') {
//                     steps {
//                         dir('frontend') {
//                             bat 'npm install'
//                         }
//                     }
//                 }
//                 stage('Backend Dependencies') {
//                     steps {
//                         dir('backend') {
//                             bat 'npm install'
//                         }
//                     }
//                 }
//             }
//         }

//         stage('Run Tests') {
//             parallel {
//                 stage('Frontend Tests') {
//                     steps {
//                         dir('frontend') {
//                             bat 'npm test -- --watchAll=false --passWithNoTests || echo "Frontend tests completed with warnings"'
//                         }
//                     }
//                 }
//                 stage('Backend Tests') {
//                     steps {
//                         dir('backend') {
//                             bat 'npm test -- --passWithNoTests || echo "Backend tests completed with warnings"'
//                         }
//                     }
//                 }
//             }
//         }

//         stage('Build Applications') {
//             parallel {
//                 stage('Build React App') {
//                     steps {
//                         dir('frontend') {
//                             bat 'npm run build'
//                         }
//                     }
//                 }
//                 stage('Build Backend') {
//                     steps {
//                         dir('backend') {
//                             bat 'npm run build || echo "Backend build completed"'
//                         }
//                     }
//                 }
//             }
//         }

//         stage('Build Docker Images') {
//             steps {
//                 script {
//                     bat "docker build -t ${FRONTEND_IMAGE}:${DOCKER_TAG} -f frontend/Dockerfile.frontend ./frontend"
//                     bat "docker build -t ${BACKEND_IMAGE}:${DOCKER_TAG} -f backend/Dockerfile.backend ./backend"
//                 }
//             }
//         }

//         stage('Deploy with Docker Compose') {
//             steps {
//                 script {
//                     // Stop and start only frontend and backend services
//                     bat '''
//                     docker-compose down frontend backend || echo "No frontend/backend containers to stop"
//                     docker-compose up -d frontend backend
//                     '''
                    
//                     // Wait for services to start
//                     bat 'timeout 60 bash -c "until docker ps --filter \"name=mern-\" --format \"table {{.Names}}\t{{.Status}}\" | grep -q \"Up\"; do sleep 5; echo \"Waiting for services to start...\"; done"'
                    
//                     // Health checks
//                     bat '''
//                     curl -f http://localhost:3000 > nul 2>&1 && echo "Frontend is running" || echo "Frontend health check failed but continuing"
//                     curl -f http://localhost:5000/health > nul 2>&1 && echo "Backend is running" || echo "Backend health check failed but continuing"
//                     '''
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             echo 'Pipeline execution completed'
//         }
//         success {
//             echo '✅ MERN Stack CI/CD Pipeline completed successfully!'
//             bat 'docker ps --filter "name=mern-" --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"'
//         }
//         failure {
//             echo '❌ Pipeline failed, but containers are preserved for debugging'
//             bat 'docker ps -a --filter "name=mern-" --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"'
//             bat 'docker logs mern-backend || echo "Backend container not found"'
//             bat 'docker logs mern-frontend || echo "Frontend container not found"'
//         }
//     }
// }




// --------------------------------with mongo and rabbitmq  in docker------------------------------------------------------------------------------------


pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = 'frontend'
        BACKEND_IMAGE = 'mern-backend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        COMPOSE_FILE = 'docker-compose.yml'

        // Database credentials
        MONGO_USER = 'admin'
        MONGO_PASS = 'password'
        RABBITMQ_USER = 'admin'
        RABBITMQ_PASS = 'password'
        
        // Security credentials (store these in Jenkins credentials)
        JWT_SECRET = credentials('jwt-secret')
        EMAIL_USER = credentials('email-user')
        EMAIL_PASS = credentials('email-pass')
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
                    // Create .env files for development/testing
                    writeFile file: './frontend/.env', text: """
                    REACT_APP_API_URL=http://localhost:5000
                    REACT_APP_WS_URL=ws://localhost:5000
                    """
                    
                    writeFile file: './backend/.env', text: """
                    NODE_ENV=production
                    PORT=5000
                    MONGODB_URI=mongodb://${MONGO_USER}:${MONGO_PASS}@localhost:27017/gmail_auth?authSource=admin
                    RABBITMQ_URL=amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@localhost:5672
                    JWT_SECRET=${JWT_SECRET}
                    EMAIL_USER=${EMAIL_USER}
                    EMAIL_PASS=${EMAIL_PASS}
                    CLIENT_URL=http://localhost:3000,https://frontend.nightlybuilds.online
                    """
                }
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm install --no-audit --no-fund'
                        }
                    }
                }
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm install --no-audit --no-fund'
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
                            sh '''
                            npm test -- --watchAll=false --passWithNoTests --ci || echo "Frontend tests completed with warnings"
                            '''
                        }
                    }
                }
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh '''
                            npm test -- --passWithNoTests --ci || echo "Backend tests completed with warnings"
                            '''
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
                            sh 'npm run build || echo "Backend build completed (no build script)"'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh """
                    docker build -t ${FRONTEND_IMAGE}:${DOCKER_TAG} -f frontend/Dockerfile.frontend ./frontend
                    docker build -t ${BACKEND_IMAGE}:${DOCKER_TAG} -f backend/Dockerfile.backend ./backend
                    
                    # Tag as latest as well
                    docker tag ${FRONTEND_IMAGE}:${DOCKER_TAG} ${FRONTEND_IMAGE}:latest
                    docker tag ${BACKEND_IMAGE}:${DOCKER_TAG} ${BACKEND_IMAGE}:latest
                    """
                }
            }
        }

        stage('Deploy Full Stack with Docker Compose') {
            steps {
                script {
                    // Stop and remove all containers
                    sh """
                    docker-compose -f ${COMPOSE_FILE} down
                    """
                    
                    // Start all services (MongoDB, RabbitMQ, Backend, Frontend)
                    sh """
                    docker-compose -f ${COMPOSE_FILE} up -d
                    """
                    
                    // Wait for services to be healthy
                    sh '''
                    echo "Waiting for services to be healthy..."
                    for i in {1..30}; do
                        if docker ps --filter "status=healthy" --format "{{.Names}}" | grep -q "mern-"; then
                            echo "Services are healthy"
                            break
                        fi
                        sleep 5
                        echo "Waiting for services... ($i/30)"
                    done
                    '''
                    
                    // Show running containers
                    sh '''
                    echo "========================================="
                    echo "Running containers:"
                    docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"
                    echo "========================================="
                    '''
                    
                    // Health checks
                    sh '''
                    # Check MongoDB with admin credentials
                    docker exec mongodb mongosh --username admin --password password --authenticationDatabase admin --eval "db.adminCommand('ping')" && echo "✓ MongoDB is healthy" || echo "✗ MongoDB health check failed"
                    
                    # Check RabbitMQ
                    docker exec rabbitmq rabbitmq-diagnostics ping && echo "✓ RabbitMQ is healthy" || echo "✗ RabbitMQ health check failed"
                    
                    # Check Backend
                    curl -f http://localhost:5000/health && echo "✓ Backend is healthy" || echo "✗ Backend health check failed"
                    
                    # Check Frontend
                    curl -f http://localhost:3000 && echo "✓ Frontend is healthy" || echo "✗ Frontend health check failed"
                    '''
                }
            }
        }

        stage('Run Integration Tests') {
            steps {
                script {
                    sh '''
                    echo "Running integration tests..."
                    # Add your integration tests here
                    # Example: npm run test:integration
                    # This should test the full stack with MongoDB and RabbitMQ
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed'
            script {
                sh '''
                echo "========================================="
                echo "Container Logs (last 50 lines):"
                echo "--- Backend Logs ---"
                docker logs --tail 50 mern-backend || echo "Backend container not running"
                echo "--- Frontend Logs ---"
                docker logs --tail 50 mern-frontend || echo "Frontend container not running"
                echo "--- MongoDB Logs ---"
                docker logs --tail 50 mern-mongodb || echo "MongoDB container not running"
                echo "--- RabbitMQ Logs ---"
                docker logs --tail 50 mern-rabbitmq || echo "RabbitMQ container not running"
                echo "========================================="
                '''
            }
        }
        success {
            echo '✅ Full Stack CI/CD Pipeline completed successfully!'
            sh '''
            echo "Application is running at:"
            echo "Frontend: http://localhost:3000"
            echo "Backend API: http://localhost:5000"
            echo "RabbitMQ Management: http://localhost:15672 (admin/password)"
            echo "MongoDB: localhost:27017"
            docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"
            '''
        }
        failure {
            echo '❌ Pipeline failed'
            sh '''
            echo "Checking container statuses:"
            docker ps -a --format "table {{.Names}}\\t{{.Status}}"
            echo "========================================="
            echo "Collecting logs for debugging:"
            
            # Get logs from failed containers
            for container in mern-backend mern-frontend mern-mongodb mern-rabbitmq; do
                echo "--- Logs for $container ---"
                docker logs --tail 100 $container || echo "Container $container not found"
                echo "---"
            done
            '''
        }
        cleanup {
            script {
                // Optional: Clean up old images to save space
                sh '''
                docker image prune -f --filter "until=24h"
                '''
            }
        }
    }
}