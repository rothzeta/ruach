"""Exercise install/check through CLI and Git objects; never assert source wording."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/install.py'


class SnapshotContracts(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='ruach-install-test-')
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.source = self.base / 'source with spaces'
        self.source.mkdir()
        for directory in ('agents', 'skills/ruach-example', 'scripts'):
            (self.source / directory).mkdir(parents=True)
        (self.source / 'agents/implementer.md').write_text('Shared role\n')
        (self.source / 'skills/ruach-example/SKILL.md').write_text('Shared skill\n')
        (self.source / 'skills/ruach-example/tool.py').write_text('print("shared")\n')
        (self.source / 'skills/ruach-example/tool.py').chmod(0o755)
        (self.source / 'evals/ruach-example/expected').mkdir(parents=True)
        (self.source / 'evals/ruach-example/expected/rubric.md').write_text('Evaluator-only rubric\n')
        for name in ('LICENSE', 'PROVENANCE.md'):
            (self.source / name).write_text(name + '\n')
        shutil.copyfile(SCRIPT, self.source / 'scripts/install.py')
        self.git('init', '-q')
        self.sha = self.commit()
        self.target = self.base / 'consumer with spaces/.agents'
        self.target.mkdir(parents=True)
        (self.target / 'roles.yaml').write_text('consumer preference\n')

    def git(self, *args):
        return subprocess.check_output(['git', '-C', str(self.source), '-c', 'user.name=Fixture',
                                       '-c', 'user.email=fixture@example.invalid', *args], stderr=subprocess.PIPE).decode().strip()

    def commit(self):
        self.git('add', '-A')
        self.git('commit', '-qm', 'Fixture')
        return self.git('rev-parse', 'HEAD')

    def run_cli(self, *args, script=SCRIPT, success=True):
        result = subprocess.run([sys.executable, str(script), *args, '--target', str(self.target)],
                                cwd=self.base, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0 if success else 1, result.stderr)
        return result

    def install(self, revision=None, *extra, success=True):
        return self.run_cli('install', '--source', str(self.source), '--revision', revision or self.sha,
                            *extra, success=success)

    def test_committed_snapshot_runs_without_source_and_preserves_policy(self):
        (self.source / 'agents/implementer.md').write_text('uncommitted change\n')
        self.install()
        self.assertEqual((self.target / 'agents/implementer.md').read_text(), 'Shared role\n')
        self.assertEqual((self.target / 'roles.yaml').read_text(), 'consumer preference\n')
        data = json.loads((self.target / 'ruach.json').read_text())
        self.assertEqual(data['revision'], self.sha)
        self.assertEqual(data['origin'], 'https://github.com/rothzeta/ruach.git')
        self.assertTrue((self.target / 'skills/ruach-example/tool.py').stat().st_mode & 0o111)
        shutil.rmtree(self.source)
        self.run_cli('check', script=self.target / 'ruach-install.py')

    def test_development_evals_are_not_installed(self):
        self.install()
        installed = [p.relative_to(self.target) for p in self.target.rglob('*')]
        self.assertTrue(installed)
        self.assertFalse([p for p in installed if 'evals' in p.parts or 'rubric' in p.name])
        recorded = json.loads((self.target / 'ruach.json').read_text())['files']
        self.assertFalse([name for name in recorded if 'evals' in name or 'rubric' in name])
        self.run_cli('check', '--source', str(self.source))

    def test_drift_requires_explicit_replace_before_update(self):
        self.install()
        (self.target / 'agents/implementer.md').write_text('local edit\n')
        self.run_cli('check', success=False)
        self.install(success=False)
        self.assertEqual((self.target / 'agents/implementer.md').read_text(), 'local edit\n')
        self.install(self.sha, '--replace')
        self.run_cli('check', '--source', str(self.source))

    def test_added_skill_files_are_drift_but_extra_consumer_skills_are_allowed(self):
        self.install()
        local = self.target / 'skills/local-example'
        local.mkdir()
        (local / 'SKILL.md').write_text('Consumer skill')
        deps = self.target / 'skills/ruach-example/node_modules'
        deps.mkdir()
        (deps / 'installed').write_text('Runtime dependency')
        self.run_cli('check')
        (self.target / 'skills/ruach-example/added.md').write_text('unrecorded')
        self.run_cli('check', success=False)
        self.install(self.sha, '--replace')
        self.run_cli('check')
        self.assertTrue((local / 'SKILL.md').exists())
        self.assertTrue((deps / 'installed').exists())

    def test_update_prunes_only_previously_managed_files(self):
        self.install()
        (self.source / 'skills/ruach-example/tool.py').unlink()
        (self.source / 'agents/implementer.md').write_text('Updated shared role\n')
        newer = self.commit()
        self.install(newer)
        self.assertFalse((self.target / 'skills/ruach-example/tool.py').exists())
        self.assertEqual((self.target / 'roles.yaml').read_text(), 'consumer preference\n')
        self.run_cli('check', '--source', str(self.source))

    def test_unmanaged_conflict_fails_before_any_write(self):
        (self.target / 'agents').mkdir()
        (self.target / 'agents/implementer.md').write_text('consumer role')
        self.install(success=False)
        self.assertFalse((self.target / 'ruach.json').exists())
        self.assertFalse((self.target / 'skills').exists())
        self.install(self.sha, '--replace')
        self.run_cli('check')

    def test_symlink_destination_and_source_are_rejected(self):
        external = self.base / 'external'
        external.mkdir()
        (self.target / 'skills').symlink_to(external, target_is_directory=True)
        self.install(self.sha, '--replace', success=False)
        self.assertEqual(list(external.iterdir()), [])
        (self.target / 'skills').unlink()
        (self.source / 'skills/ruach-example/alias').symlink_to('../../../external')
        revision = self.commit()
        self.install(revision, success=False)
        self.assertFalse((self.target / 'agents').exists())

    def test_metadata_symlink_is_rejected_before_writes(self):
        outside = self.base / 'outside'
        (self.target / 'ruach.json').symlink_to(outside)
        self.install(self.sha, '--replace', success=False)
        self.assertFalse((self.target / 'agents').exists())
        self.assertFalse(outside.exists())

    def test_missing_file_and_executable_mode_drift_are_detected(self):
        self.install()
        tool = self.target / 'skills/ruach-example/tool.py'
        tool.chmod(0o644)
        self.run_cli('check', success=False)
        self.install(self.sha, '--replace')
        tool.unlink()
        self.run_cli('check', success=False)

    def test_upstream_check_detects_locally_rewritten_manifest(self):
        self.install()
        changed = self.target / 'agents/implementer.md'
        changed.write_text('altered\n')
        path = self.target / 'ruach.json'
        data = json.loads(path.read_text())
        data['files']['agents/implementer.md']['sha256'] = hashlib.sha256(changed.read_bytes()).hexdigest()
        path.write_text(json.dumps(data))
        self.run_cli('check')  # Local integrity trusts the committed consumer manifest.
        self.run_cli('check', '--source', str(self.source), success=False)

    def test_invalid_revision_and_unsafe_metadata_do_not_mutate(self):
        self.install('not-a-commit', success=False)
        self.assertFalse((self.target / 'agents').exists())
        self.install()
        metadata = self.target / 'ruach.json'
        data = json.loads(metadata.read_text())
        data['files']['../../outside'] = {'sha256': '0' * 64, 'mode': 420}
        metadata.write_text(json.dumps(data))
        self.run_cli('check', success=False)
        self.install(self.sha, '--replace', success=False)
        self.assertFalse((self.base / 'outside').exists())


if __name__ == '__main__':
    unittest.main()
