import mimetypes


class FileService:
    @staticmethod
    def is_audio_file(filename):
        """Check if the file is an audio file based on its extension."""
        valid_audio_extensions = ['.mp3', '.wav', '.aac', '.flac']
        ext = mimetypes.guess_extension(mimetypes.guess_type(filename)[0])
        return ext in valid_audio_extensions

    @staticmethod
    def is_image_file(filename):
        """Check if the file is an image file based on its extension."""
        valid_image_extensions = ['.jpg', '.jpeg', '.png', '.gif']
        ext = mimetypes.guess_extension(mimetypes.guess_type(filename)[0])
        return ext in valid_image_extensions
