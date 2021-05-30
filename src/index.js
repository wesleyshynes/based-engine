import _ from 'lodash';
import './assets/style.scss';
// import Star from './assets/star.png'

function component() {
  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  // Add the image to our existing div.
  // const myImg = new Image();
  // myImg.src = Star
  //
  // element.appendChild(myImg);

  return element;
}

document.body.appendChild(component());
