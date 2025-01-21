import { PythonShell } from 'python-shell';

const runPythonScript = (): void => {
  PythonShell.run('calibre-script.py', null, (err, result) => {
    if (err) {
      console.error(`Error: ${err}`);
    } else {
      console.log(`Python script output: ${result}`);
    }
  });
};

runPythonScript();
