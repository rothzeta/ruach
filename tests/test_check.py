"""Run the resource check against a temporary Ruach-shaped tree."""
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/check.py'


class ResourceCheck(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory(prefix='ruach-check-test-')
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name)
        (self.root / 'scripts').mkdir()
        shutil.copyfile(SCRIPT, self.root / 'scripts/check.py')
        self.skill = self.root / 'skills/ruach-example'
        self.skill.mkdir(parents=True)
        (self.skill / 'SKILL.md').write_text('---\nname: ruach-example\ndescription: Example skill.\n---\n\nBody\n')
        evals = self.root / 'evals/ruach-example/expected'
        evals.mkdir(parents=True)
        (evals / 'rubric.md').write_text('Evaluator-only rubric\n')

    def check(self):
        return subprocess.run([sys.executable, str(self.root / 'scripts/check.py')], capture_output=True, text=True)

    def test_top_level_evals_pass(self):
        result = self.check()
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_evals_or_rubrics_inside_installed_skills_fail(self):
        for relative in ('evals/cases/01/task.md', 'references/rubric.md'):
            with self.subTest(relative=relative):
                path = self.skill / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text('Evaluation material\n')
                result = self.check()
                self.assertEqual(result.returncode, 1)
                self.assertIn(f'skills/ruach-example/{relative.split("/")[0]}', result.stderr)
                shutil.rmtree(self.skill / relative.split('/')[0])
                self.assertEqual(self.check().returncode, 0)


if __name__ == '__main__':
    unittest.main()
