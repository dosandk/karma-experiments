const isObject = data =>
  Object.prototype.toString.call(data) === '[object Object]';

export default isObject;
