import pandas as pd
import json
import os


csv_file_path = os.path.join(os.path.dirname(__file__), 'EXAMPLE.csv')

json_file_path = os.path.join(os.path.dirname(__file__), 'data.json')

def csv_to_json(csv_file_path, json_file_path):
    df = pd.read_csv(csv_file_path)
    
    data_dict = df.to_dict(orient='records')
    
    with open(json_file_path, 'w') as json_file:
        json.dump(data_dict, json_file, indent=4)
        
    print(f"Data successfully converted to JSON")

if __name__ == "__main__":
    csv_to_json(csv_file_path, json_file_path)
