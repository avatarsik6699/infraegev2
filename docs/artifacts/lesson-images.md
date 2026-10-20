# Скриншоты в уроках курсов: источники

Решение архитектора 2026-10-20 (Change 197): в уроках курсов допустимы скриншоты окон программ;
схемы остаются кодом. Скриншот из чужого источника взят с согласия архитектора и при любой
претензии заменяется своим снимком того же кадра. Файлы лежат в
`apps/web/public/images/lessons/<id урока>/`, формат WebP.

| Файл | Урок | Что на кадре | Источник |
|---|---|---|---|
| `python-first-program/python-org-download.webp` | 1.1 «Программа и её выполнение» | python.org/downloads на Windows: кнопка «Download Python install manager», 2026-10-20 | Собственный снимок страницы https://www.python.org/downloads/ (Playwriter, 1280 px) |

Убраны 2026-10-20 (вводили в заблуждение): запуск в PyCharm из статьи Практикума (Linux, файлы
Jupyter, Python 3.8) и интерактивный режим оттуда же (Python 3.10, `print ("hello")`).

## Макеты окон, сгенерированные архитектором (2026-10-20)

Не снимки экрана: изображения созданы архитектором по промптам (вторая редакция —
[lesson-images/revision-prompts.txt](lesson-images/revision-prompts.txt)) и приняты как
финальные 2026-10-20. В репозитории только сжатые копии (WebP, 80) в
`apps/web/public/images/lessons/python-first-program/`; полноразмерные оригиналы не хранятся —
при правке кадр перегенерируется по промпту. Вторая редакция исправила IDLE (строка
`= RESTART`), версию в VS Code и пути PyCharm; меню «New → Python File» заменило кадр из статьи.

| Файл | Где в уроке 1.1 | Что на кадре | Известные неточности |
|---|---|---|---|
| `python-install-manager.webp` | «Установка Python», шаг 1.2 | Окно App Installer «Install Python install manager?» | — |
| `windows-terminal-python.webp` | после проверки версии | PowerShell: `python --version`, `python`, `>>> 3 * 40`, `exit()` | Заставка интерактивного режима сокращена до версии |
| `pycharm-new-project.webp` | вкладка PyCharm, шаг 2 | Окно «New Project», `C:\PycharmProjects\kurs` | Путь интерпретатора `C:\Python315` |
| `pycharm-new-python-file.webp` | вкладка PyCharm, шаг 3 | Меню папки `kurs`: «New → Python File» | Главное меню русское, остальные кадры PyCharm — английские |
| `pycharm-run.webp` | вкладка PyCharm, шаг 4 | `main.py` и вывод в панели «Run» | Нет папки `.venv`, запуск системным Python |
| `pycharm-terminal.webp` | «Первая программа», запуск из терминала | Вкладка «Terminal» PyCharm с `python main.py` | — |
| `idle-run-module.webp` | вкладка IDLE, шаг 4 | Редактор с меню «Run → Run Module» и IDLE Shell с `= RESTART` | — |
| `vscode-run.webp` | вкладка VS Code, шаг 4 | «Run Python File» и вывод в «Terminal» | Путь `C:\kurs` вместо папки PyCharm |
