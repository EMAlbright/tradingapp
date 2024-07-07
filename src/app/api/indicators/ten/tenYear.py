import yfinance as yf
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/tenYear")
def tenYear():
    try:
        treasury = yf.Ticker("^TNX")
        data = treasury.history(period="1d")
        if data.empty:
            return jsonify({"error": "No data available"}), 404

        # Get the last row 
        last_row = data.iloc[-1]
        
        response = {
            "yield": float(last_row['Close']),
            "date": last_row.name.strftime('%Y-%m-%d'),
            "open": float(last_row['Open']),
            "high": float(last_row['High']),
            "low": float(last_row['Low']),
            "volume": int(last_row['Volume'])
        }
        return jsonify(response)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080)