console.log('PROD: ', process.env.NODE_ENV === 'production');
const DEBUG = !(process.env.NODE_ENV === 'production');

export default { DEBUG };
