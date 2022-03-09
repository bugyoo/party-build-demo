/**
 * Created by litao on 2018/10/8.
 */
import JBoot from 'jboot-env';
// import JBoot from '../../../jboot-env/index';

import Vue from 'vue';
import './style/index.scss';

import configure from './configure/index';
let T = new JBoot(Vue, configure);

console.log(T);
