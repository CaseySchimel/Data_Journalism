from flask import Flask, send_from_directory
import json

app = Flask(__name__, static_url_path='', static_folder='.')

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/us_car_crashes.html')
def serve_us_car_crashes():
    return send_from_directory('.', 'us_car_crashes.html')

@app.route('/car_brands.html')
def serve_car_brands():
    return send_from_directory('.', 'car_brands.html')

@app.route('/css/<path:path>')
def serve_css(path):
    return send_from_directory('css', path)

@app.route('/js/<path:path>')
def serve_js(path):
    return send_from_directory('js', path)

@app.route('/data/<path:path>')
def serve_data(path):
    return send_from_directory('data', path)

if __name__ == '__main__':
    app.run(debug=True)
