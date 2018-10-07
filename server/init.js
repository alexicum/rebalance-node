/**
 * init.js - инициализация приложения:
 *   - загрузка параметров из .env в process.env
 *   - добавление примеси в lodash
 */
// import _ from 'lodash';
import dotenv from 'dotenv';
// import lodashUtils from './utils/lodashUtils';

// https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// Загрузка параметров из .env в process.env
dotenv.load();

// // Добавление примеси в lodash
// _.mixin({
//   deeply: lodashUtils.deeply,
// });
