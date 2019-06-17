const fs = require('fs');
const puppeteer = require('puppeteer');
const TurndownService = require('turndown');

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
      const choiceNodes = Array.from(rootNode.querySelectorAll('li'));
      const choices = choiceNodes.map(node => node.innerHTML);
      return choices;
    }
    function getAnswer(node) {
      const rootNode = getNextSibling(node, 'details');
      const answerNodes = Array.from(rootNode.querySelectorAll(':not(summary)'));
      const answer = answerNodes.map(node => node.innerHTML).join('');
      return rootNode.innerHTML;
      return answer;
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

  saveQuestions(questions);
  await browser.close();
})();

function saveQuestions(data) {
  const turndownService = new TurndownService();
  const questions = data.map(data => {
    data.answer = turndownService.turndown(data.answer).replace('**Answer**\n\n', '');
    data.choices = data.choices.map(choice => turndownService.turndown(choice));
    return data;
  });

  fs.writeFile('src/assets/questions.json', JSON.stringify(questions, null, 2), err => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}
