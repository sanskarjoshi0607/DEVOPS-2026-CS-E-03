pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Using the checked-out DevOps repository'

                bat '''
                    git status
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('Quiz_Project') {
                    bat '''
                        echo Installing root dependencies...
                        call npm install
                        if errorlevel 1 exit /b 1

                        echo Installing backend dependencies...
                        call npm --prefix backend install
                        if errorlevel 1 exit /b 1

                        echo Installing frontend dependencies...
                        call npm --prefix frontend install
                        if errorlevel 1 exit /b 1

                        echo All dependencies installed successfully.
                    '''
                }
            }
        }

        stage('Verify Project Structure') {
            steps {
                bat '''
                    if not exist "Quiz_Project\\package.json" (
                        echo ERROR: Root package.json not found.
                        exit /b 1
                    )

                    if not exist "Quiz_Project\\backend\\package.json" (
                        echo ERROR: Backend package.json not found.
                        exit /b 1
                    )

                    if not exist "Quiz_Project\\frontend\\package.json" (
                        echo ERROR: Frontend package.json not found.
                        exit /b 1
                    )

                    if not exist "Quiz_Project\\backend\\server.js" (
                        echo ERROR: Backend server.js not found.
                        exit /b 1
                    )

                    if not exist "Quiz_Project\\backend\\test-integration.js" (
                        echo ERROR: Backend integration test file not found.
                        exit /b 1
                    )

                    echo MERN project structure verified successfully.
                '''
            }
        }

        stage('Check Kubernetes Access') {
            steps {
                withEnv(['KUBECONFIG=C:\\ProgramData\\Jenkins\\.jenkins\\.kube\\config']) {
                    bat '''
                        echo Checking Kubernetes context...
                        kubectl config current-context
                        if errorlevel 1 exit /b 1

                        echo Checking Kubernetes nodes...
                        kubectl get nodes
                        if errorlevel 1 exit /b 1

                        echo Checking application deployments...
                        kubectl get deployments
                        if errorlevel 1 exit /b 1
                    '''
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('Quiz_Project') {
                    bat '''
                        echo Running backend integration tests...
                        call npm test
                        if errorlevel 1 exit /b 1
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                dir('Quiz_Project') {
                    bat '''
                        echo Building backend image...
                        docker build -t quiz-backend:latest ./backend
                        if errorlevel 1 exit /b 1

                        echo Building frontend image...
                        docker build --no-cache -t quiz-frontend:latest ./frontend
                        if errorlevel 1 exit /b 1

                        echo Docker images built successfully.
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withEnv(['KUBECONFIG=C:\\ProgramData\\Jenkins\\.jenkins\\.kube\\config']) {
                    bat '''
                        echo Updating backend deployment...
                        kubectl set image deployment/backend backend=quiz-backend:latest
                        if errorlevel 1 exit /b 1

                        echo Updating frontend deployment...
                        kubectl set image deployment/frontend frontend=quiz-frontend:latest
                        if errorlevel 1 exit /b 1

                        echo Waiting for backend rollout...
                        kubectl rollout status deployment/backend --timeout=180s
                        if errorlevel 1 exit /b 1

                        echo Waiting for frontend rollout...
                        kubectl rollout status deployment/frontend --timeout=180s
                        if errorlevel 1 exit /b 1

                        echo Kubernetes deployments:
                        kubectl get deployments
                        if errorlevel 1 exit /b 1

                        echo Kubernetes deployment completed successfully.
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'ALL BACKEND TESTS PASSED'
            echo 'DOCKER IMAGES BUILT SUCCESSFULLY'
            echo 'KUBERNETES DEPLOYMENT SUCCESSFUL'
        }

        failure {
            echo 'JENKINS PIPELINE FAILED'
            echo 'Check Console Output for the first error.'
            echo 'Render deployment was not modified by this pipeline.'
        }

        always {
            echo 'Jenkins Pipeline execution completed.'
        }
    }
}