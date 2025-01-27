from flask import Flask 
from flask_jwt_extended import JWTManager
from routes import main_routes
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)  
app.config['JWT_SECRET_KEY'] = 'ac8d2712f1267d0650b048e3675ba0dcf2698dcb58145bdf96dba16de08f3014'  
jwt = JWTManager(app)

app.register_blueprint(main_routes)

if __name__ == '__main__':
    app.run(debug=True)
