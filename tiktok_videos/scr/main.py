import json
import os

from moviepy import ImageClip, VideoFileClip, CompositeVideoClip, AudioFileClip, concatenate_videoclips
from PIL import Image, ImageDraw


class VideoCreator:
    LP_IMAGE_PATH = "../../assets/img/skiva.png"
    TEMP_LP_IMAGE_PATH = "temp_lp.png"
    OUTPUT_RESOLUTION = (1080, 1920)
    SPINNING_DURATION = 5

    def __init__(self, song_image_path, song_audio_path, background_video_path, output_video_path):
        self.song_image_path = song_image_path
        self.song_audio_path = song_audio_path
        self.background_video_path = background_video_path
        self.output_video_path = output_video_path

    def process_song_img(self, lp_width, lp_height):
        """Process and create a resized song image with a circular mask."""
        song_image_size = (int(lp_width * 0.7), int(lp_height * 0.7))
        song_image = Image.open(self.song_image_path).resize(song_image_size).convert("RGBA")

        mask = Image.new("L", song_image_size, 0)
        ImageDraw.Draw(mask).ellipse((0, 0, song_image_size[0], song_image_size[1]), fill=255)
        masked_song_image = Image.composite(song_image, Image.new("RGBA", song_image_size, (0, 0, 0, 0)), mask)

        return masked_song_image, song_image_size

    def calculate_image_offsets(self, lp_width, lp_height, song_image_size):
        """Calculate offsets to center the song image on the LP."""
        x_offset = (lp_width - song_image_size[0]) // 2
        y_offset = (lp_height - song_image_size[1]) // 2
        return x_offset, y_offset

    def create_spinning_lp(self, duration):
        """Create a spinning LP image by compositing the song image over an LP record."""
        lp_record_image = Image.open(self.LP_IMAGE_PATH).convert("RGBA")
        lp_width, lp_height = lp_record_image.size

        resized_song_image, song_image_size = self.process_song_img(lp_width, lp_height)
        x_offset, y_offset = self.calculate_image_offsets(lp_width, lp_height, song_image_size)

        lp_record_image.paste(resized_song_image, (x_offset, y_offset), mask=resized_song_image)
        lp_record_image.save(self.TEMP_LP_IMAGE_PATH)

        spinning_lp_clip = ImageClip(self.TEMP_LP_IMAGE_PATH, duration=duration)
        return spinning_lp_clip.rotated(lambda t: t * 360 / self.SPINNING_DURATION)

    def create_final_video(self):
        """Create the final video combining spinning LP and background video."""
        audio_clip = AudioFileClip(self.song_audio_path)
        audio_duration = audio_clip.duration

        background_video = VideoFileClip(self.background_video_path)
        background_video = concatenate_videoclips(
            [background_video] * int(audio_duration / background_video.duration + 1)
        )
        background_video = background_video.subclipped(0, audio_duration).resized(self.OUTPUT_RESOLUTION)

        spinning_lp_clip = self.create_spinning_lp(audio_duration)
        spinning_lp_clip = spinning_lp_clip.with_position(("center", "center")).resized(
            height=background_video.w * 0.85
        )

        final_video = CompositeVideoClip([background_video, spinning_lp_clip])
        final_video = final_video.with_audio(audio_clip).with_duration(audio_duration)

        final_video.write_videofile(
            self.output_video_path,
            fps=30,
            audio_codec="aac",
            threads=24
        )
        print(f"Video saved to {self.output_video_path}")


def main():
    try:
        with open("../../assets/info.json", "r") as file:
            data = json.load(file)
    except FileNotFoundError:
        print("Error: Could not find 'info.json' or the file contains invalid data.")
        return

    for asset in data.get("assets", []):
        try:
            song_image = asset["image"]
            song_audio = asset["song"]
            background_video = asset["background_video"]
            output_video = asset["output_video"]

            if os.path.exists(output_video):
                print(f"Skipping {output_video}: File already exists.")
                continue

            video_creator = VideoCreator(song_image, song_audio, background_video, output_video)
            video_creator.create_final_video()
        except KeyError as e:
            print(f"Error: Missing key {e} in asset data.")
        except Exception as e:
            print(f"Error processing asset: {e}")


if __name__ == "__main__":
    main()


