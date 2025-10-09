from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import joblib
import os
from random import uniform, randint, choice
from dotenv import load_dotenv

# ------------------------------
# Load environment variables
# ------------------------------
load_dotenv()  # Load .env file if present
mongo_uri = os.environ.get("MONGO_URI")  # Example: mongodb+srv://user:pass@cluster.mongodb.net/dbname

if not mongo_uri:
    raise ValueError("❌ MONGO_URI environment variable is not set!")

# ------------------------------
# Flask setup
# ------------------------------
app = Flask(__name__)
CORS(app)

# ------------------------------
# MongoDB connection
# ------------------------------
client = MongoClient(mongo_uri)
db_name = mongo_uri.split("/")[-1].split("?")[0]  # extract db name from URI
db = client[db_name]
properties_collection = db.properties

# ------------------------------
# Seed demo data if empty
# ------------------------------
def seed_demo_data():
    if properties_collection.count_documents({}) == 0:
        demo_locations = ["Bangalore", "Chennai", "Hyderabad", "Pune", "Mumbai"]
        for _ in range(5):
            features = {f: round(uniform(0, 10), 2) for f in 
                ["CRIM","ZN","INDUS","CHAS","NOX","RM","AGE","DIS","RAD","TAX","PTRATIO","B","LSTAT"]}
            features["CHAS"] = choice([0, 1])
            expected = round(uniform(100000, 500000), 2)
            predicted = round(expected * uniform(0.8, 1.2), 2)
            doc = {
                "sellerName": f"Demo Seller {_+1}",
                "email": f"demo{_+1}@example.com",
                "phone": f"99999{randint(10000,99999)}",
                "location": choice(demo_locations),
                "features": features,
                "expectedPrice": expected,
                "predictedPrice": predicted,
                "profitable": predicted > expected
            }
            properties_collection.insert_one(doc)
        print("✅ Demo properties inserted")
    else:
        print("ℹ️ Database already contains properties; skipping seeding.")

seed_demo_data()

# ------------------------------
# Load ML model
# ------------------------------
model = joblib.load("ml/model.pkl")  # Ensure model.pkl exists in ml/ folder

# ------------------------------
# Routes
# ------------------------------
@app.route("/")
def home():
    return "🏠 RealEstateML Flask Backend Running!"

@app.route("/add", methods=["POST"])
def add_property():
    data = request.get_json()
    required_fields = [
        "sellerName", "email", "phone", "location",
        "CRIM","ZN","INDUS","CHAS","NOX","RM","AGE","DIS",
        "RAD","TAX","PTRATIO","B","LSTAT","expectedPrice"
    ]
    for f in required_fields:
        if f not in data:
            return jsonify({"error": f"Missing field: {f}"}), 400
    try:
        features = [float(data[f]) for f in ["CRIM","ZN","INDUS","CHAS","NOX","RM","AGE","DIS","RAD","TAX","PTRATIO","B","LSTAT"]]
        predicted_price = float(model.predict([features])[0])
        expected_price = float(data.get("expectedPrice", 0))
        profitable = predicted_price > expected_price
        property_doc = {
            "sellerName": data["sellerName"],
            "email": data["email"],
            "phone": data["phone"],
            "location": data["location"],
            "features": {k: float(data[k]) for k in ["CRIM","ZN","INDUS","CHAS","NOX","RM","AGE","DIS","RAD","TAX","PTRATIO","B","LSTAT"]},
            "expectedPrice": expected_price,
            "predictedPrice": predicted_price,
            "profitable": profitable
        }
        properties_collection.insert_one(property_doc)
        return jsonify({"message": "Property added successfully", "property": property_doc}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/all", methods=["GET"])
def get_properties():
    properties = list(properties_collection.find({}, {"_id": 0}))
    return jsonify(properties)

# ------------------------------
# Run app
# ------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
