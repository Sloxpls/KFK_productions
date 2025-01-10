from PIL import Image
import io
from werkzeug.utils import secure_filename

class ImageService:
    @staticmethod
    def process_image(image_file):
        filename = secure_filename(image_file.filename)
        output_filename = f"{filename.split('.')[0]}.jpg"

        try:
            with Image.open(image_file) as img:
                # Ensure the image is in RGB mode (required for JPG)
                img = img.convert('RGB')

                # Resize the image to a standard size (e.g., 3000x3000 pixels)
                img = img.resize((3000, 3000))

                # Save the processed image into a BytesIO object
                output = io.BytesIO()
                img.save(output, format='JPEG')
                output.seek(0)  # Move to the beginning of the BytesIO stream

                return {
                    'filename': output_filename,
                    'file_type': 'image/jpeg',
                    'data': output.read()
                }
        except Exception as e:
            raise Exception(f"Image processing failed: {e}")
