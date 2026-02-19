#!/usr/bin/env python3
"""
Main build script - Run all 4 steps in sequence
Usage: build.py <input.pdf|input.md> [output_dir] [options]

Options:
  --level N       Split granularity: 2 (H2), 3 (H2+H3), 4 (H2+H3+H4)
  --max-items N   Split lists into separate slides if > N items
  --max-chars N   Split content if > N characters
"""

import sys
import os
import json
import tempfile
import argparse
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent


def run_step(script_name: str, args: list) -> str:
    """Run a Python script and return output path."""
    script_path = SCRIPT_DIR / script_name

    temp_fd, temp_path = tempfile.mkstemp(suffix='.json' if 'parse' in script_name else '.md')
    os.close(temp_fd)

    import subprocess
    cmd = [sys.executable, str(script_path)] + args + [temp_path]
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"Error running {script_name}:")
        print(result.stderr)
        sys.exit(1)

    return temp_path


def main():
    parser = argparse.ArgumentParser(description='Build presentation from PDF/MD')
    parser.add_argument('input', help='Input PDF or MD file')
    parser.add_argument('output', nargs='?', default='dist', help='Output directory')
    parser.add_argument('--level', type=int, default=3, choices=[2, 3, 4, 5, 6],
                        help='Heading level for splitting')
    parser.add_argument('--max-items', type=int, default=0,
                        help='Split lists if > N items')
    parser.add_argument('--max-chars', type=int, default=0,
                        help='Split content if > N chars')
    parser.add_argument('--images', type=str, default=None,
                        help='Images directory for auto-matching')

    args = parser.parse_args()

    input_path = args.input
    output_dir = args.output

    if not os.path.exists(input_path):
        print(f"Error: File not found: {input_path}")
        sys.exit(1)

    print(f"Building presentation from: {input_path}")
    print(f"Options: level={args.level}, max_items={args.max_items}, max_chars={args.max_chars}")
    if args.images:
        print(f"Images dir: {args.images}")
    print("=" * 50)

    # Build parse args
    parse_args = [input_path]
    if args.level != 3:
        parse_args.extend(['--level', str(args.level)])
    if args.max_items > 0:
        parse_args.extend(['--max-items', str(args.max_items)])
    if args.max_chars > 0:
        parse_args.extend(['--max-chars', str(args.max_chars)])

    # Step 1: Parse
    print("Step 1: Parsing...")
    parse_output = run_step('parse.py', parse_args)

    # Step 2: Paginate
    print("Step 2: Paginating...")
    paginate_output = run_step('paginate.py', [parse_output])

    # Step 3: Enhance
    print("Step 3: Enhancing...")
    enhance_output = run_step('enhance.py', [paginate_output])

    # Step 4: Compile
    print("Step 4: Compiling...")
    import subprocess
    compile_cmd = [sys.executable, str(SCRIPT_DIR / 'compile.py'), parse_output, output_dir]
    if args.images:
        compile_cmd.extend(['', args.images])  # empty string as placeholder for template_dir
    result = subprocess.run(compile_cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"Error during compilation:")
        print(result.stderr)
        sys.exit(1)

    print("=" * 50)
    print(f"Done! Output saved to: {output_dir}")

    # Cleanup temp files
    for f in [parse_output, paginate_output, enhance_output]:
        try:
            os.remove(f)
        except:
            pass


if __name__ == '__main__':
    main()
