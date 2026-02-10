import os
from flask import Flask, request, jsonify
from groq import Groq
from dotenv import load_dotenv

# Charge les variables d'environnement (clé API)
load_dotenv()

app = Flask(__name__)
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.route('/')
def home():
    return "🚀 Witflag API is Running!"

@app.route('/generate-desc', methods=['POST'])
def generate():
    data = request.json
    specs = data.get('specs', '')
    
    if not specs:
        return jsonify({"error": "No specs provided"}), 400

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a luxury tech marketing expert. Write descriptions in Arabic for Witflag."},
                {"role": "user", "content": f"Describe these specs in premium Arabic: {specs}"}
            ],
            temperature=0.7,
        )
        return jsonify({"description": completion.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Utilisation du port défini par l'hébergeur ou 5000 par défaut
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
