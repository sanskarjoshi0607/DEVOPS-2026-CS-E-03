pipeline {
    agent any

    stages {

        stage('Verify Files') {
            steps {
                bat '''
                echo ================================
                echo WORKSPACE
                echo ================================
                cd

                echo ================================
                echo PROJECT FILES
                echo ================================
                dir

                echo ================================
                echo CHECKING REQUIRED FILES
                echo ================================

                if not exist index.html exit /b 1
                if not exist style.css exit /b 1
                if not exist script.js exit /b 1
                if not exist server.js exit /b 1
                if not exist test.js exit /b 1

                echo All required files are present.
                '''
            }
        }


        stage('Run Tests') {
            steps {
                bat '''
                echo ================================
                echo RUNNING QUIZ APP TESTS
                echo ================================

                node test.js
                '''
            }
        }

    }


    post {

        success {
            echo '================================'
            echo 'QUIZ APP TESTS PASSED'
            echo 'JENKINS BUILD SUCCESSFUL'
            echo '================================'
        }

        failure {
            echo '================================'
            echo 'QUIZ APP TESTS FAILED'
            echo 'JENKINS BUILD FAILED'
            echo '================================'
        }

        always {
            echo 'Jenkins Pipeline execution completed.'
        }

    }
}