from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from auth import login  
from models import connection

main_routes = Blueprint('main_routes', __name__)

@main_routes.route('/login', methods=['POST'])
def login_route():
    return login()

@main_routes.route('/inventory', methods=['GET'])
@jwt_required()
def get_inventory():
    username = get_jwt_identity()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM food_items WHERE created_by = (SELECT id FROM users WHERE username = :username)
    """, {"username": username})
    items = cursor.fetchall()

    inventory = [{"id": item[0], "name": item[1], "quantity": item[2], "unit": item[3]} for item in items]

    return jsonify(inventory), 200

@main_routes.route('/inventory', methods=['POST'])
@jwt_required()
def add_inventory():
    username = get_jwt_identity()
    role = request.headers.get('Role')  
    if role != 'owner':
        return jsonify({"msg": "Unauthorized"}), 403

    data = request.json
    try:
        # Insert the new food item into the database
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO food_items (name, quantity, unit, created_by)
            VALUES (:name, :quantity, :unit, (SELECT id FROM users WHERE username = :username))
        """, {"name": data["name"], "quantity": data["quantity"], "unit": data["unit"], "username": username})

        connection.commit()

        # Get the ID of the newly inserted food item (using LAST_INSERT_ID for MySQL)
    

        # Return the new item details as a response
        return jsonify({
            "id": cursor.lastrowid,
            "name": data["name"],
            "quantity": data["quantity"],
            "unit": data["unit"]
        }), 201

    except Exception as e:
        # If an error occurs, handle the exception and send an error response
        connection.rollback()
        return jsonify({"msg": "Error adding item", "error": str(e)}), 500
