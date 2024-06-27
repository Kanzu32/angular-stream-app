import subprocess

from flask import Flask, make_response, send_file, request
from flask_cors import CORS
import os
from os.path import dirname, abspath

root = abspath(dirname(__file__))
os.environ["PATH"] = os.path.join(root, "ffmpeg", "bin")
print(root)

app = Flask(__name__)
CORS(app)

record_process = subprocess.Popen(["ffmpeg", "-version"])


@app.route("/")
def hello_world():
    return "<p>Flask server!💀💀💀</p>"


@app.route("/read/start", methods=['POST'])
def record_start():
    global record_process
    options = request.json
    address = options["address"]
    name = options["name"]
    out_format = options["format"]
    out_resolution = options["resolution"]
    print(address, name, out_format, out_resolution)
    record_process.terminate()
    record_process = subprocess.Popen(["ffmpeg", "-re", "-y", "-i", f"udp://{address}?overrun_nonfatal=1&fifo_size=50000000",
                                       "-s", f"{out_resolution}", "-c:v", "libx264",
                                       "-profile", "main", "-level", "4.1", "-pix_fmt", "yuv420p",
                                       f"./recorded/{name}.{out_format}", "-c:v", "libx264", "-profile", "main",
                                       "-level", "4.1", "-pix_fmt", "yuv420p", "-f", "dash", "-seg_duration", "1",
                                       "-streaming", "1", "-window_size", "30", "-remove_at_exit", "1", "live.mpd"],
                                      creationflags=subprocess.CREATE_NEW_PROCESS_GROUP, stdin=subprocess.PIPE,)

    #os.system(f"ffmpeg -y -i \"udp://{address}?overrun_nonfatal=1&fifo_size=50000000\" -s {out_resolution} -c:v libx264 {name}.{out_format} -c:v copy -f mpegts pipe:1|ffplay -i -x 500 pipe:0")

    return "<p>Flask server!💀💀💀</p>"


@app.route("/read/stop", methods=['POST'])
def record_stop():
    global record_process

    record_process.communicate(b'q', 2000)

    return "<p>Flask server!💀💀💀</p>"


@app.route("/crop", methods=['POST'])
def crop_post():
    options = request.json
    section_mode = options["sectionMode"]
    in_file = options["fileName"]
    if in_file == "":
        in_file = "video.mp4"
    print("IN_FILE: ", in_file)
    extension = in_file.split(".")[-1]
    if section_mode:
        os.system(f"ffprobe -select_streams v -show_entries frame=pts_time -of csv=p=0 -skip_frame nokey -i ./recorded/{in_file} > keyframes.txt")
        file = open("keyframes.txt", "r")
        file.readline()
        timestamp = float(file.readline())
        file.close()
        os.system(f"ffmpeg -y -ss {timestamp} -i ./recorded/{in_file} -c:v libx264 -pix_fmt yuv420p -force_key_frames source -x264-params keyint=25:scenecut=0 ./recorded/fixed.{extension}")
        file_path = os.path.join(root, "recorded", "fixed.mp4")
    else:
        begin = options["begin"]
        end = options["end"]
        os.system(f"ffmpeg -y -i ./recorded/{in_file} -vcodec libx264 -pix_fmt yuv420p -force_key_frames source -x264-params keyint=25:scenecut=0 -ss {begin} -to {end} ./recorded/crop.{extension}")
        file_path = os.path.join(root, "recorded", "crop.mp4")

    return send_file(file_path, as_attachment=True)


@app.route('/input/<string:filename>', methods=['GET'])
def video(filename):
    try:
        file_path = os.path.join(root, "input", filename)
        print(file_path)
        if os.path.isfile(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return make_response(f"File '{filename}' not found.", 404)
    except Exception as e:
        return make_response(f"Error: {str(e)}", 500)


@app.route('/recorded/<string:filename>', methods=['GET'])
def video_recorded(filename):
    try:
        file_path = os.path.join(root, "recorded", filename)
        file_extension = file_path.split(".")[-1]
        print(file_path)
        if os.path.isfile(file_path):
            if file_extension == "avi" or file_extension == "mkv":
                os.system(f"ffmpeg -y -i ./recorded/{filename} -codec copy ./recorded/{filename}.mp4")
                return send_file(file_path + ".mp4", as_attachment=True)
            else:
                return send_file(file_path, as_attachment=True)
        else:
            return make_response(f"File '{filename}' not found.", 404)
    except Exception as e:
        return make_response(f"Error: {str(e)}", 500)


@app.route('/download/<string:filename>', methods=['GET'])
def video_download(filename):
    try:
        file_path = os.path.join(root, "recorded", filename)
        print(file_path)
        if os.path.isfile(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return make_response(f"File '{filename}' not found.", 404)
    except Exception as e:
        return make_response(f"Error: {str(e)}", 500)


@app.route('/download', methods=['GET'])
def video_download_default():
    try:
        file_path = os.path.join(root, "recorded", "video.mp4")
        print(file_path)
        if os.path.isfile(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return make_response(f"File video.mp4 not found.", 404)
    except Exception as e:
        return make_response(f"Error: {str(e)}", 500)


@app.route('/recorded/', methods=['GET'])
def video_recorded_default():
    try:
        file_path = os.path.join(root, "recorded", "video.mp4")
        print(file_path)
        if os.path.isfile(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return make_response(f"File video.mp4 not found.", 404)
    except Exception as e:
        return make_response(f"Error: {str(e)}", 500)


@app.route('/<string:filename>', methods=['GET'])
def stream(filename):
    try:
        file_path = os.path.join(root, filename)
        print(file_path)
        if os.path.isfile(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return make_response(f"File {filename} not found.", 404)
    except Exception as e:
        return make_response(f"Error: {str(e)}", 500)


@app.route('/files', methods=['GET'])
def list_files():
    try:
        path = os.path.join(root, "recorded")
        files_list = "\n".join(os.listdir(path))
        response = make_response(files_list, 200)
        response.mimetype = "text/plain"
        return response
    except Exception as e:
        return make_response(f"Error: {str(e)}", 500)


if __name__ == '__main__':
    app.run()