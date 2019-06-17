import { h } from 'preact';
import Logo from './Logo';

const Intro = () => (
	<div className="intro">
    <Logo size={150} />
    <h1>Questions</h1>
    <p>From basic to advanced: test how well you know JavaScript, refresh your knowledge a bit, or prepare for your coding interview.</p>
    <a href="/#1" className="Button width-full">Start</a>
	</div>
);

export default Intro;
