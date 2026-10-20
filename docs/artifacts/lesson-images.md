# Скриншоты в уроках курсов: источники

Решение архитектора 2026-10-20 (Change 197): в уроках курсов допустимы скриншоты окон программ;
схемы остаются кодом. Скриншот из чужого источника взят с согласия архитектора и при любой
претензии заменяется своим снимком того же кадра. Файлы лежат в
`apps/web/public/images/lessons/<id урока>/`, формат WebP.

| Файл | Урок | Что на кадре | Источник |
|---|---|---|---|
| `python-first-program/python-org-download.webp` | 1.1 «Программа и её выполнение» | python.org/downloads на Windows: кнопка «Download Python install manager», 2026-10-20 | Собственный снимок страницы https://www.python.org/downloads/ (Playwriter, 1280 px) |
| `python-first-program/pycharm-new-python-file.webp` | 1.1 | PyCharm: правая кнопка по папке проекта → New → Python File | Яндекс Практикум, та же статья — кадр «Алгоритм создания файла Python в PyCharm» (снят в Linux, интерфейс PyCharm тот же) |

Убраны 2026-10-20 (вводили в заблуждение): запуск в PyCharm из статьи Практикума (Linux, файлы
Jupyter, Python 3.8) и интерактивный режим оттуда же (Python 3.10, `print ("hello")`).

## Кадры для съёмки (Windows 11, светлая тема, окно 1280×800, без личных данных)

| № | Файл | Что на кадре |
|---|---|---|
| 1 | `python-install-manager.webp` | Окно установщика Python install manager с кнопкой «Install» |
| 2 | `windows-terminal-python.webp` | Терминал: `python --version` → `Python 3.15.0`, затем `python`, `>>> 3 * 40` → `120`, `>>> exit()` |
| 3 | `pycharm-new-project.webp` | PyCharm, окно «New Project»: Location `…\PycharmProjects\kurs`, выбранный установленный Python, кнопка «Create» |
| 4 | `pycharm-run.webp` | PyCharm: проект `kurs`, файл `main.py` с `print("Привет!")` и `print(3 * 40)`, внизу панель «Run» с выводом `Привет!` и `120` |
| 5 | `pycharm-terminal.webp` | PyCharm: вкладка «Terminal» внизу, в ней `python main.py` и вывод |
| 6 | `idle-run-module.webp` | IDLE: окно редактора `main.py` с тем же кодом и меню «Run → Run Module»; рядом «IDLE Shell» с выводом |
| 7 | `vscode-run.webp` | VS Code: `main.py`, кнопка «Run Python File» справа вверху, вывод в панели «Terminal» |

Кадры, которых нет в источниках (Windows): окно установки Python install manager, PyCharm на
Windows (установщик, «New Project»), IDLE (оболочка и редактор, Run Module), VS Code (расширение
Python, Run Python File). Пока их заменяют текстовые шаги.
