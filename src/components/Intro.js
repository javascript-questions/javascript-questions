import { h } from 'preact';
import Logo from './Logo';

const Intro = () => (
	<div class="Intro">
    <Logo size={150} />
    <h1>JavaScript Questions</h1>
    <p>From basic to advanced: test how well you know JavaScript, refresh your knowledge a bit, or prepare for your coding interview.</p>
    <a href="/#1" class="Button width-full">Start</a>
    <p>
      <a href="https://github.com/andreruffert/javascript-questions">PWA</a> build by{' '}
      <a href="https://github.com/andreruffert">André Ruffert</a>,{' '}
      <a href="https://github.com/lydiahallie/javascript-questions">questions</a> by{' '}
      <a href="https://github.com/lydiahallie">Lydia Hallie</a>.
    </p>
	</div>
);

export default Intro;
