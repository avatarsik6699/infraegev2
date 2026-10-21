"""Independent answer and content checks for the EGE topic 10 lesson «IP-адреса и маски».

The bank's programs use the standard module ``ipaddress``. Here every answer is recomputed
with plain 32-bit integers: a mask of length p is ``(2³² − 1) ^ (2^(32 − p) − 1)``, the
network is ``address & mask``, the last address is ``network | ~mask``, the masks under
which a node lies in a network are tested bit by bit, and the conditions on the binary
record count set bits with ``int.bit_count``. The bank's own solution programs must print
the same answers.
"""

import subprocess
import sys
from math import comb
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "networks"
FULL = 2**32 - 1


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def ip(text: str) -> int:
    a, b, c, d = (int(x) for x in text.split("."))
    return a << 24 | b << 16 | c << 8 | d


def text(value: int) -> str:
    return ".".join(str(value >> s & 255) for s in (24, 16, 8, 0))


def mask(p: int) -> int:
    return FULL ^ ((1 << (32 - p)) - 1)


def prefix(dotted: str) -> int:
    return ip(dotted).bit_count()


def net(address: int, p: int) -> int:
    return address & mask(p)


def last(address: int, p: int) -> int:
    return net(address, p) | (FULL ^ mask(p))


def byte(value: int, k: int) -> int:
    return value >> (24 - 8 * k) & 255


def ordinary(address: int, p: int) -> bool:
    return address not in (net(address, p), last(address, p))


def lengths(node: str, network: str) -> list[int]:
    return [p for p in range(33) if net(ip(node), p) == ip(network)]


def shared(a: str, b: str) -> list[int]:
    return [p for p in range(33) if net(ip(a), p) == net(ip(b), p)]


def longest_ordinary(a: str, b: str) -> int:
    return max(p for p in shared(a, b) if ordinary(ip(a), p) and ordinary(ip(b), p))


def addresses(network: str, p: int, hosts: bool = False) -> range:
    start = ip(network)
    end = last(start, p)
    return range(start + 1, end) if hosts else range(start, end + 1)


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    a: dict[str, str] = {}
    # subtopic 1
    a["task-10-1-01"] = f"{150:08b}"
    a["task-10-1-03"] = text(mask(27))
    a["task-10-1-04"] = str((37).bit_count())
    p = prefix("255.255.254.0")
    a["task-10-1-05"] = str(32 - p)
    a["task-10-1-07"] = str(ip("192.168.10.173").bit_count())
    a["task-10-1-08"] = str(byte(mask(29), 3))
    a["task-10-1-09"] = str(len({(255 << (8 - k)) & 255 for k in range(9)}))
    # subtopic 2: the block of the last mask octet
    a["task-10-2-01"] = text(net(ip("10.8.45.200"), prefix("255.255.255.224")))
    node = ip("192.168.5.77")
    a["task-10-2-03"] = text(last(node, 27) - 1)
    a["task-10-2-04"] = str(2 ** (32 - prefix("255.255.255.240")) - 2)
    a["task-10-2-05"] = text(net(ip("81.200.130.9"), prefix("255.255.192.0")))
    node, p = ip("46.31.250.17"), prefix("255.255.240.0")
    a["task-10-2-06"] = text(last(node, p))
    letters = {0: "A", 3: "B", 47: "C", 152: "D", 155: "E", 211: "F", 248: "G", 255: "H"}
    network = net(ip("211.47.155.3"), prefix("255.255.248.0"))
    a["task-10-2-07"] = "".join(letters[byte(network, k)] for k in range(4))
    network = net(ip("157.230.96.214"), prefix("255.255.255.248"))
    a["task-10-2-08"] = str(sum(byte(network, k) for k in range(4)))
    top = last(ip("64.137.205.18"), prefix("255.255.252.0")) - 1
    a["task-10-2-09"] = str(sum(byte(top, k) for k in range(4)))
    # subtopic 3
    p = prefix("255.255.248.0")
    a["task-10-3-01"] = str(2 ** (32 - p) - 2)
    node = ip("192.168.4.207")
    a["task-10-3-02"] = str(node - net(node, 27))
    node = ip("10.5.142.77")
    a["task-10-3-03"] = str(node - net(node, 21))
    h = next(h for h in range(33) if 2**h - 2 >= 1000)
    a["task-10-3-04"] = text(mask(32 - h))
    a["task-10-3-05"] = str(2 ** (26 - 24))
    a["task-10-3-06"] = text(ip("10.40.16.0") + 1000)
    a["task-10-3-07"] = str(2**13)
    node = ip("118.64.201.90")
    a["task-10-3-08"] = str(node - net(node, prefix("255.255.240.0")))
    a["task-10-3-09"] = str(2 ** (32 - prefix("255.255.255.128")) - 2)
    # subtopic 4: masks by the network
    ps = lengths("85.112.43.200", "85.112.43.192")
    a["task-10-4-02"] = str(min(byte(mask(p), 3) for p in ps))
    ps = lengths("131.70.215.9", "131.70.208.0")
    a["task-10-4-03"] = str(max(ps))
    a["task-10-4-04"] = str(32 - max(ps))
    a["task-10-4-05"] = str(len(lengths("200.15.77.130", "200.15.77.128")))
    (only,) = lengths("74.219.187.66", "74.219.176.0")
    a["task-10-4-07"] = str(byte(mask(only), 2))
    ps = lengths("141.97.58.197", "141.97.58.192")
    a["task-10-4-08"] = str(max(ps))
    a["task-10-4-09"] = str(2 ** (32 - min(ps)))
    # subtopic 5: two nodes
    same = shared("10.30.52.1", "10.30.55.250")
    a["task-10-5-01"] = str(max(same))
    p = longest_ordinary("90.14.200.33", "90.14.203.140")
    a["task-10-5-02"] = str(p)
    a["task-10-5-03"] = str(2 ** (32 - p))
    a["task-10-5-04"] = str(max(shared("156.71.33.90", "156.71.33.120")) + 1)
    a["task-10-5-05"] = str(longest_ordinary("61.5.96.0", "61.5.111.7"))
    a["task-10-5-06"] = str(byte(mask(longest_ordinary("18.240.130.5", "18.240.141.77")), 2))
    a["task-10-5-07"] = str(byte(mask(max(shared("205.66.157.48", "205.66.149.230")) + 1), 2))
    a["task-10-5-08"] = str(byte(mask(longest_ordinary("77.180.12.9", "77.184.250.4")), 1))
    # subtopic 6: bits of the addresses of a network
    a["task-10-6-01"] = str(sum(x.bit_count() == 8 for x in addresses("192.168.1.0", 29)))
    even = [x for x in addresses("192.168.1.0", 29) if x.bit_count() % 2 == 0]
    hosts = [x for x in even if ordinary(x, 29)]
    a["task-10-6-02"] = str(len(hosts))
    a["task-10-6-03"] = str(sum(x.bit_count() == 3 for x in addresses("10.0.0.0", 28)))
    a["task-10-6-04"] = str(sum(x.bit_count() % 3 == 0 for x in addresses("172.16.5.64", 26)))
    a["task-10-6-05"] = str(max(x.bit_count() for x in addresses("192.168.0.0", 24, True)))
    a["task-10-6-06"] = str(sum((byte(x, 2)).bit_count() == 4 for x in addresses("10.20.0.0", 18)))
    start = text(net(ip("180.45.101.7"), 19))
    first = next(x for x in addresses(start, 19, True) if x.bit_count() % 4 == 0)
    a["task-10-6-07"] = text(first).replace(".", "")
    p = longest_ordinary("52.118.40.17", "52.118.45.200")
    start = text(net(ip("52.118.40.17"), p))
    a["task-10-6-08"] = str(sum(x.bit_count() == 15 for x in addresses(start, p)))
    a["task-10-6-09"] = str(sum(x.bit_count() % 3 != 0 for x in addresses("201.33.148.0", 28)))
    a["task-10-6-10"] = str(
        max(
            sum(byte(x, k) for k in range(4))
            for x in addresses("115.180.0.0", 14, True)
            if x.bit_count() == 16
        )
    )

    # subtopic 7: positions of ones
    def count_k(network: int, p: int, k: int) -> int:
        c = network.bit_count()
        return comb(32 - p, k - c) if k >= c else 0

    a["task-10-7-01"] = str(count_k(ip("10.0.0.0"), 27, 4))
    a["task-10-7-02"] = str(count_k(ip("172.16.0.0"), 12, 10))
    for task, node, k in (("task-10-7-03", "12.34.56.78", 10), ("task-10-7-04", "19.6.140.33", 12)):
        found = [
            count_k(net(ip(node), p), p, k)
            for p in range(33)
            if net(ip(node), p).bit_count() == 32 - p
        ]
        (value,) = found
        a[task] = str(value)
    node = ip("129.0.1.200")
    best = 0
    for p in range(33):
        c = net(node, p).bit_count()
        if (node - net(node, p)).bit_count() == c:
            best = max(best, comb(32 - p, c))
    a["task-10-7-05"] = str(best)
    node = ip("10.66.129.3")
    (p,) = [p for p in range(33) if count_k(net(node, p), p, 9) == 56]
    a["task-10-7-06"] = str(p)
    p = longest_ordinary("61.200.37.5", "61.200.200.61")
    a["task-10-7-07"] = str(count_k(net(ip("61.200.37.5"), p), p, 12))
    # Практика и итог
    network = net(ip("93.180.214.77"), prefix("255.255.255.192"))
    a["task-10-8-01"] = str(sum(byte(network, k) for k in range(4)))
    a["task-10-8-02"] = str(min(lengths("140.33.118.46", "140.33.112.0")))
    a["task-10-8-03"] = str(byte(mask(longest_ordinary("66.12.250.3", "66.12.236.190")), 2))
    a["task-10-8-04"] = str(sum(x.bit_count() % 5 == 0 for x in addresses("150.8.64.0", 27)))
    top = last(ip("31.87.140.250"), prefix("255.255.248.0")) - 1
    a["task-10-8-05"] = text(top).replace(".", "")
    return a


def _solution(task: TaskData) -> str:
    (code,) = [
        block.data.code
        for block in task.explanation
        if block.type == "code_example" and block.data.language == "python"
    ]
    return code


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(61))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [10] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-10-8-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith("task-10-7-")
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_checker_accepts_the_answer_and_rejects_a_neighbour(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        last_char = expected[-1]
        wrong = expected[:-1] + ("0" if last_char != "0" else "1")
        assert not is_correct(task.checker, wrong), task_id


def test_solution_programs_print_the_answer(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        code = _solution(task)
        result = subprocess.run(
            [sys.executable, "-I", "-c", code],
            capture_output=True,
            text=True,
            check=True,
            timeout=300,
        )
        assert " ".join(result.stdout.split()) == answers[task_id], task_id
        assert all(len(line) <= 64 for line in code.splitlines()), task_id
