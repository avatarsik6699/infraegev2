# Задание 2 ЕГЭ. Полный перебор с проверкой различных строк.
# Измените f, names и fragment под свою задачу.
# В примере ожидается ответ zxwy. None обозначает пропуск.

from itertools import product, permutations

def f(values):
    x = values['x']
    y = values['y']
    z = values['z']
    w = values['w']
    return int(((not x) or y) and
               ((not y) or z) and
               ((not z) or w))

names = 'xyzw'
fragment = [
    ((0, None, 1, None), 1),
    ((1, 0, None, 0), 1),
    ((None, 0, 1, 1), 1),
]

all_rows = list(product((0, 1), repeat=len(names)))
answers = set()

for order in permutations(names):
    candidates = []

    for pattern, wanted in fragment:
        matching = []

        for row in all_rows:
            fits = True

            for col in range(len(names)):
                if (pattern[col] is not None and
                        pattern[col] != row[col]):
                    fits = False
                    break

            values = dict(zip(order, row))
            if fits and f(values) == wanted:
                matching.append(row)

        candidates.append(matching)

    for restored in product(*candidates):
        if len(set(restored)) == len(restored):
            answers.add(''.join(order))
            break

print(sorted(answers))
