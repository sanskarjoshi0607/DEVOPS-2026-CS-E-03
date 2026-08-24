pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                bat 'node test.js'
            }
        }

    }

    post {
        success {
            echo 'All Quiz App tests passed!'
        }

        failure {
            echo 'Quiz App tests failed!'
        }
    }
}