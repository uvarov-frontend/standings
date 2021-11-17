const FtpDeploy = require('ftp-deploy');
const ftpData = require('../.ftpdata');

/**
// Шаблон файла .ftpdata
module.exports = {
  user: '',
  password: '',
  host: '',
  port: 21,
  root: '/'
}
 */

new FtpDeploy().deploy({
	user: ftpData.user,
	password: ftpData.password,
	host: ftpData.host,
	port: ftpData.port,
	remoteRoot: ftpData.root,
	localRoot: `${__dirname}/../build`,
	include: ['.*', '*', '**/*'],
	exclude: ['.DS_Store'],
	deleteRemote: true,
	forcePasv: true,
	sftp: false,
});
