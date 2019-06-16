const fs = require('fs');
const puppeteer = require('puppeteer');

const QUESTIONS_URL = 'https://github.com/lydiahallie/javascript-questions';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(QUESTIONS_URL);

  const questions = await page.evaluate(() => {
    return getQuestions('h6');

    function getQuestions(selector) {
        const rootElement = document.querySelector('.markdown-body');
        const questionNodes = Array.from(rootElement.querySelectorAll(selector))
            .filter(({ innerText }) => /^[0-9].+$/.test(innerText));

        const questions = questionNodes.map((node, index) => ({
            id: index + 1,
            title: node.innerText,
            text: null,
            code: getCode(node),
            choices: getChoices(node),
            answer: getAnswer(node)
        }));

        return questions;
    }
    function getCode(node) {
      const rootNode = getNextSibling(node, '.highlight.highlight-source-js');
      const codeNode = rootNode && rootNode.querySelector('pre');
      const code = codeNode && codeNode.innerText;
      return code;
    }
    function getChoices(node) {
      const rootNode = getNextSibling(node, 'ul');
      const choices = rootNode && rootNode.innerText.split('\n');
      return choices;
    }
    function getAnswer(node) {
      return getNextSibling(node, 'details').innerHTML;
      // return {
      //   answer: null,
      //   description: null
      // }
    }
    function getNextSibling(element, selector) {
    	let sibling = element.nextElementSibling;

    	// If there's no selector, return the first sibling
    	if (!selector) return sibling;

    	// If the sibling matches our selector, use it
    	// If not, jump to the next sibling and continue the loop
    	while (sibling) {
    		if (sibling.matches(selector)) return sibling;
    		sibling = sibling.nextElementSibling
    	}
    }
  });

  fs.writeFile('src/assets/data/questions.json', JSON.stringify(questions), err => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  await browser.close();
})();
