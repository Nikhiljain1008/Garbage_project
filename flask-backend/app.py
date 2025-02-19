import torch
from flask import Flask, request, jsonify
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import io

# ----- CONFIGURATION -----
model_name = "openai/clip-vit-base-patch32"
prompts = [
	"a clean street with no garbage",
	"a street with garbage and litter",
	"an image that is not a street scene"
]

# ----- LOAD CLIP MODEL -----
model = CLIPModel.from_pretrained(model_name)
processor = CLIPProcessor.from_pretrained(model_name)

# Use GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# ----- FLASK APP -----
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
	if 'image' not in request.files:
		return jsonify({"error": "No image uploaded"}), 400

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

	# Construct response
	result = {
	"clean_street_probability": probs[0][0].item() * 100,
	"garbage_probability": probs[0][1].item() * 100,
	"not_street_probability": probs[0][2].item() * 100,
	"prediction": predicted_label
}

	# Return response



	return jsonify(result)

if __name__ == '__main__':
	app.run(host="0.0.0.0", port=5001)  # Runs on port 5001
