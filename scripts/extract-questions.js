const fs = require('fs');
const puppeteer = require('puppeteer');
const TurndownService = require('turndown');
const hljs = require('highlight.js/lib/core');
const javascript = require('highlight.js/lib/languages/javascript');
hljs.registerLanguage('javascript', javascript);

const QUESTIONS_URL = 'https://github.com/lydiahallie/javascript-questions';
const QUESTIONS_PATH = 'src/assets/questions.json';
const CACHED_QUESTIONS_RAW = fs.readFileSync(QUESTIONS_PATH);
const CACHED_QUESTIONS = JSON.parse(CACHED_QUESTIONS_RAW);

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
  const questions = {
    updatedAt: new Date(),
    data: data.map(data => {
      data.code = hljs.highlight('javascript', data.code).value;
      data.answer = turndownService.turndown(data.answer).replace('**Answer**\n\n', '');
      data.choices = data.choices.map(choice => turndownService.turndown(choice));
      return data;
    })
  };

  // Quick diff before saving
  if (JSON.stringify(CACHED_QUESTIONS.data) !== JSON.stringify(questions.data)) {
    fs.writeFile('src/assets/questions.json', JSON.stringify(questions, null, 2), err => {
      if (err) throw err;
      console.log('The updated questions.json file has been saved.');
    });
  }
  else {
    console.log('Nothing to update.');
  }
}
