from enum import Enum
import os
root = os.getcwd()
os.environ["PATH"] = os.path.join(root, "ffmpeg", "bin")


class Mode(Enum):
    READ = 1
    HOST = 2
    CROP = 3


class StreamFormat(Enum):
    MPEGTS_UDP = 1
    MPEG1VIDEO = 2
    MPEG2VIDEO = 3
    XVID = 4
    HTTP = 6
    DASH = 7
    MPEGTS_HTTP = 8


def modes_print():
    for i in Mode:
        print(f"{i.value}: {i.name}")


def stream_formats_print():
    for i in StreamFormat:
        print(f"{i.value}: {i.name}")

# -fflags +genpts
# -vf cropdetect
# -max_interleave_delta 0 -ss 00:00:00  -avoid_negative_ts make_zero make_non_negative
# -force_key_frames 00:00:00.000

# -force_key_frames source -x264-params keyint=10:scenecut=0

# -fflags +nobuffer+nofillin+igndts


def host():
    file_path = "input\\anime.mkv"
    address = "127.0.0.1:1234"

    stream_formats_print()
    stream_format = StreamFormat(int(input("format: ")))
    if stream_format == StreamFormat.MPEGTS_UDP:
        os.system(f"ffmpeg -re -i {file_path} -c:v libx264 -preset ultrafast -tune zerolatency -f mpegts udp://{address}")
    elif stream_format == StreamFormat.MPEG1VIDEO:
        os.system(f"ffmpeg -re -i {file_path} -c:v mpeg1video -q:v 1 -q:a 1 -f mpeg1video udp://{address}")
    elif stream_format == StreamFormat.MPEG2VIDEO:
        os.system(f"ffmpeg -re -i {file_path} -c:v mpeg2video -q:v 1 -q:a 1 -f mpegts udp://{address}")
    elif stream_format == StreamFormat.XVID:
        os.system(f"ffmpeg -re -i {file_path} -c:v libxvid -q:v 1 -q:a 1 -f mpegts udp://{address}")
    elif stream_format == StreamFormat.HTTP:
        os.system(f"ffmpeg -re -i {file_path} -c:v libx264 -preset ultrafast -tune zerolatency -listen 1 -f mp4 -movflags frag_keyframe+empty_moov -pix_fmt yuv420p http://localhost:8080/video.mp4")
    elif stream_format == StreamFormat.DASH:
        os.system(
            f"ffmpeg -re -y -i {file_path} -c:v libx264 -f dash -seg_duration 1 -streaming 1 -window_size 30 -remove_at_exit 1 live.mpd")
    if stream_format == StreamFormat.MPEGTS_HTTP:
        os.system(f"ffmpeg -re -i {file_path} -c:v libx264 -preset ultrafast -tune zerolatency -f mpegts http://{address}")
    else:
        print("unknown format")


def read_stream():
    address = "127.0.0.1:1234"
    out_name = "video"
    out_format = "ts"
    out_resolution = "720x1280"
    fix_first_keyframe = False  # false если идёт захват начала стрима
    os.system(f"ffmpeg -y -i \"udp://{address}?overrun_nonfatal=1&fifo_size=50000000\" -s {out_resolution} -c copy stream.ts")
    #os.system(f"ffmpeg -y -i \"udp://{address}?overrun_nonfatal=1&fifo_size=50000000\" -s {out_resolution} -c:v libx264 tmp.{out_format} -c:v copy -f mpegts pipe:1|ffplay -i -x 500 pipe:0")
    #os.system(f"ffprobe -select_streams v -show_entries frame=pts_time -of csv=p=0 -skip_frame nokey -i tmp.{out_format} > keyframes.txt")
    # timestamp = 0
    # if fix_first_keyframe:
    #     file = open("keyframes.txt", "r")
    #     file.readline()
    #     timestamp = float(file.readline())
    #     file.close()

    #os.system(f"ffmpeg -y -ss {timestamp} -i tmp.{out_format} -c:v libx264 -force_key_frames source -x264-params keyint=25:scenecut=0 {out_name}.{out_format}")
    print("read finished.")


def crop():
    start = "00:00:11.00000000"
    stop = "00:00:15.00000000"
    in_file = "video.mp4"
    os.system(f"ffmpeg -y -i {in_file} -vcodec libx264 -ss {start} -to {stop} video2.mp4")
    print("crop finished.")


while True:
    modes_print()
    mode = Mode(int(input("mode: ")))
    if mode == Mode.READ:
        read_stream()
    elif mode == Mode.HOST:
        host()
    elif mode == Mode.CROP:
        crop()
    else:
        print("unknown mode")
