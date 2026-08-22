#!/usr/bin/env python3
"""Build a privacy-safe sre-kit push batch from JSON request summaries on stdin.

Input may contain IP/request identifiers for classification upstream, but this program deliberately
does not read or emit them. It aggregates only route, status family and coarse traffic class.
"""

import json
import sys

from traffic_telemetry import build

if __name__ == "__main__":
    json.dump(build(sys.stdin.readlines()), sys.stdout, ensure_ascii=False, separators=(",", ":"))
    sys.stdout.write("\n")
