// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./array-processing.paid.intervaly.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "rannee-okonchanie",
      navLabel: "Раннее окончание",
      explanation: (
        <>
          <Typography.Text>
            В зал подали заявки на мероприятия (1, 3), (3, 5), (5, 8), (9, 15),
            (12, 16). Как провести как можно больше мероприятий, чтобы они не
            пересекались?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Каждый раз брать то мероприятие, которое раньше заканчивается: оно
              раньше освобождает зал.
            </strong>
          </Typography.Text>
          <Typography.Text>
            У мероприятия есть начало и окончание:{" "}
            <Notation>{"(start, finish)"}</Notation>. Пусть следующее
            мероприятие разрешено начать в момент окончания предыдущего. Тогда
            мероприятия совместимы, если start следующего ≥ finish предыдущего,
            а если нужен перерыв P — если start следующего ≥ finish предыдущего
            + P.
          </Typography.Text>
          <Typography.Text>
            На рисунке видно, как зал освобождается раньше всего и для следующих
            мероприятий остаётся больше времени:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.greedyTimeline_1df0d4}
            caption={
              <>
                Выбраны (1, 3), (3, 5), (5, 8) и (9, 15) — четыре мероприятия;
                (12, 16) начинается раньше окончания (9, 15) и не помещается.
              </>
            }
          />
          <CodeBlock
            collapsible={false}
            code={
              "meetings = [(9, 15), (1, 3), (12, 16), (5, 8), (3, 5)]\npause = 0\nmeetings.sort(key=lambda x: (x[1], x[0]))\nselected = []\nlast_finish = None\nfor start, finish in meetings:\n    if last_finish is None or start >= last_finish + pause:\n        selected.append((start, finish))\n        last_finish = finish\nprint(len(selected), *selected)"
            }
            label={"Больше всего мероприятий"}
            language="python"
            output={"4 (1, 3) (3, 5) (5, 8) (9, 15)"}
          />
          <Typography.Text>
            Первый показатель ключа — окончание. Почему первый выбор
            обрабатывается через{" "}
            <PythonTerm term="none">
              <Notation>{"None"}</Notation>
            </PythonTerm>
            ? Чтобы случайно не потребовать перерыв{" "}
            <strong>до первого мероприятия</strong>: перерыв по условию нужен
            между мероприятиями.
          </Typography.Text>
          <ProofDisclosure summary="Доказательство выбора обменом">
            <Typography.Text>
              Пусть некоторое оптимальное расписание начинается с мероприятия A.
              Наш алгоритм выбирает мероприятие G, заканчивающееся не позже A.
              Заменим A на G. Все остальные мероприятия расписания останутся
              допустимыми: зал освободится не позже прежнего. Количество
              мероприятий не уменьшилось. После первого выбора рассуждение
              повторяется для оставшейся части дня.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "kontrprimery",
      navLabel: "Почему не по началу",
      explanation: (
        <>
          <Typography.Text>
            А почему не брать мероприятие, которое раньше начинается, или самое
            короткое?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Оба правила ошибаются — это видно на маленьких примерах.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Почему не по началу? Раннее мероприятие может занять весь день:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.greedyTimeline_88adcf}
            caption={
              <>
                По началу выбирается (0, 20) — одно мероприятие, хотя можно
                провести три: (1, 3), (3, 5), (5, 7).
              </>
            }
          />
          <Typography.Text>
            Почему не по длительности? Короткое мероприятие может пересекаться с
            двумя длинными:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.greedyTimeline_8496e3}
            caption={
              <>
                Самое короткое (3, 5) пересекается и с (0, 4), и с (4, 8): выбор
                его первым даёт одно мероприятие, а можно провести два.
              </>
            }
          />
          <Typography.Text>
            Значит, нам важно{" "}
            <strong>освободиться раньше в абсолютном времени</strong>, а не
            просто выбрать короткое мероприятие.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vtoroy-kriteriy",
      navLabel: "Второй критерий",
      explanation: (
        <>
          <Typography.Text>
            «Найди наибольшее количество мероприятий и наибольший перерыв между
            двумя последними». Как учесть второе требование?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сначала найти наибольшее количество k, оставить первые k − 1
              мероприятий жадного расписания и подобрать последнее, которое
              начинается как можно позже.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Жадный алгоритм выбрал (1, 3), (3, 5), (5, 8), (9, 15) — четыре
            мероприятия. Но последнее можно заменить на (12, 16): количество
            останется 4, а перерыв между двумя последними увеличится до 12 − 8 =
            4. Порядок решения:
          </Typography.Text>
          <ol>
            <li>Найти максимальное количество k.</li>
            <li>Взять первые k − 1 мероприятий жадного расписания.</li>
            <li>Узнать время окончания предпоследнего.</li>
            <li>
              Среди допустимых последних мероприятий выбрать то, которое позже
              начинается.
            </li>
          </ol>
          <Typography.Text>
            Почему первые k − 1 можно оставить жадными?{" "}
            <strong>
              Жадное построение позволяет закончить k − 1 мероприятий
              максимально рано.
            </strong>{" "}
            Более раннее окончание предпоследнего только увеличивает возможный
            перерыв, а подходящим последним становится любое мероприятие,
            начинающееся после него. Если гарантировано хотя бы два мероприятия,
            продолжение программы выше:
          </Typography.Text>
          <CodeBlock
            code={
              "penultimate_finish = selected[-2][1]\nlatest_start = None\nfor start, finish in meetings:\n    if start >= penultimate_finish + pause:\n        if latest_start is None or start > latest_start:\n            latest_start = start\nprint(len(selected), latest_start - penultimate_finish)"
            }
            label={"Наибольший перерыв перед последним"}
            language="python"
            output={"4 4"}
          />
          <Typography.Text>
            <Notation>{"selected[-2]"}</Notation> — предпоследняя выбранная
            запись, <Notation>{"selected[-2][1]"}</Notation> — время её
            окончания. Обрати внимание: максимизируем <strong>начало</strong>{" "}
            последнего мероприятия; позднее окончание само по себе не
            гарантирует большой перерыв. Если мероприятий меньше двух, такого
            перерыва нет — этот случай определяется условием.
          </Typography.Text>
          <Typography.Text>
            <strong>Похожие вопросы решаются той же заменой последнего</strong>:
            самое позднее окончание последнего мероприятия — наибольшее{" "}
            <Notation>{"finish"}</Notation> среди мероприятий, которые
            начинаются не раньше{" "}
            <Notation>{"penultimate_finish + pause"}</Notation> (здесь 16).
          </Typography.Text>
          <Typography.Text>
            Если в файле даны начало и длительность, окончание считают сразу при
            чтении: <Notation>{"finish = start + duration"}</Notation>. Если при
            одинаковом начале нужно выбрать более длительное последнее
            мероприятие, добавляется ещё один критерий —{" "}
            <Notation>{"finish − start"}</Notation>; на перерыв он не влияет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "obedinenie-intervalov",
      navLabel: "Объединение интервалов",
      explanation: (
        <>
          <Typography.Text>
            Сервер работал в те же пять интервалов. Сколько времени он работал
            всего и сколько простаивал?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Объединить пересекающиеся и касающиеся интервалы в непрерывные
              периоды и сложить их длины; простои — промежутки между периодами.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Это другой вопрос, чем выбор непересекающихся мероприятий. Первые
            три образуют один непрерывный период (1, 8), последние два — (9,
            16). Общая длительность работы (8 − 1) + (16 − 9) = 14.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.greedyTimelineMerged}
            caption={
              <>
                Пять интервалов и их объединение — периоды 1–8 и 9–16. Простои —
                0–1, 8–9 и 16–18.
              </>
            }
          />
          <Typography.Text>
            Сначала сортируем интервалы по началу, затем храним последний уже
            объединённый интервал:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "intervals = [(9, 15), (1, 3), (12, 16), (5, 8), (3, 5)]\nintervals.sort()\nmerged = []\nfor start, finish in intervals:\n    if not merged or start > merged[-1][1]:\n        merged.append([start, finish])\n    else:\n        merged[-1][1] = max(merged[-1][1], finish)\nprint(*merged)"
            }
            label={"Объединение интервалов"}
            language="python"
            output={"[1, 8] [9, 16]"}
          />
          <Typography.Text>
            Объединённые интервалы записаны списками{" "}
            <Notation>{"[start, finish]"}</Notation>, потому что мы изменяем
            правую границу: <Notation>{"merged[-1][1] = ..."}</Notation>. Почему
            используем <Notation>{"max"}</Notation>? Новый интервал может
            полностью лежать внутри предыдущего: после (2, 20) и (5, 8) правая
            граница должна остаться 20. Условие{" "}
            <Notation>{"start > merged[-1][1]"}</Notation> склеивает касающиеся
            интервалы: (1, 3) и (3, 5) — один период. Так и нужно, если в момент
            окончания работа ещё идёт или следующая начинается сразу.
          </Typography.Text>
          <Typography.Text>
            Если нужен суммарный простой за период от 0 до{" "}
            <Notation>{"day_end"}</Notation>, считаем промежутки между
            объединёнными интервалами — продолжение программы:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "day_end = 18\ncursor = 0\nidle_count = idle_duration = 0\nfor start, finish in merged:\n    if start > cursor:\n        idle_count += 1\n        idle_duration += start - cursor\n    cursor = finish\nif cursor < day_end:\n    idle_count += 1\n    idle_duration += day_end - cursor\nprint(idle_count, idle_duration)"
            }
            label={"Простои за период"}
            language="python"
            output={"3 4"}
          />
          <Typography.Text>
            Учтены простой до первой работы (0–1), простои между работами (8–9)
            и простой после последней работы (16–18). Здесь предполагается, что
            все интервалы лежат внутри рассматриваемого периода.
          </Typography.Text>
          <Typography.Text>
            <strong>b − a — длительность</strong> непрерывного промежутка
            времени от a до b, а{" "}
            <strong>b − a + 1 — количество целых номеров</strong> от a до b
            включительно. От 10:00 до 10:05 прошло 5 минут, а номера 10, 11, 12,
            13, 14, 15 — это 6 номеров. Целочисленные значения времени не делают
            формулу длительности автоматически равной{" "}
            <Notation>{"finish - start + 1"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sobytiya",
      navLabel: "События",
      explanation: (
        <>
          <Typography.Text>
            Сколько процессов работало одновременно больше всего и как долго
            держалась такая нагрузка?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нагрузка меняется только в моменты начала и окончания — события.
              Отсортировать события и идти по ним, меняя счётчик.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Проверять каждый момент времени дорого, а событий всего вдвое
            больше, чем интервалов. Под интервалами — сколько их работает между
            соседними событиями:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.greedyTimelineLoad}
            caption={
              <>
                Между соседними событиями число работающих постоянно. Больше
                всего — два, с 12 до 15: нагрузка 2 держалась 3 минуты.
              </>
            }
          />
          <Typography.Text>
            Для модели, в которой объект активен при start ≤ t {"<"} finish,
            записываем в <Notation>{"start"}</Notation> изменение{" "}
            <Notation>{"+1"}</Notation>, в <Notation>{"finish"}</Notation> —
            изменение <Notation>{"-1"}</Notation>. Эта модель называется
            полуинтервалом [start, finish): начало включено, окончание
            исключено. Изменения копим в словаре через{" "}
            <PythonTerm term="dictget">
              <Notation>{"get"}</Notation>
            </PythonTerm>{" "}
            — в один момент может быть несколько событий:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "intervals = [(1, 3), (3, 5), (5, 8), (9, 15), (12, 16)]\nday_end = 18\nchanges = {0: 0, day_end: 0}\nfor start, finish in intervals:\n    changes[start] = changes.get(start, 0) + 1\n    changes[finish] = changes.get(finish, 0) - 1\n\ntimes = sorted(changes)\ncurrent = maximum = total_duration = 0\nfor i in range(len(times) - 1):\n    current += changes[times[i]]\n    duration = times[i + 1] - times[i]\n    if current > maximum:\n        maximum = current\n        total_duration = duration\n    elif current == maximum:\n        total_duration += duration\nprint(maximum, total_duration)"
            }
            label={"Наибольшая нагрузка по событиям"}
            language="python"
            output={"2 3"}
          />
          <Typography.Text>
            Сортировка словаря <Notation>{"sorted(changes)"}</Notation> даёт
            отсортированный список его ключей. Между двумя соседними моментами
            количество активных постоянно. Почему сначала меняем{" "}
            <Notation>{"current"}</Notation>, потом учитываем длительность?
            Потому что после событий в момент <Notation>{"times[i]"}</Notation>{" "}
            новое количество действует до следующего события. В момент 3 одно
            мероприятие заканчивается, другое начинается: общее изменение −1 + 1
            = 0, и количество не меняется.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если нужен максимальный непрерывный период постоянной нагрузки,
              соседние участки с одинаковым количеством нужно объединять.
            </strong>{" "}
            Сам факт событий на их границе ещё не означает изменения количества
            — момент с нулевым итоговым изменением просто пропускают.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "okno-nablyudeniya",
      navLabel: "Окно наблюдения",
      explanation: (
        <>
          <Typography.Text>
            А если нагрузку считают только с 8:00 до 14:00 или оба конца
            интервала включены?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Алгоритм тот же — меняются события: интервалы обрезают краями
              окна, а при включённом конце событие окончания ставят на минуту
              позже.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Интервалы, попавшие в окно частично, учитываются, поэтому каждый
            интервал <strong>обрезают краями окна</strong>:{" "}
            <Notation>{"start = max(start, low)"}</Notation>,{" "}
            <Notation>{"finish = min(finish, high)"}</Notation>, а если после
            этого <Notation>{"start >= finish"}</Notation>, интервал в окно не
            попал. Если в файле вместо начала или окончания стоит 0 со смыслом
            «процесс шёл с начала наблюдения» или «не закончился», его заменяют
            краем окна.
          </Typography.Text>
          <Typography.Text>
            Если время считается целыми моментами и объект активен в оба крайних
            момента отрезка [start, finish], событие окончания ставят в момент{" "}
            <Notation>{"finish + 1"}</Notation>: в момент{" "}
            <Notation>{"finish"}</Notation> объект ещё работает. Сначала
            определяется смысл времени, затем порядок обработки событий.
          </Typography.Text>
          <Typography.Text>
            Число отрезков, в течение которых количество не менялось, считают по
            моментам с ненулевым итоговым изменением. Для наших интервалов за
            период от 0 до 18:
          </Typography.Text>
          <CodeBlock
            code={
              "times = [t for t in sorted(changes) if changes[t] != 0]\npoints = [0] + times + [day_end]\nlengths = [b - a for a, b in zip(points, points[1:])]\nprint(len(lengths), max(lengths), *times)"
            }
            label={"Отрезки постоянного количества"}
            language="python"
            output={"7 7 1 8 9 12 15 16"}
          />
          <Typography.Text>
            Моменты 3 и 5 выпали: в них одно мероприятие заканчивается, а другое
            начинается. Отрезков постоянного количества семь, самый длинный — с
            1 до 8.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "intervaly-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Больше всего мероприятий",
                note: <>по раннему окончанию</>,
              },
              {
                key: "Второй критерий",
                note: <>первые k − 1 жадные, последнее — подобрать</>,
              },
              {
                key: "Занятое время",
                note: <>объединить интервалы, отсортированные по началу</>,
              },
              {
                key: "Нагрузка",
                note: <>события +1 и −1, отсортированные по времени</>,
              },
              {
                key: "Включённый конец",
                note: <>событие окончания в finish + 1</>,
              },
              {
                key: "Окно наблюдения",
                note: <>обрезать интервалы краями окна</>,
              },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "zadacha-1",
      prompt: (
        <>
          Объекты активны на отрезках целых моментов [1, 3] и [3, 5], оба конца
          включены. Сколько объектов активны в момент 3? В какие моменты нужно
          записать события, чтобы программа событий это учла?
        </>
      ),
      reveal: (
        <>
          Два: оба отрезка включают момент 3. События:{" "}
          <Notation>{"+1"}</Notation> в 1 и в 3, <Notation>{"−1"}</Notation> в 4
          и в 6.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Мероприятия (1, 4), (2, 3), (3, 6), (5, 7). Сколько можно провести без
          пересечений?
        </>
      ),
      reveal: (
        <>
          Два: например, (2, 3) и (3, 6). Жадный выбор берёт (2, 3) — оно раньше
          всех заканчивается, — затем (3, 6).
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Мероприятия (0, 4), (4, 8), (3, 5). Почему нельзя первым брать самое
          короткое?
        </>
      ),
      reveal: (
        <>
          Самое короткое (3, 5) пересекается с обоими длинными: выбрав его,
          проведём одно мероприятие, а можно два — (0, 4) и (4, 8).
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Сервер работал в интервалы (1, 4), (2, 6), (8, 10). Сколько он работал
          и сколько простаивал за период от 0 до 12?
        </>
      ),
      reveal: <>Работал 7: периоды 1–6 и 8–10. Простаивал 12 − 7 = 5.</>,
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Процессы работают в полуинтервалы [0, 5), [2, 4), [3, 8). Какая
          наибольшая нагрузка и когда?
        </>
      ),
      reveal: <>3 — с момента 3 до момента 4: в это время работают все три.</>,
    },
  ],
};

export default content;
