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
    }

    post {
        success {
            echo 'ALL BACKEND TESTS PASSED'
            echo 'JENKINS BUILD SUCCESSFUL'
        }

        failure {
            echo 'JENKINS PIPELINE FAILED'
            echo 'Check the Console Output for the first error.'
        }

        always {
            echo 'Jenkins Pipeline execution completed.'
        }
    }
}
