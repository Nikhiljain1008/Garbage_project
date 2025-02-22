# import torch
# from flask import Flask, request, jsonify
# from PIL import Image
# from transformers import CLIPProcessor, CLIPModel
# import io
# import json
# from shapely.geometry import shape, Point

# # ----- CONFIGURATION -----
# model_name = "openai/clip-vit-base-patch32"
# prompts = [
#     "a clean street with no garbage",
#     "a street with garbage and litter",
#     "an image that is not a street scene"
# ]

# # Load CLIP Model
# model = CLIPModel.from_pretrained(model_name)
# processor = CLIPProcessor.from_pretrained(model_name)

# # Use GPU if available
# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# model.to(device)

# # Load Pune Ward GeoJSON
# with open(r"D:\project_garbage\Garbage_project\Map-Operation\Pune\pune-electoral-wards-2022.geojson", "r", encoding="utf-8") as f:
#     wards_geojson = json.load(f)

# # Load Muqqadam GeoJSON
# with open(r"D:\project_garbage\Garbage_project\Map-Operation\Pune_station_ward.geojson", "r", encoding="utf-8") as f:
#     muqqadam_geojson = json.load(f)

# # ----- FLASK APP -----
# app = Flask(__name__)

# @app.route('/predict', methods=['POST'])
# def predict():
#     # Check that required fields are present
#     if 'image' not in request.files or 'latituD:\project_garbage\Garbage_project\Map-Operation\Sukhsagar.geojsonde' not in request.form or 'longitude' not in request.form:
#         return jsonify({"error": "Image, latitude, and longitude are required"}), 400
    
#     # Load image
#     file = request.files['image']
#     try:
#         image = Image.open(io.BytesIO(file.read())).convert("RGB").resize((224, 224))
#     except Exception as e:
#         return jsonify({"error": f"Error processing image: {str(e)}"}), 400

#     # Prepare inputs for CLIP
#     inputs = processor(text=prompts, images=image, return_tensors="pt", padding=True)
#     inputs = {k: v.to(device) for k, v in inputs.items()}

#     # Model inference
#     with torch.no_grad():
#         outputs = model(**inputs)
#         probs = outputs.logits_per_image.softmax(dim=1)

#     # Get classification result
#     pred_idx = torch.argmax(probs, dim=1).item()
#     predicted_label = prompts[pred_idx]
#     garbage_probability = probs[0][1].item() * 100

#     result = {
#         "clean_street_probability": probs[0][0].item() * 100,
#         "garbage_probability": garbage_probability,
#         "not_street_probability": probs[0][2].item() * 100,
#         "prediction": predicted_label
#     }
    
#     # If garbage probability is greater than 50%, perform ward lookup
#     if garbage_probability > 50:
#         try:
#             latitude = float(request.form['latitude'])
#             longitude = float(request.form['longitude'])
#             point = Point(longitude, latitude)  # shapely uses (longitude, latitude) order
            
#             # Step 1: Find the ward
#             ward_name = None
#             for feature in wards_geojson["features"]:
#                 polygon = shape(feature["geometry"])
#                 if polygon.contains(point):
#                     ward_name = feature["properties"].get("Name2")  # Adjust property name as needed
#                     wardnum = feature["properties"].get("wardnum")
#                     result["ward_name"] = ward_name
#                     result["ward_number"] = wardnum
#                     break

#             # Step 2: If the ward is "Sukhsagarnagar - Rajiv Gandhinagar", check for Muqqadam
#             if ward_name == "Pune Station -Matoshri Ramabai Ambedkar Road":
#                 found_muqqadam = False
#                 for feature in muqqadam_geojson["features"]:
#                     muqqadam_name = feature["properties"].get("Name")
#                     if muqqadam_name and isinstance(muqqadam_name, str) and "M" in muqqadam_name:
#                         muqqadam_polygon = shape(feature["geometry"])
#                         if muqqadam_polygon.contains(point):
#                             print("Coordinate is in Muqqadam:", muqqadam_name)
#                             print("Muqqadam Description:", feature["properties"].get("description"))
#                             result["Muqqadam_name"] = muqqadam_name
#                             result["SI_no"] = feature["properties"].get("description")
#                             found_muqqadam = True
#                             break
#                 if not found_muqqadam:
#                     print("Coordinate is not in any Muqqadam region within pune-station-muqaddam.")
#             else:
#                 print("Coordinate is not in pune-station-ward.")
#         except Exception as e:
#             # Log the error and optionally include error details in the result
#             print("Error during geolocation lookup:", e)
#             result["geo_lookup_error"] = str(e)
    
#     return jsonify(result)

# if __name__ == '__main__':
#     app.run(host="0.0.0.0", port=5001)

import torch
from flask import Flask, request, jsonify
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import io
import json
from shapely.geometry import shape, Point

# ----- CONFIGURATION -----
model_name = "openai/clip-vit-base-patch32"
prompts = [
    "a clean street with no garbage",
    "a street with garbage and litter",
    "an image that is not a street scene"
]

# Load CLIP Model
model = CLIPModel.from_pretrained(model_name)
processor = CLIPProcessor.from_pretrained(model_name)

# Use GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Load Pune Ward GeoJSON
with open(r"D:\project_garbage\Garbage_project\Map-Operation\Pune\pune-electoral-wards-2022.geojson", "r", encoding="utf-8") as f:
    wards_geojson = json.load(f)

# Load Muqqadam GeoJSON
with open(r"D:\project_garbage\Garbage_project\Map-Operation\Pune_station_ward.geojson", "r", encoding="utf-8") as f:
    muqqadam_geojson = json.load(f)

# ----- FLASK APP -----
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    # Check that required fields are present
    if 'image' not in request.files or 'latitude' not in request.form or 'longitude' not in request.form:
        return jsonify({"error": "Image, latitude, and longitude are required"}), 400
    
    # Load image
    file = request.files['image']
    try:
        image = Image.open(io.BytesIO(file.read())).convert("RGB").resize((224, 224))
    except Exception as e:
        return jsonify({"error": f"Error processing image: {str(e)}"}), 400

    # Prepare inputs for CLIP
    inputs = processor(text=prompts, images=image, return_tensors="pt", padding=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Model inference
    with torch.no_grad():
        outputs = model(**inputs)
        probs = outputs.logits_per_image.softmax(dim=1)

    # Get classification result
    pred_idx = torch.argmax(probs, dim=1).item()
    predicted_label = prompts[pred_idx]
    garbage_probability = probs[0][1].item() * 100

    result = {
        "clean_street_probability": probs[0][0].item() * 100,
        "garbage_probability": garbage_probability,
        "not_street_probability": probs[0][2].item() * 100,
        "prediction": predicted_label
    }
    
    # If garbage probability is greater than 50%, perform ward lookup
    if garbage_probability > 50:
        try:
            latitude = float(request.form['latitude'])
            longitude = float(request.form['longitude'])
            point = Point(longitude, latitude)  # shapely uses (longitude, latitude) order
            
            # Step 1: Find the ward
            ward_name = None
            for feature in wards_geojson["features"]:
                polygon = shape(feature["geometry"])
                if polygon.contains(point):
                    ward_name = feature["properties"].get("Name2")  # Adjust property name as needed
                    wardnum = feature["properties"].get("wardnum")
                    result["ward_name"] = ward_name
                    result["ward_number"] = wardnum
                    break

            # Step 2: If the ward is "Sukhsagarnagar - Rajiv Gandhinagar", check for Muqqadam
            if ward_name == "Pune Station -Matoshri Ramabai Ambedkar Road":
                found_muqqadam = False
                for feature in muqqadam_geojson["features"]:
                    muqqadam_name = feature["properties"].get("Name")
                    if muqqadam_name and isinstance(muqqadam_name, str) and "M" in muqqadam_name:
                        muqqadam_polygon = shape(feature["geometry"])
                        if muqqadam_polygon.contains(point):
                            print("Coordinate is in Muqqadam:", muqqadam_name)
                            print("Muqqadam Description:", feature["properties"].get("description"))
                            result["Muqqadam_name"] = muqqadam_name
                            result["SI_no"] = feature["properties"].get("description")
                            found_muqqadam = True
                            break
                if not found_muqqadam:
                    print("Coordinate is not in any Muqqadam region within Sukhsagar.")
            else:
                print("Coordinate is not in Sukhsagar.")
        except Exception as e:
            # Log the error and optionally include error details in the result
            print("Error during geolocation lookup:", e)
            result["geo_lookup_error"] = str(e)
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)
