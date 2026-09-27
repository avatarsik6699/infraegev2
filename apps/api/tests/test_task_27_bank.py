"""Independent content, file, ordering and checker checks for EGE task 27."""

import hashlib
import itertools
import math
import subprocess
import sys
from fractions import Fraction
from math import isqrt
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
TASK_IDS = [f"task-27-{number:02d}" for number in range(1, 8)]
EXPECTED = ["3", "1 1", "3", "10", "10", "4 4", "36055 135000"]
WRONG = ["2", "0 0", "6", "12", "5", "3 4", "36056 135000"]
SECTIONS = [
    {"spatial-clusters"},
    {"spatial-clusters"},
    {"energy-clusters"},
    {"cluster-centre"},
    {"distance-and-filter"},
    {"combined-result"},
    {"independent-check", "combined-result"},
]
EXPECTED_SKILLS = [
    [],
    [],
    ["sorting"],
    ["sorting"],
    ["file-processing"],
    ["sorting", "file-processing"],
    ["sorting", "file-processing"],
]


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _attached_path(bank: Bank, task: TaskData) -> Path:
    assert len(task.files) == 1, task.id
    return BANK_DIR / "files" / task.files[0].checksum


def _code(task: TaskData) -> str:
    examples = [block.data.code for block in task.explanation if block.type == "code_example"]
    assert len(examples) == 1, task.id
    return examples[0]


def _task_text(task: TaskData) -> str:
    return "\n".join(block.data.markdown for block in task.statement if block.type == "text")


def _independent_answers(bank: Bank) -> list[str]:
    by_id = {entry.task.id: entry.task for entry in bank.tasks}

    # Apply the stated coordinate bounds directly to every point.
    points = [(0, 0), (1, 0), (1, 1), (2, 2), (5, 5), (5, 6), (7, 1), (9, 0)]
    answer_01 = str(sum(2 <= x < 7 for x, _y in points))

    # Compare complete sums of distances for every candidate, independently of the worked code.
    spatial_points = [(0, 0), (2, 0), (0, 2), (1, 1)]
    totals = {
        point: sum(math.hypot(point[0] - other[0], point[1] - other[1]) for other in spatial_points)
        for point in spatial_points
    }
    assert math.isclose(totals[(0, 0)], 4 + math.sqrt(2))
    assert math.isclose(totals[(2, 0)], 2 + math.sqrt(8) + math.sqrt(2))
    assert math.isclose(totals[(0, 2)], 2 + math.sqrt(8) + math.sqrt(2))
    assert math.isclose(totals[(1, 1)], 3 * math.sqrt(2))
    ranked_centres = sorted(totals.items(), key=lambda item: item[1])
    assert ranked_centres[0][1] < ranked_centres[1][1]
    answer_02 = f"{ranked_centres[0][0][0]} {ranked_centres[0][0][1]}"

    # Fix the small groups explicitly, then check both their widths and the next boundary.
    energy_groups = [[1, 3, 5], [8, 12], [14]]
    assert all(group[-1] - group[0] <= 4 for group in energy_groups)
    assert all(
        next_group[0] - group[0] > 4 for group, next_group in itertools.pairwise(energy_groups)
    )
    answer_03 = str(max(len(group) for group in energy_groups))

    # Brute force each possible one-dimensional centre rather than selecting an index.
    coordinates = [2, 7, 10, 12, 20]
    deviations = {point: sum(abs(point - other) for other in coordinates) for point in coordinates}
    minimum = min(deviations.values())
    centres = [point for point, total in deviations.items() if total == minimum]
    assert len(centres) == 1
    answer_04 = str(centres[0])

    records_path = _attached_path(bank, by_id["task-27-05"])
    records = [line.split() for line in records_path.read_text().splitlines()]
    same_group_distances = []
    for first, second in itertools.combinations(records, 2):
        if first[0] == second[0] and first[1] == second[1] == "II":
            same_group_distances.append(
                math.hypot(int(first[2]) - int(second[2]), int(first[3]) - int(second[3]))
            )
    answer_05 = str(int(max(same_group_distances)))

    decimal_path = _attached_path(bank, by_id["task-27-06"])
    decimal_records = []
    for line in decimal_path.read_text().splitlines():
        particle_id, raw_x, raw_energy = line.split()
        decimal_records.append(
            (float(raw_energy.replace(",", ".")), float(raw_x.replace(",", ".")), particle_id)
        )
    decimal_energy_groups = [[1.0, 1.5, 2.0, 2.3, 2.4], [5.0, 6.5], [10.0], [12.0]]
    assert sorted(record[0] for record in decimal_records) == list(
        itertools.chain.from_iterable(decimal_energy_groups)
    )
    assert all(group[-1] - group[0] <= 1.5 for group in decimal_energy_groups)
    assert all(
        next_group[0] - group[0] > 1.5
        for group, next_group in itertools.pairwise(decimal_energy_groups)
    )
    largest_decimal_group = [
        record for record in decimal_records if record[0] in decimal_energy_groups[0]
    ]
    decimal_deviations = {
        record[2]: sum(abs(record[0] - other[0]) for other in largest_decimal_group)
        for record in largest_decimal_group
    }
    assert decimal_deviations["C"] == min(decimal_deviations.values())
    assert list(decimal_deviations.values()).count(decimal_deviations["C"]) == 1
    decimal_center = next(record for record in largest_decimal_group if record[2] == "C")
    answer_06 = f"{len(decimal_energy_groups)} {int(decimal_center[1])}"

    # Exact rational energies and integer square roots form an independent scaled-answer oracle.
    particle_path = _attached_path(bank, by_id["task-27-07"])
    particles = []
    for line in particle_path.read_text().splitlines():
        raw_x, raw_y, raw_vx, raw_vy, raw_mass, particle_type = line.split()
        x, y, vx, vy, mass = map(int, (raw_x, raw_y, raw_vx, raw_vy, raw_mass))
        energy = Fraction(mass * (vx * vx + vy * vy), 2)
        particles.append((energy, x, y, particle_type))
    expected_energies = [
        [Fraction(1), Fraction(3, 2), Fraction(2)],
        [Fraction(5), Fraction(11, 2), Fraction(6)],
        [Fraction(9), Fraction(19, 2), Fraction(10)],
        [Fraction(13), Fraction(27, 2), Fraction(14)],
    ]
    assert sorted(particle[0] for particle in particles) == list(
        itertools.chain.from_iterable(expected_energies)
    )
    assert all(group[-1] - group[0] <= 2 for group in expected_energies)
    assert all(
        next_group[0] - group[0] > 2 for group, next_group in itertools.pairwise(expected_energies)
    )
    particle_groups = [
        [particle for particle in particles if particle[0] in energy_group]
        for energy_group in expected_energies
    ]
    centers = []
    for group in particle_groups:
        deviations = {
            particle[0]: sum(abs(particle[0] - other[0]) for other in group) for particle in group
        }
        minimum = min(deviations.values())
        assert list(deviations.values()).count(minimum) == 1
        centers.append(next(energy for energy, total in deviations.items() if total == minimum))
    maximum_squared = 0
    within_cluster_squared = []
    for group in particle_groups:
        type_two = [particle for particle in group if particle[3] == "2"]
        local_squared = 0
        for first, second in itertools.combinations(type_two, 2):
            local_squared = max(
                local_squared, (first[1] - second[1]) ** 2 + (first[2] - second[2]) ** 2
            )
        within_cluster_squared.append(local_squared)
        maximum_squared = max(maximum_squared, local_squared)
    assert within_cluster_squared == [1, 1, 9, 13]
    scaled_distance = isqrt(maximum_squared * 100_000_000)
    scaled_energy = int(max(centers) * 10_000)
    answer_07 = f"{scaled_distance} {scaled_energy}"

    return [answer_01, answer_02, answer_03, answer_04, answer_05, answer_06, answer_07]


def test_task_27_answers_files_and_ordered_lesson_progression(tmp_path: Path) -> None:
    bank = _bank()
    bank.validate_references()
    material = next(item for item in bank.materials if item.id == "data-analysis")
    assert material.kind == "topic" and material.status == "published"
    assert material.sections == [
        "points-and-records",
        "spatial-clusters",
        "energy-clusters",
        "cluster-centre",
        "distance-and-filter",
        "combined-result",
        "independent-check",
    ]

    entries = [
        next(entry for entry in bank.tasks if entry.task.id == task_id) for task_id in TASK_IDS
    ]
    assert _independent_answers(bank) == EXPECTED
    assert [entry.task.lessons[0].position for entry in entries] == list(range(7))
    assert [entry.task.difficulty for entry in entries] == [1, 2, 2, 2, 3, 3, 3]

    file_map = {item.checksum: item for item in bank.files}
    for index, entry in enumerate(entries):
        task = entry.task
        assert task.exam_numbers == []
        assert task.catalog_visible is False and task.archived is False
        assert task.interaction_type == "production"
        assert task.lessons[0].material_id == "data-analysis"
        assert {link.material_id for link in task.theory_links} == {"data-analysis"}
        assert {link.section for link in task.theory_links} == SECTIONS[index]
        assert len(task.sources) == 1
        assert task.sources[0].kind == "original" and task.sources[0].is_public
        assert task.checker.answer_variants == [EXPECTED[index]]
        assert is_correct(task.checker, EXPECTED[index])
        assert not is_correct(task.checker, WRONG[index])
        assert task.hint and task.explanation
        assert task.skills == EXPECTED_SKILLS[index]

        if index < 4:
            assert task.files == []
        else:
            assert len(task.files) == 1 and task.files[0].purpose == "attachment"
            usage = task.files[0]
            metadata = file_map[usage.checksum]
            data = (BANK_DIR / "files" / usage.checksum).read_bytes()
            assert hashlib.sha256(data).hexdigest() == usage.checksum == metadata.storage_key
            assert len(data) == metadata.size_bytes
            assert data.endswith(b"\n") and b"\r" not in data
            (tmp_path / usage.filename).write_bytes(data)

        result = subprocess.run(
            [sys.executable, "-c", _code(task)],
            cwd=tmp_path,
            capture_output=True,
            text=True,
            check=True,
        )
        assert result.stdout.strip() == EXPECTED[index], task.id


def test_task_27_boundaries_and_counterexamples_are_explicit() -> None:
    bank = _bank()
    tasks = {entry.task.id: entry.task for entry in bank.tasks if entry.task.id in TASK_IDS}

    assert "2 <= x < 7" in _task_text(tasks["task-27-01"])
    assert "наименьшей ещё не распределённой энергии" in _task_text(tasks["task-27-03"])
    assert "медианной энергией" in _task_text(tasks["task-27-06"])
    assert "размах max(E)−min(E)" in _task_text(tasks["task-27-07"])
    assert "отбрасывает дробную часть" in _task_text(tasks["task-27-07"])
    assert 2 <= 2 < 7  # the lower coordinate boundary is included
    assert not 2 <= 7 < 7  # the upper coordinate boundary is excluded

    # Adjacent gaps of 4 do not make [1, 3, 5, 8] a valid width-4 cluster.
    assert 8 - 1 > 4 and 3 - 1 <= 4 and 5 - 3 <= 4 and 8 - 5 <= 4

    decimal_task = tasks["task-27-06"]
    decimal_records = [
        line.split() for line in _attached_path(bank, decimal_task).read_text().splitlines()
    ]
    energies = sorted(float(record[2].replace(",", ".")) for record in decimal_records)
    assert energies[:5] == [1.0, 1.5, 2.0, 2.3, 2.4]
    assert energies[5:7] == [5.0, 6.5]  # inclusive width boundary
    assert 6.5 - 5.0 == 1.5

    integrated = [
        line.split() for line in _attached_path(bank, tasks["task-27-07"]).read_text().splitlines()
    ]
    exact_energies = [
        Fraction(int(row[4]) * (int(row[2]) ** 2 + int(row[3]) ** 2), 2) for row in integrated
    ]
    assert sorted(exact_energies) == [
        Fraction(1),
        Fraction(3, 2),
        Fraction(2),
        Fraction(5),
        Fraction(11, 2),
        Fraction(6),
        Fraction(9),
        Fraction(19, 2),
        Fraction(10),
        Fraction(13),
        Fraction(27, 2),
        Fraction(14),
    ]
    assert isqrt(13 * 100_000_000) == 36055  # int(sqrt(13) * 10000), truncating the fraction
