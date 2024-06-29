from enum import Enum
import os
root = os.getcwd()
os.environ["PATH"] = os.path.join(root, "ffmpeg", "bin")


class StreamFormat(Enum):
    MPEGTS = 1
    MPEG1VIDEO = 2
    MPEG2VIDEO = 3
    XVID = 4
    DASH = 7


def stream_formats_print():
    for i in StreamFormat:
        print(f"{i.value}: {i.name}")


def host():
    file_path = "input\\bbb.mp4"
    address = "127.0.0.1:1234"

    stream_formats_print()
    stream_format = StreamFormat(int(input("format: ")))
    if stream_format == StreamFormat.MPEGTS:
        os.system(f"ffmpeg -re -i {file_path} -c:v libx264 -preset ultrafast -tune zerolatency -f mpegts udp://{address}")
    elif stream_format == StreamFormat.MPEG1VIDEO:
        os.system(f"ffmpeg -re -i {file_path} -c:v mpeg1video -q:v 1 -q:a 1 -f mpeg1video udp://{address}")
    elif stream_format == StreamFormat.MPEG2VIDEO:
        os.system(f"ffmpeg -re -i {file_path} -c:v mpeg2video -q:v 1 -q:a 1 -f mpegts udp://{address}")
    elif stream_format == StreamFormat.XVID:
        os.system(f"ffmpeg -re -i {file_path} -c:v libxvid -q:v 1 -q:a 1 -f mpegts udp://{address}")
    elif stream_format == StreamFormat.DASH:
        os.system(
            f"ffmpeg -re -y -i {file_path} -c:v libx264 -f dash -seg_duration 1 -streaming 1 -window_size 30 -remove_at_exit 1 live.mpd")
    else:
        print("unknown format")


while True:
    host()
