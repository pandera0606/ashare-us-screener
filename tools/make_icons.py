# -*- coding: utf-8 -*-
"""Write PNG home-screen icons from the same bar motif as icons/icon.svg."""
from __future__ import print_function

import os
import struct
import zlib

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ICON_DIR = os.path.join(ROOT, "icons")

BG = (23, 27, 34, 255)
UP = (240, 69, 76, 255)
GOLD = (224, 184, 74, 255)
DOWN = (47, 158, 95, 255)


def png_rgba(size, pixels):
    raw = b"".join(b"\x00" + bytes(row) for row in pixels)

    def chunk(tag, data):
        crc = zlib.crc32(tag + data) & 0xFFFFFFFF
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", crc)

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")


def draw(size):
    rows = []
    s = float(size)
    for y in range(size):
        row = bytearray()
        for x in range(size):
            nx, ny = x / s, y / s
            color = BG
            def bar(x0, x1, y0, fill):
                return x0 <= nx <= x1 and y0 <= ny <= 0.79
            if bar(0.21, 0.35, 0.45, UP):
                color = UP
            elif bar(0.43, 0.57, 0.27, GOLD):
                color = GOLD
            elif bar(0.65, 0.79, 0.36, DOWN):
                color = DOWN
            row.extend(color)
        rows.append(row)
    return rows


def write(name, size):
    path = os.path.join(ICON_DIR, name)
    with open(path, "wb") as f:
        f.write(png_rgba(size, draw(size)))
    print("wrote", path)


def main():
    if not os.path.isdir(ICON_DIR):
        os.makedirs(ICON_DIR)
    write("icon-192.png", 192)
    write("icon-512.png", 512)
    write("apple-touch-icon.png", 180)


if __name__ == "__main__":
    main()
