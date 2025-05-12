Installation
Clone the repository:
git clone https://github.com/yassine995341/final_cloud_projet.git
Navigate to the project directory:
  cd projet_cloude

1)Install dependencies for the backend:
        cd backend
        npm install dotenv
        npm install
2)Install dependencies for the frontend:
        cd ../frontend
        npm install
  3) create a file name ".env" and paste  this 
          DB_HOST=localhost
          DB_USER=root
          DB_PASSWORD=0000
          DB_NAME=book_collection
          JWT_SECRET=your-secret-key
          PORT=3001
          GOOGLE_BOOKS_API_KEY=AIzaSyB6bS2_14SXsyGF_3sUjG-tBtjp7ld0554
    and put this file in backend folder
                                    usage
1)Start the backend server:
    cd backend
    npm start
2)Start the frontend server:
      cd frontend
      npm start
3)Open your browser and go to http://localhost:3000 to view the application.
