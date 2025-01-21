import { exec } from 'child_process';


const convertCommand: string = 'ebook-convert input.epub output.pdf';

exec(convertCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
