import path from 'path';
import readline from 'readline';
import moment from 'moment-timezone';


export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const getCustomOptionReportFile = (inputReportFile) => {
  return inputReportFile ? `--reporter-options cdn=true,timestamp=longDate,overwrite=false,reportDir=testReports,reportFilename=${inputReportFile.replace(/\s/g, '').toLowerCase()}/[status]-[datetime]-report,reportPageTitle=Laporan-Harian-Testing` : `--reporter-options overwrite=false,reportDir=testReports,reportFilename=examples/test-results,reportPageTitle=Laporan-Harian-Testing`;
}

export {
  getCustomOptionReportFile
}