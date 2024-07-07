import fear_and_greed
from flask_cors import CORS
from flask import jsonify, Flask

app = Flask(__name__)
CORS(app)

@app.route("/api/fear")
def fgi():
    data =fear_and_greed.get()
    return jsonify(data)  

if __name__ == "__main__":
    app.run(debug=True, port=8000)