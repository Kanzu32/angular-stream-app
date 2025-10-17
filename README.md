## [EN] Description
A web application for targeting relevant sections of a video stream.

Stream video over UDP or HTTP using Python and ffmpeg. The following formats are supported:
* MPEGTS: MPEG Transport Stream;
* MPEG1VIDEO: MPEG-1 video;
* MPEG2VIDEO: MPEG-2 video;
* XVID: Video Xvid;
* DASH: Dynamic Adaptive Streaming over HTTP (DASH).

The server part receives the stream, records and relays it to a web application in DASH format and also edits it at the user’s command. It uses Python, Flask and ffmpeg.

The Angular client part displays the stream to the user, provides the ability to start or stop recording, download, trim and view recorded files on the server.

## Features
* Broadcast in different formats;
* Record video from stream;
* Selecting a recorded video from the list;
* Video trimming;
* Converting stream and video formats;
* Downloading videos from the server.

## Technologies
* JavaScript;
* TypeScript;
* HTML;
* CSS;
* Python;
* ffmpeg;
* Angular.

## [RU] Описание
Веб-приложение для обреки релевантных участков видеострима.

Трансляция видео по протоколу UDP или HTTP с использованием Python и ffmpeg. Поддерживаются следующие форматы:
* MPEGTS: Транспортный поток MPEG;
* MPEG1VIDEO: Видео MPEG-1;
* MPEG2VIDEO: Видео MPEG-2;
* XVID: Видео Xvid;
* DASH: Dynamic Adaptive Streaming over HTTP (DASH).

Серверная часть получает стрим, записывает и ретранслирует его в веб приложение в формате DASH а также редактирует по команде пользователя с использованием Python, Flask и ffmpeg.

Клиентская часть на Angular выводит стрим пользователю, предоставляет возможность начать или остановить запись, скачать, обрезать и просмотреть записанные файлы на сервере.

## Особенности
* Трансляция в разных форматах;
* Запись видео из стрима;
* Выбор записанного видео из списка;
* Обрезка видео;
* Преобразование форматов стримов и видео;
* Скачивание видео с сервера.

## Screenshots
![](https://github.com/Kanzu32/angular-stream-app/blob/main/readme/stream-1.png)
![](https://github.com/Kanzu32/angular-stream-app/blob/main/readme/stream-2.png)
![](https://github.com/Kanzu32/angular-stream-app/blob/main/readme/stream-3.png)
![](https://github.com/Kanzu32/angular-stream-app/blob/main/readme/stream-4.png)
![](https://github.com/Kanzu32/angular-stream-app/blob/main/readme/stream-5.png)
