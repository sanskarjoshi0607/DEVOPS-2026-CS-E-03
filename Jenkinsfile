
pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Using the checked-out DevOps repository'
                bat 'git status'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('Quiz_Project') {
                    bat '''
                        echo Installing root dependencies...
                        npm install

                        echo Installing backend dependencies...
                        npm run install:backend

                        echo Installing frontend dependencies...
                        npm run install:frontend
                    '''
                }
            }
        }

        stage('Verify Project Structure') {
            steps {
                bat '''
                    if not exist "Quiz_Project\\package.json" exit /b 1
                    if not exist "Quiz_Project\\backend\\package.json" exit /b 1
                    if not exist "Quiz_Project\\frontend\\package.json" exit /b 1
                    if not exist "Quiz_Project\\backend\\server.js" exit /b 1

                    echo MERN project files verified successfully.
                '''
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('Quiz_Project') {
                    bat '''
                        echo Running backend integration tests...
                        npm test
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'QUIZ PROJECT TESTS PASSED'
            echo 'JENKINS BUILD SUCCESSFUL'
        }

        failure {
            echo 'QUIZ PROJECT PIPELINE FAILED'
            echo 'Check the stage logs for details.'
        }

        always {
            echo 'Jenkins Pipeline execution completed.'
        }
    }
}
