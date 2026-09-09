import fs from 'fs';
import path from 'path';
import git from 'file:///c:/Users/DELL/OneDrive/Desktop/SkillsProof/node_modules/isomorphic-git/index.js';

const projectDir = 'c:\\Users\\DELL\\OneDrive\\Desktop\\SkillsProof';

async function commitAll() {
  console.log('Staging files with isomorphic-git...');
  
  const statusMatrix = await git.statusMatrix({
    fs,
    dir: projectDir,
  });

  let stagedCount = 0;
  for (const [filepath, head, workdir, stage] of statusMatrix) {
    if (filepath.startsWith('node_modules/') || filepath.startsWith('.git/')) continue;

    if (workdir === 0) {
      await git.remove({ fs, dir: projectDir, filepath });
      stagedCount++;
    } else if (workdir !== head || stage !== workdir) {
      await git.add({ fs, dir: projectDir, filepath });
      stagedCount++;
    }
  }

  console.log(`Staged ${stagedCount} files.`);

  if (stagedCount === 0) {
    console.log('Working tree clean, nothing to commit.');
    return;
  }

  const sha = await git.commit({
    fs,
    dir: projectDir,
    message: 'feat: real compiler execution, phone auth, 75% quiz gate, 3-round 85% BBA assessment, fit % fix & application filters',
    author: {
      name: 'Zainab Ayoob',
      email: 'zainab@example.com'
    }
  });

  console.log(`✓ Committed successfully: ${sha}`);
}

commitAll().catch(console.error);
