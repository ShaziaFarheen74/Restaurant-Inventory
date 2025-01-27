from flask import Flask, request, jsonify
import jwt
import datetime
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, create_refresh_token
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = '12345678910' 
app.config['JWT_SECRET_KEY'] = 'ac8d2712f1267d0650b048e3675ba0dcf2698dcb58145bdf96dba16de08f3014'  
jwt = JWTManager(app) 
CORS(app, origins="http://localhost:3000")  

users = {
    "owner@restaurant.com": {"password": "owner123", "role": "owner"},
    "manager@restaurant.com": {"password": "manager123", "role": "manager"},
}

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')


    user = users.get(username)

    if user and user['password'] == password:
        
        access_token = create_access_token(identity=username, fresh=True, expires_delta=datetime.timedelta(hours=1))
        refresh_token = create_refresh_token(identity=username, expires_delta=datetime.timedelta(days=7))

        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'role': user['role']
        }), 200 

    return jsonify({'message': 'Invalid credentials'}), 401  

if __name__ == "__main__":
    app.run(debug=True)
