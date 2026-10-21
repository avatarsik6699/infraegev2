import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  LessonTabs,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonClassesLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-classes.media";

export const pythonClassesLesson = defineCourseLesson({
  ...pythonClassesLessonPublication,
  masteryThreshold: 0.8,
  level: "advanced",
  learningOutcomes: ["Свои типы", "self", "Свойства", "dataclass"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            <strong>Дополнительный урок — для продвинутых.</strong> Он для тех,
            кто хочет писать программы больше экзаменационных: в темах ЕГЭ
            классы не встречаются. Задачи основных уроков решаются без него.
          </Typography.Text>
          <Typography.Text>
            Ты читаешь несколько книг и хочешь вести учёт: название, число
            страниц, текущая страница. Словарь на книгу хранит данные, но
            правило «продвинуться, не перескочив последнюю страницу» живёт
            где-то отдельно, и его легко нарушить.{" "}
            <strong>
              Класс описывает новый тип объектов: какие данные хранит каждый
              объект и какие действия с ними разрешены
            </strong>
            .
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Класс и экземпляр",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Класс — описание нового типа, экземпляр — конкретный объект этого
              типа.
            </strong>{" "}
            Опишем класс прогресса чтения и создадим две книги:
          </Typography.Text>
          <CodeBlock
            code={
              'class ReadingProgress:\n    def __init__(self, title, total_pages):\n        self.title = title\n        self.total_pages = total_pages\n        self.current_page = 0\n\n    def advance(self, pages):\n        self.current_page = min(self.total_pages, self.current_page + pages)\n\nbook = ReadingProgress("Python", 200)\nanother_book = ReadingProgress("Алгоритмы", 300)\nbook.advance(30)\nprint(book.title, book.current_page)\nprint(another_book.title, another_book.current_page)'
            }
            label={"Класс ReadingProgress и два экземпляра"}
            language="python"
            fileName="main.py"
            output={"Python 30\nАлгоритмы 0"}
          />
          <Typography.Text>
            <Notation>{"class"}</Notation> описывает тип. Вызов{" "}
            <Notation>{'ReadingProgress("Python", 200)'}</Notation> создаёт
            новый объект — <strong>экземпляр</strong> — и сразу вызывает для
            него <Notation>{"__init__"}</Notation>: этот специальный метод
            задаёт начальные данные. <strong>Метод</strong> — функция внутри
            класса, как <Notation>{"advance"}</Notation>. У каждого экземпляра
            свои данные, а методы общие:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.classObjects}
            caption={
              <>
                Один класс — сколько угодно экземпляров.{" "}
                <Notation>{"advance"}</Notation> изменил страницу только у{" "}
                <Notation>{"book"}</Notation>: при вызове Python передаёт сам
                объект первым аргументом.
              </>
            }
          />
          <Typography.Text>
            Так устроено{" "}
            <strong>объектно-ориентированное программирование</strong> (ООП):
            программа описывает сущности со своим состоянием и действиями. Для
            суммы чисел класс не нужен — он полезен, когда сущностей много и у
            них есть правила.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "self и атрибуты",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"self"}</Notation> — экземпляр, для которого
              выполняется метод.
            </strong>{" "}
            При <Notation>{"book.advance(30)"}</Notation> Python подставляет{" "}
            <Notation>{"book"}</Notation> в первый параметр: вызов означает{" "}
            <Notation>{"ReadingProgress.advance(book, 30)"}</Notation>. Имя{" "}
            <Notation>{"self"}</Notation> — соглашение, но его пишут всегда.
          </Typography.Text>
          <Typography.Text>
            <strong>Атрибут</strong> — значение, привязанное к объекту:{" "}
            <Notation>{"self.title"}</Notation>,{" "}
            <Notation>{"self.current_page"}</Notation>. Он живёт, пока жив
            объект. Параметр <Notation>{"pages"}</Notation> — обычная локальная
            переменная: после вызова её нет.
          </Typography.Text>
          <Typography.Text>
            Теперь второй шаг: класс сам охраняет свои правила. Число страниц
            должно быть положительным, читать назад нельзя, а доля прочитанного
            — новый метод:
          </Typography.Text>
          <CodeBlock
            code={
              'class ReadingProgress:\n    def __init__(self, title, total_pages):\n        if total_pages <= 0:\n            raise ValueError("Страниц должно быть больше нуля")\n        self.title = title\n        self.total_pages = total_pages\n        self.current_page = 0\n\n    def advance(self, pages):\n        if pages < 0:\n            raise ValueError("Нельзя читать назад")\n        self.current_page = min(self.total_pages, self.current_page + pages)\n\n    def fraction(self):\n        return self.current_page / self.total_pages\n\nbook = ReadingProgress("Python", 200)\nbook.advance(30)\nprint(book.fraction())\nbook.advance(-5)'
            }
            label={"ReadingProgress с проверками и долей прочитанного"}
            collapsible={false}
            language="python"
            fileName="main.py"
            output={"0.15"}
            error={"ValueError: Нельзя читать назад"}
          />
          <Typography.Text>
            Проверки стоят внутри методов, поэтому их не обойти: любая книга
            создаётся через <Notation>{"__init__"}</Notation> и продвигается
            через <Notation>{"advance"}</Notation>. Ошибки — тот же{" "}
            <Notation>{"raise ValueError"}</Notation>, что в уроке об
            исключениях.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Атрибут класса",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Атрибут экземпляра у каждого объекта свой, атрибут класса — один
              на всех.
            </strong>{" "}
            Атрибут экземпляра создают в <Notation>{"__init__"}</Notation> через{" "}
            <Notation>{"self"}</Notation>. Переменная в теле класса вне методов
            — атрибут класса: его видят все экземпляры. Для общей константы это
            удобно, а для списка — ловушка. Сравни:
          </Typography.Text>
          <LessonTabs
            label="Где создан список заметок"
            tabs={[
              {
                label: "в __init__",
                content: (
                  <>
                    <CodeBlock
                      code={
                        'class Notebook:\n    def __init__(self):\n        self.notes = []\n\nfirst = Notebook()\nsecond = Notebook()\nfirst.notes.append("Циклы")\nprint(second.notes)'
                      }
                      label={"Список заметок в __init__"}
                      language="python"
                      fileName="main.py"
                      output={"[]"}
                    />
                    <LessonDiagram
                      {...lessonMedia.notesOwn}
                      caption={
                        <>
                          Каждый вызов <Notation>{"__init__"}</Notation> создал
                          свой список: заметка попала только к{" "}
                          <Notation>{"first"}</Notation>.
                        </>
                      }
                    />
                  </>
                ),
              },
              {
                label: "в теле класса",
                content: (
                  <>
                    <CodeBlock
                      code={
                        'class Notebook:\n    notes = []\n\nfirst = Notebook()\nsecond = Notebook()\nfirst.notes.append("Циклы")\nprint(second.notes)'
                      }
                      label={"Список заметок в теле класса"}
                      language="python"
                      fileName="main.py"
                      output={"['Циклы']"}
                    />
                    <LessonDiagram
                      {...lessonMedia.notesShared}
                      caption={
                        <>
                          Список один на класс:{" "}
                          <Notation>{"first.notes"}</Notation> и{" "}
                          <Notation>{"second.notes"}</Notation> — два имени
                          одного объекта, как <Notation>{"b = a"}</Notation> в
                          уроке о списках.
                        </>
                      }
                    />
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Инкапсуляция и property",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Класс держит правила изменения данных рядом с самими данными.
            </strong>{" "}
            Это и есть <strong>инкапсуляция</strong>: остальная программа меняет
            страницу через <Notation>{"advance"}</Notation>, а не присваиванием
            в разных местах. Имя с подчёркиванием, например{" "}
            <Notation>{"_current_page"}</Notation>, по соглашению значит
            «внутренняя деталь, снаружи не трогать»; запретом это не является.
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: два подчёркивания" kind="nuance">
            <Typography.Text>
              Имя с двумя начальными подчёркиваниями, например{" "}
              <Notation>{"__page"}</Notation>, Python переименовывает внутри
              класса, чтобы оно случайно не совпало с именем в классе-потомке.
              Защитой секретных данных это тоже не является.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            <Notation>{"@property"}</Notation> позволяет читать вычисляемое
            свойство как атрибут:
          </Typography.Text>
          <CodeBlock
            code={
              "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    @property\n    def area(self):\n        return self.width * self.height\n\nrectangle = Rectangle(3, 5)\nprint(rectangle.area)"
            }
            label={"Свойство area у прямоугольника"}
            language="python"
            fileName="main.py"
            output={"15"}
          />
          <Typography.Text>
            <Notation>{"area"}</Notation> читается без скобок, но каждый раз
            вычисляется заново из ширины и высоты. Присвоить{" "}
            <Notation>{"rectangle.area = 10"}</Notation> нельзя: свойство только
            для чтения, Python ответит <Notation>{"AttributeError"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Наследование и композиция",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Наследование уточняет поведение, композиция собирает объект из
              других объектов.
            </strong>{" "}
            <strong>Наследование</strong> создаёт класс на основе другого:
            задача — это именованный предмет, у которого есть ещё отметка о
            выполнении. Наследование уместно, если новый объект можно
            использовать везде, где ждут базовый.
          </Typography.Text>
          <CodeBlock
            code={
              'class NamedItem:\n    def __init__(self, name):\n        self.name = name\n\n    def label(self):\n        return self.name\n\nclass Task(NamedItem):\n    def __init__(self, name, done=False):\n        super().__init__(name)\n        self.done = done\n\n    def label(self):\n        mark = "✓" if self.done else "○"\n        return f"{mark} {self.name}"\n\nfor item in [NamedItem("Книга"), Task("Прочитать", True)]:\n    print(item.label())'
            }
            label={"Task наследует NamedItem и меняет label"}
            language="python"
            fileName="main.py"
            output={"Книга\n✓ Прочитать"}
          />
          <Typography.Text>
            <Notation>{"class Task(NamedItem)"}</Notation> — наследование:{" "}
            <Notation>{"Task"}</Notation> получает всё от{" "}
            <Notation>{"NamedItem"}</Notation>.{" "}
            <Notation>{"super().__init__(name)"}</Notation> вызывает{" "}
            <Notation>{"__init__"}</Notation> базового класса, чтобы не
            повторять его код.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: super при нескольких родителях"
            kind="nuance"
          >
            <Typography.Text>
              Класс может наследовать сразу от нескольких. Тогда{" "}
              <Notation>{"super()"}</Notation> ведёт не обязательно к прямому
              родителю, а к следующему классу в порядке поиска методов.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            <Notation>{"label"}</Notation> переопределён: одинаковый вызов на
            разных объектах может выполнять разную реализацию. Это пример{" "}
            <strong>полиморфизма</strong> — работы через общую форму действия. В
            Python для него не обязательно общее наследование: достаточно, чтобы
            объект поддерживал нужную операцию.
          </Typography.Text>
          <Typography.Text>
            <strong>Композиция</strong> означает, что объект содержит другие
            объекты. Например, учебный курс содержит список уроков. Для
            отношения «содержит» обычно естественна композиция, а не
            наследование «курс является уроком».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s6",
      navLabel: "Специальные методы и dataclass",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Специальные методы связывают класс с обычными средствами языка, а{" "}
              <Notation>{"dataclass"}</Notation> пишет типовой код за нас.
            </strong>{" "}
            <Notation>{"__init__"}</Notation> — первый из них. Ещё:{" "}
            <Notation>{"__repr__"}</Notation> задаёт представление для
            разработчика, <Notation>{"__str__"}</Notation> — текстовое
            представление, <Notation>{"__len__"}</Notation> — поведение{" "}
            <Notation>{"len"}</Notation>, <Notation>{"__eq__"}</Notation> —
            сравнение через <Notation>{"=="}</Notation>. Свои имена с двумя
            подчёркиваниями с двух сторон не придумывают: Python знает только
            свой список.
          </Typography.Text>
          <Typography.Text>
            Если класс в основном хранит запись, модуль{" "}
            <Notation>{"dataclasses"}</Notation> сокращает однотипный код:
          </Typography.Text>
          <CodeBlock
            code={
              "from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n\np = Point(1.0, 2.0)\nq = Point(1.0, 2.0)\nprint(p)\nprint(p == q)"
            }
            label={"Точка как dataclass"}
            language="python"
            fileName="main.py"
            output={"Point(x=1.0, y=2.0)\nTrue"}
          />
          <Typography.Text>
            Декоратор сам пишет <Notation>{"__init__"}</Notation>,{" "}
            <Notation>{"__repr__"}</Notation> и <Notation>{"__eq__"}</Notation>{" "}
            по списку полей. Запись <Notation>{"x: float"}</Notation> объявляет
            поле и ожидаемый тип; подробнее о таких записях — в уроке об
            аннотациях. Число в <Notation>{"float"}</Notation> она не
            превращает.
          </Typography.Text>
          <Typography.Text>
            Для поля-списка нужна фабрика, иначе список окажется общим, как
            атрибут класса выше:
          </Typography.Text>
          <CodeBlock
            code={
              'from dataclasses import dataclass, field\n\n@dataclass\nclass Course:\n    name: str\n    lessons: list = field(default_factory=list)\n\npython = Course("Python")\nexcel = Course("Excel")\npython.lessons.append("Циклы")\nprint(python)\nprint(excel.lessons)'
            }
            label={"Поле-список через default_factory"}
            language="python"
            fileName="main.py"
            output={"Course(name='Python', lessons=['Циклы'])\n[]"}
          />
          <Typography.Text>
            <Notation>{"default_factory=list"}</Notation> вызывает{" "}
            <Notation>{"list()"}</Notation> для каждого нового экземпляра: у
            каждого курса свой список уроков.
          </Typography.Text>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t1",
      prompt: (
        <>
          <Typography.Text>
            Когда для точки лучше кортеж, а когда класс?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Для короткого численного алгоритма <Notation>{"(x, y)"}</Notation>{" "}
            может быть достаточно. Если важны понятные имена полей,
            дополнительные правила и действия с точками в большой программе,
            класс делает договорённость явной. Наличие класса само по себе не
            повышает качество; важно, уменьшает ли он сложность задачи.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Как записать вызов <Notation>{"book.advance(30)"}</Notation> через
            имя класса?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"ReadingProgress.advance(book, 30)"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Чему равно <Notation>{"Rectangle(4, 6).area"}</Notation>? Что
            случится при <Notation>{"rectangle.area = 10"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            24; присваивание вызовет <Notation>{"AttributeError"}</Notation> — у
            свойства нет способа записи.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            Что вернёт <Notation>{'Task("Читать").label()'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>○ Читать.</Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Что выведут <Notation>{"print(Point(0, 1))"}</Notation> и{" "}
            <Notation>{"Point(0, 1) == Point(0, 1.0)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>Point(x=0, y=1) и True: 1 == 1.0.</Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Класс собирает данные и правила их изменения в один тип; экземпляров
        может быть сколько угодно. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Класс и экземпляр",
            note: (
              <>
                <Notation>{"class"}</Notation> описывает тип; вызов класса
                создаёт экземпляр, <Notation>{"__init__"}</Notation> задаёт
                начальные данные.
              </>
            ),
          },
          {
            key: <Notation>{"self"}</Notation>,
            note: (
              <>
                Экземпляр, для которого вызван метод;{" "}
                <Notation>{"self.x"}</Notation> — его атрибут.
              </>
            ),
          },
          {
            key: "Атрибут класса",
            note: (
              <>
                Один на всех: список в теле класса общий, свои данные создают в{" "}
                <Notation>{"__init__"}</Notation>.
              </>
            ),
          },
          {
            key: <Notation>{"@property"}</Notation>,
            note: (
              <>
                Вычисляемое свойство без скобок; наследование уточняет класс,
                композиция — «содержит».
              </>
            ),
          },
          {
            key: <Notation>{"@dataclass"}</Notation>,
            note: (
              <>
                <Notation>{"__init__"}</Notation>,{" "}
                <Notation>{"__repr__"}</Notation>,{" "}
                <Notation>{"__eq__"}</Notation> по полям; список — через{" "}
                <Notation>{"default_factory"}</Notation>.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
