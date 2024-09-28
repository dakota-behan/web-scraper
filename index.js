const puppeteer = require("puppeteer-core");
const fs = require("fs");

///advent of code scraper

(false
  ? async () => {
      let filePaths = [];
      const browser = await puppeteer.launch({
        headless: true,
        executablePath:
          "../../../../Program Files/Google/Chrome/Application/chrome.exe",
      });
      fs.existsSync("./adventOfCode") ? null : fs.mkdirSync("./adventOfCode");
      for (let i = 2015; i <= 2022; i++) {
        fs.existsSync(`./adventOfCode/${i}`)
          ? null
          : fs.mkdirSync(`./adventOfCode/${i}`);
        for (let j = 1; j <= 25; j++) {
          filePaths.push(`<script src='./${i}/day${j}.js'></script>`);
          const page = await browser.newPage();
          await page.goto(`https://adventofcode.com/${i}/day/${j}`, {
            waitUntil: "networkidle0",
          });
          const textSelector = await page.waitForSelector(
            "html>body>main>article"
          );
          let text = await textSelector.evaluate((el) => el.textContent);
          fs.writeFileSync(
            `./adventOfCode/${i}/day${j}`,
            `/*${text}*/`.replaceAll("    ", "")
          );
          browser.close();
        }
      }
      let text = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    ${filePaths.join("\n")}
</body>
</html>`;
      fs.writeFileSync(`./adventOfCode/index.html`, text);
    }
  : () => null)();

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

// edabit scraper
let cloneDir = (src, dest) => {
  if (!fs.existsSync(src)) {
    return "source does not exist";
  }
  let readDirFunc = (path, innerPath = path) => {
    let compObj = {};
    let readDir = fs.readdirSync(innerPath);
    for (let i = 0; i < readDir.length; i++) {
      let e = readDir[i];
      if (e.includes(".")) {
        compObj["files"] = compObj["files"]
          ? [...compObj["files"], `${innerPath}/${e}`]
          : [`${innerPath}/${e}`];
      } else if (!e.includes(".")) {
        let isDirTest = true;
        try {
          fs.readdirSync(innerPath + "/" + e);
        } catch (error) {
          isDirTest = false;
        }
        if (isDirTest == false) {
          compObj["files"] = compObj["files"]
            ? [...compObj["files"], `${innerPath}/${e}`]
            : [e];
        } else {
          compObj[e] = readDirFunc(path, innerPath + "/" + e);
        }
      }
    }
    let recurveCollapse = (obj) => {
      let test = Object.values(obj)
        .flat(999)
        .map((e) => (typeof e == "string" ? e : Object.values(e)));
      if (!test.every((e) => typeof e === "string")) {
        return recurveCollapse(test);
      } else {
        return test.map((e) => e);
      }
    };
    let compArr = recurveCollapse(compObj);
    let dirs = [
      ...new Set(
        compArr
          .map((e) => e.slice(0, e.lastIndexOf("/")).replace(path, ""))
          .sort((a, b) => a.length - b.length)
          .filter((e) => e)
      ),
    ];
    return {
      dirs,
      files: recurveCollapse(compObj).map((e) => e.replace(path, "")),
    };
  };
  let allPackagedUp = readDirFunc(src);
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
  for (let i = 0; i < allPackagedUp.dirs.length; i++) {
    try {
      fs.existsSync(`${dest}${allPackagedUp.dirs[i]}`)
        ? null
        : fs.mkdirSync(`${dest}${allPackagedUp.dirs[i]}`);
    } catch {}
  }
  for (let i = 0; i < allPackagedUp.files.length; i++) {
    try {
      fs.readdirSync(`${src}${allPackagedUp.files[i]}`);
    } catch {
      fs.writeFileSync(
        `${dest}${allPackagedUp.files[i]}`,
        fs.readFileSync(`${src}${allPackagedUp.files[i]}`)
      );
    }
  }
  return "done";
};
(true
  ? async () => {
      let template = (obj) =>
        `
//title:
//${obj.title}
//tags:
//${obj.tags.toString()}
//url:https://edabit.com${obj.url}

//Description:
//${obj.desc}

//examples:
${
  obj.examples && obj.examples.length
    ? obj.examples.split("\n").map((e) => `//${e}`)
    : "N/A"
}

//code area
///////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////

//tests:
${console.log(obj.tests)}
`;
      let browser = null;
      let internet;
      //   if (fs.existsSync("../../../../Program Files/Google")) {
      //     browser = await puppeteer.launch({
      //       headless: false,
      //       executablePath:
      //         "../../../../Program Files/Google/Chrome/Application/chrome.exe",
      //     });
      //     internet = false;
      //   } else {
      browser = await puppeteer.launch({
        headless: false,
        executablePath: "c:/Program Files/Google/Chrome/Application/chrome.exe",
      });
      internet = true;
      //   }
      fs.existsSync("./edabit") ? null : fs.mkdirSync("./edabit");

      "Very Easy,Easy,Medium,Hard,Very Hard,Expert"
        .split(",")
        .forEach((e) =>
          fs.existsSync(`./edabit/${e}`) ? null : fs.mkdirSync(`./edabit/${e}`)
        );
      const page = await browser.newPage();
      await page.goto(
        internet
          ? `https://edabit.com/challenges`
          : `https://www.w3schools.com/`,
        {
          waitUntil: "networkidle0",
        }
      );
      let continueLoadFunc = async (dubCheck = false) => {
        ////////////
        setTimeout(async () => {
          let loadMoreBtn = await page
            .waitForSelector("button.ui.fluid.button")
            .catch((_) => false);
          // let loadMoreBtn = false
          page.focus('button[class="ui fluid button"]').catch((e) => null);
          if (loadMoreBtn && !fs.existsSync("./backupFile.json")) {
            page.focus('button[class="ui fluid button"]').catch((e) => null);
            loadMoreBtn = await page
              .waitForSelector("button.ui.fluid.button")
              .catch((_) => false);
            if (loadMoreBtn) {
              page.focus('button[class="ui fluid button"]').catch((e) => null);
              await page.waitForTimeout(500);
              page.focus('button[class="ui fluid button"]').catch((e) => null);
              page.click('button[class="ui fluid button"]').catch((e) => null);
            }
            return continueLoadFunc();
          } else {
            let challengeLinks = await page
              .$$('div>a[class="content"]')
              .catch((_) => false);
            if (!fs.existsSync("./backupFile.json")) {
              for (let i = 0; i < challengeLinks.length; i++) {
                let url = await challengeLinks[i].evaluate((el) =>
                  el.getAttribute("href")
                );

                let difficulty = await challengeLinks[i].evaluate(
                  (el) => Object.values(el.children)[3].textContent
                );
                difficulty = difficulty.replaceAll(/[\n ]/g, "");
                difficulty = difficulty.replace("Very", "Very ");

                let tags = await challengeLinks[i].evaluate((el) =>
                  [
                    ...[...el.children].find(
                      (elem) => elem.getAttribute("class") == "tags"
                    ).children,
                  ].map((elem) => elem.innerText)
                );

                let title = await challengeLinks[i].evaluate(
                  (el) =>
                    [...el.children].find(
                      (elem) => elem.getAttribute("class") == "header"
                    ).innerText
                );

                title = title.replaceAll("'", "`");

                challengeLinks[i] = { url, difficulty, tags, title, id: i };
              }
            } else {
              challengeLinks = JSON.parse(fs.readFileSync("./backupFile.json"));
            }
            fs.writeFileSync(
              "./backupFile.json",
              JSON.stringify(challengeLinks)
            );
            if (!fs.existsSync("./edabit/tempFile.JSON")) {
              let perDifArr = {
                "Very Easy": [],
                Easy: [],
                Medium: [],
                Hard: [],
                "Very Hard": [],
                Expert: [],
                lastScan: 0,
              };
              fs.writeFileSync(
                "./edabit/tempFile.JSON",
                JSON.stringify(perDifArr)
              );
            }
            challengeLinks = internet
              ? challengeLinks
              : [
                  {
                    ...challengeLinks[43],
                    url: "http://127.0.0.1:5501/indivChallenge.html",
                  },
                ];

            for (
              let i = fs.existsSync("./edabit/tempFile.JSON")
                ? Number.parseInt(
                    JSON.parse(fs.readFileSync("./edabit/tempFile.JSON"))
                      .lastScan
                  )
                : 0;
              i < challengeLinks.length;
              i++
            ) {
              await page
                .goto(
                  internet
                    ? `https://edabit.com${challengeLinks[i].url}`
                    : challengeLinks[i].url,
                  {
                    waitUntil: "networkidle0",
                    timeout: 0,
                  }
                )
                .catch((e) => console.log(e));
              await page.waitForTimeout(500);

              const allResultsSelector =
                'div[class="rc-tabs-bar tabs-right no-highlight"]>div[class="rc-tabs-nav-container"]>div[class="rc-tabs-nav-wrap"]>div[class="rc-tabs-nav-scroll"]>div[class="rc-tabs-nav rc-tabs-nav-animated"]>div[aria-selected="false"]>span';

              let nextSelector =
                'div[class="rc-tabs-bar tabs-right no-highlight"]>div[class="rc-tabs-nav-container"]>div[class="rc-tabs-nav-wrap"]>div[class="rc-tabs-nav-scroll"]>div[class="rc-tabs-nav rc-tabs-nav-animated"]>div[aria-selected="false"]>span';

              let finalSelector =
                'div[class="CodeMirror-lines"]>div>div[class="CodeMirror-code"]';

              //desc
              let findDesc = await page.waitForSelector("div>p", {
                timeout: 30000,
              });
              let miscInfoSelector = await findDesc.evaluate((e) =>
                [...e.parentElement.children].map((e) => e.innerText)
              );

              await page.waitForSelector(allResultsSelector, {
                timeout: 30000,
              });
              let tests = await page.$(allResultsSelector);

              let miscInfo = miscInfoSelector;

              nextSelector =
                'div[class="rc-tabs-bar tabs-right no-highlight"]>div[class="rc-tabs-nav-container"]>div[class="rc-tabs-nav-wrap"]>div[class="rc-tabs-nav-scroll"]>div[class="rc-tabs-nav rc-tabs-nav-animated"]>div[aria-selected="false"]>span';
              await page.waitForSelector(nextSelector, { timeout: 30000 });
              await page.focus(nextSelector);
              await tests.click();

              finalSelector =
                'div[class="CodeMirror-lines"]>div>div[class="CodeMirror-code"]';
              await page.waitForSelector(finalSelector, { timeout: 30000 });
              await page.focus(finalSelector);
              tests = await page.$eval(finalSelector, (e) => e.innerText);

              ///
              challengeLinks[i] = {
                ...challengeLinks[i],
                tests,
                miscInfo,
              };
              let tempFileUpdate = JSON.parse(
                fs.readFileSync("./edabit/tempFile.JSON")
              );
              console.log(
                `${(tempFileUpdate.lastScan / challengeLinks.length).toFixed(
                  1
                )}%`,
                `~~ ${challengeLinks.length - 1 - tempFileUpdate.lastScan} left`
              );
              tempFileUpdate[challengeLinks[i].difficulty].push(
                challengeLinks[i]
              );
              tempFileUpdate.lastScan++;
              fs.writeFileSync(
                "./edabit/tempFile.JSON",
                JSON.stringify(tempFileUpdate)
              );
            }

            let masterObj = JSON.parse(fs.readFileSync("./tempFile.JSON"));
            let veryEasy = masterObj["Very Easy"]
              .map((e, i, a) =>
                i % 3 == 0
                  ? a.slice(i, i + 3).map((el) => {
                      return { ...el, page: Math.floor(i / 3) };
                    })
                  : false
              )
              .filter((e) => e);
            let easy = masterObj["Easy"]
              .map((e, i, a) =>
                i % 3 == 0
                  ? a.slice(i, i + 3).map((el) => {
                      return { ...el, page: Math.floor(i / 3) };
                    })
                  : false
              )
              .filter((e) => e);
            let medium = masterObj["Medium"]
              .map((e, i, a) =>
                i % 3 == 0
                  ? a.slice(i, i + 3).map((el) => {
                      return { ...el, page: Math.floor(i / 3) };
                    })
                  : false
              )
              .filter((e) => e);
            let hard = masterObj["Hard"]
              .map((e, i, a) =>
                i % 3 == 0
                  ? a.slice(i, i + 3).map((el) => {
                      return { ...el, page: Math.floor(i / 3) };
                    })
                  : false
              )
              .filter((e) => e);
            let veryHard = masterObj["Very Hard"]
              .map((e, i, a) =>
                i % 3 == 0
                  ? a.slice(i, i + 3).map((el) => {
                      return { ...el, page: Math.floor(i / 3) };
                    })
                  : false
              )
              .filter((e) => e);
            let expert = masterObj["Expert"]
              .map((e, i, a) =>
                i % 3 == 0
                  ? a.slice(i, i + 3).map((el) => {
                      return { ...el, page: Math.floor(i / 3) };
                    })
                  : false
              )
              .filter((e) => e);
            masterObj = {
              "Very Easy": veryEasy,
              Easy: easy,
              Medium: medium,
              Hard: hard,
              "Very Hard": veryHard,
              Expert: expert,
            };
            let allJsPages = [];
            for (let difficulty in masterObj) {
              for (let i = 0; i < masterObj[difficulty].length; i++) {
                allJsPages.push(
                  `<script src="./${difficulty}/${i}.js"></script>`
                );
                fs.writeFileSync(
                  `./${difficulty}/${i}.js`,
                  masterObj[difficulty][i]
                    .map((e) => template(e))
                    .join(`${"/".repeat(50)}\n${"/".repeat(50)}\n`.repeat(3))
                );
              }
            }

            let htmlPage = `<!DOCTYPE html>
                <html lang="en">

                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>

                <body style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
                    <h1>hello, and welcome to reference page for edabit challenges</h1>
                    <h3>to use this site, put in your filter parameters and it will tell you the file location of what you are looking
                        for</h3>
                    <h3>all files will console log to this index page, so don't close this window</h3>
                    <form id="form" style="display:flex;flex-direction: column;align-items: center;justify-content: center">
                        <label>
                            challenge title:
                            <input type="text">
                        </label>
                        <br>
                        <label style="display: flex">
                            difficulty:
                            <label
                                style="display: flex;flex-direction: column;text-align: center; border: black solid 1px; margin: .25rem">all<input
                                    type="radio" name="difficulty" value="" checked="true"></label>
                            <label
                                style="display: flex;flex-direction: column;text-align: center; border: black solid 1px; margin: .25rem">very
                                Easy<input type="radio" name="difficulty" value="Very Easy"></label>
                            <label
                                style="display: flex;flex-direction: column;text-align: center; border: black solid 1px; margin: .25rem">Easy<input
                                    type="radio" name="difficulty" value="Easy"></label>
                            <label
                                style="display: flex;flex-direction: column;text-align: center; border: black solid 1px; margin: .25rem">Medium<input
                                    type="radio" name="difficulty" value="Medium"></label>
                            <label
                                style="display: flex;flex-direction: column;text-align: center; border: black solid 1px; margin: .25rem">Hard<input
                                    type="radio" name="difficulty" value="Hard"></label>
                            <label
                                style="display: flex;flex-direction: column;text-align: center; border: black solid 1px; margin: .25rem">very
                                Hard<input type="radio" name="difficulty" value="Very Hard"></label>
                            <label
                                style="display: flex;flex-direction: column;text-align: center; border: black solid 1px; margin: .25rem">Expert<input
                                    type="radio" name="difficulty" value="Expert"></label>
                        </label>
                        <br>
                        <label style="display:grid;grid-template-columns: 1fr 1fr 1fr;">
                            tags:
                            <label>Algebra <input type="checkbox" class="tag Algebra" value="Algebra"></label>
                            <label>Algorithms <input type="checkbox" class="tag Algorithms" value="Algorithms"></label>
                            <label>Arrays <input type="checkbox" class="tag Arrays" value="Arrays"></label>
                            <label>Bit Operations <input type="checkbox" class="tag Bit Operations" value="Bit Operations"></label>
                            <label>Bug Fixes <input type="checkbox" class="tag Bug Fixes" value="Bug Fixes"></label>
                            <label>Classes <input type="checkbox" class="tag Classes" value="Classes"></label>
                            <label>Closures <input type="checkbox" class="tag Closures" value="Closures"></label>
                            <label>Conditions <input type="checkbox" class="tag Conditions" value="Conditions"></label>
                            <label>Control Flow <input type="checkbox" class="tag Control Flow" value="Control Flow"></label>
                            <label>Cryptography <input type="checkbox" class="tag Cryptography" value="Cryptography"></label>
                            <label>Data Structures <input type="checkbox" class="tag Data Structures" value="Data Structures"></label>
                            <label>Dates <input type="checkbox" class="tag Dates" value="Dates"></label>
                            <label>Formatting <input type="checkbox" class="tag Formatting" value="Formatting"></label>
                            <label>Functional Programming <input type="checkbox" class="tag Functional Programming"
                                    value="Functional Programming"></label>
                            <label>Games <input type="checkbox" class="tag Games" value="Games"></label>
                            <label>Geometry <input type="checkbox" class="tag Geometry" value="Geometry"></label>
                            <label>Higher Order Functions <input type="checkbox" class="tag Higher Order Functions"
                                    value="Higher Order Functions"></label>
                            <label>Interview <input type="checkbox" class="tag Interview" value="Interview"></label>
                            <label>Language Fundamentals <input type="checkbox" class="tag Language Fundamentals"
                                    value="Language_fundamentals"></label>
                            <label>Logic <input type="checkbox" class="tag Logic" value="Logic"></label>
                            <label>Loops <input type="checkbox" class="tag Loops" value="Loops"></label>
                            <label>Math <input type="checkbox" class="tag Math" value="Math"></label>
                            <label>Numbers <input type="checkbox" class="tag Numbers" value="Numbers"></label>
                            <label>Objects <input type="checkbox" class="tag Objects" value="Objects"></label>
                            <label>Physics <input type="checkbox" class="tag Physics" value="Physics"></label>
                            <label>Recursion <input type="checkbox" class="tag Recursion" value="Recursion"></label>
                            <label>Regex <input type="checkbox" class="tag Regex" value="Regex"></label>
                            <label>Scope <input type="checkbox" class="tag Scope" value="Scope"></label>
                            <label>Sorting <input type="checkbox" class="tag Sorting" value="Sorting"></label>
                            <label>Strings <input type="checkbox" class="tag Strings" value="Strings"></label>
                            <label>Validation <input type="checkbox" class="tag Validation" value="Validation"></label>
                        </label>
                    </form>
                    <div class="resultArea" id="resultArea" style="max-height: 15rem; border: black solid 2px;overflow-y: scroll"></div>
                    <script type="module">
                        let reference
                        await fetch('./reference.JSON').then(res => res.json()).then(res => reference = res)
                        let resultArea = document.getElementById('resultArea')
                        let displayArr = [...reference]
                        let allInputs = [...document.querySelectorAll('input')]
                        let tagSelector = [...document.querySelectorAll('.tag')]
                        let difficultySelector = [...document.querySelectorAll('input[type="radio"]')]
                        let nameSelector = document.querySelector('input[type="text"]')
                        allInputs.forEach(e => e.addEventListener(e.type == 'text' ? 'input' : 'change', () => {
                            displayArr = reference.filter(e => (nameSelector.value == '' || e.title.toLowerCase().includes(nameSelector.value.toLowerCase())) &&
                                (difficultySelector.find(e => e.checked).value == '' || e.difficulty == difficultySelector.find(e => e.checked).value)
                                &&
                                (tagSelector.filter(e => e.checked).length == 0 || tagSelector.filter(e => e.checked).map(e => e.value.toLowerCase().replace(' ', "_")).every(el => e.tags.includes(el)))

                            )
                            resultArea.innerHTML = displayArr.length == 0 ? '<h4>none found</h4>' : displayArr.map(e =>'<div style="border-bottom:black solid 1px;">\\n<h5>title:' + e.title + '</h5>\\n<h5>location: ./' + e.difficulty + '/' + e.page + '</h5>\\n</div>').join('\\n')
                        }
                        ))
                        resultArea.innerHTML = displayArr.length == 0 ? '<h4>none found</h4>' : displayArr.map(e =>'<div style="border-bottom:black solid 1px;">\\n<h5>title:' + e.title + '</h5>\\n<h5>location: ./' + e.difficulty + '/' + e.page + '</h5>\\n</div>').join('\\n')

                    </script>
                    <script src="./chai/chai.js"></script>
                    <script src="./Tests.js"></script>
                    ${allJsPages.join("\n")}
                </body>

                </html>`;
            fs.writeFileSync(`./edabit/index.html`, htmlPage);
            fs.writeFileSync(
              `./edabit/reference.JSON`,
              JSON.stringify(Object.values(masterObj).flat(2))
            );
            fs.writeFileSync(
              "./edabit/Tests.js",
              "Tests = {}\nfor (let key in chai.assert) {\n    let testkey = `assert${key[0].toUpperCase()}${key.slice(1)}`\n    Tests = {\n        ...Tests,\n        [testkey]: chai.assert[key]\n    }\n}\nTest = { ...Tests, }\n"
            );
            cloneDir("./node_modules/chai", "./edabit/chai");
          }
        }, 250);
      };
      continueLoadFunc();
    }
  : () => null)();

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
// puppeteer scraoer
(false
  ? async () => {
      let browser = null;
      let internet;
      if (fs.existsSync("../../../../Program Files/Google")) {
        browser = await puppeteer.launch({
          headless: false,
          executablePath:
            "../../../../Program Files/Google/Chrome/Application/chrome.exe",
        });
        internet = false;
      } else {
        browser = await puppeteer.launch({
          headless: false,
          executablePath:
            "../../../../Program Files (x86)/Google/Chrome/Application/chrome.exe",
        });
        internet = true;
      }
      fs.existsSync("./puppeteerDocuments")
        ? null
        : fs.mkdirSync("./puppeteerDocuments");
      let page = await browser.newPage();
      let pageCrawler = async (
        url = "https://pptr.dev/api/puppeteer.puppeteernode"
      ) => {
        await page
          .goto(internet ? url : "http://127.0.0.1:5502/pupetterSite.html", {
            waitUntil: "networkidle0",
            timeout: 0,
          })
          .catch((e) => console.log(e));
        let htmlFileName = await page
          .url()
          .replace(
            internet
              ? "https://pptr.dev/api/puppeteer."
              : "http://127.0.0.1:5502/pupetterSite.html",
            internet ? "" : "test"
          );

        let theTarget = await page.$(
          "#__docusaurus_skipToContent_fallback > div > main > div > div > div.col.docItemCol_VOVn > div > article > div.theme-doc-markdown.markdown"
        );
        let title = await theTarget.$eval("h1", (e) => e.innerText);
        //set a tags to local file paths
        await theTarget.$$eval("a", (e) =>
          e.map((el) =>
            el.setAttribute(
              "href",
              el.getAttribute("href").replace("/api/puppeteer.", "./") + ".html"
            )
          )
        );

        //remove unneccesary parts
        await theTarget.$$eval(".buttonGroup__atx", (e) =>
          e.map((el) => (el.outerHTML = ""))
        );

        let targetHTML = await theTarget.evaluate((e) => e.outerHTML);

        let navButtons = await page.$(
          "#__docusaurus_skipToContent_fallback > div > main > div > div > div.col.docItemCol_VOVn > div > nav"
        );

        let navButtonHTML = await navButtons.evaluate((e) => e.outerHTML);

        fs.writeFileSync(
          `./puppeteerDocuments/${htmlFileName}.html`,
          `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="./style.css">
            <title>${title}</title>
        </head>
        <body>
        ${targetHTML}${navButtonHTML}
        </body>
        </html>`
        );
        let nextBtn = await page
          .$(
            "#__docusaurus_skipToContent_fallback > div > main > div > div > div.col.docItemCol_VOVn > div > nav > a.pagination-nav__link.pagination-nav__link--next"
          )
          .catch((_) => false);

        if (nextBtn) {
          let url = await nextBtn.evaluate((e) => e.getAttribute("href"));
          return internet ? pageCrawler("https://pptr.dev" + url) : "done";
        } else {
          return "done";
        }
      };
      await pageCrawler();
      await browser.close();

      let titles = fs.readdirSync("./puppeteerDocuments");
      let package = titles.map((e) => {
        let html = fs.readFileSync(`./puppeteerDocuments/${e}`).toString();
        return {
          link: `/${e}`,
          title: html.slice(
            html.indexOf("<title>") + 7,
            html.indexOf("</title>")
          ),
        };
      });
      let navHTML = `<nav>\n${package
        .map((e) => `<a href=".${e.link}">${e.title}</a>`)
        .join("\n")}\n</nav>`;
      fs.mkdirSync("./puppeteerDocuments/htmlFiles");
      fs.readdirSync("./puppeteerDocuments")
        .filter((e) => e !== "htmlFiles")
        .forEach((e) => {
          fs.writeFileSync(
            `./puppeteerDocuments/htmlFiles/${e}`,
            fs
              .readFileSync(`./puppeteerDocuments/${e}`)
              .toString()
              .replace(
                "</body>",
                `<script src="./script.js"></script>\n</body>`
              )
          );
          return fs.rmSync(`./puppeteerDocuments/${e}`);
        });
      fs.writeFileSync(
        "./puppeteerDocuments/htmlFiles/script.js",
        `let aTags = [...document.querySelectorAll('a')]
        aTags = aTags.filter(e => {
            let href = e.getAttribute('href')
            return !(href.includes('html') || href.includes('http') || href.includes('#'))
        })
        aTags.map(e => {
            // console.log(e.getAttribute('href'))
            let href = e.getAttribute('href')
            console.log(href)
            href = href.replaceAll('/api', '.').replace(/\.?puppeteer\.?/, '')
            href[0]=='.'?href=href.slice(1):null
            href = href + '.html'
            e.setAttribute('href', href)
            return href
        })
        let navBar = document.getElementById('navBar')
        if (navBar) {
            Array.from(navBar.children).forEach(e => {
                let link = './htmlFiles'+e.getAttribute('href').replace('./','/')
                e.setAttribute('href', '#')
                e.addEventListener('click', () => {
                    document.getElementById('iframe').setAttribute('src', link)
                })
            })
        }
        let iframe = document.getElementById('iframe')
        if (iframe) {
            iframe.addEventListener('load', e => {
                document.getElementsByTagName('title')[0].innerText =
                    iframe.contentWindow.document.getElementsByTagName('title')[0].innerText
            })
        }`
      );
      fs.writeFileSync(
        "./puppeteerDocuments/htmlFiles/style.css",
        `*,
        html,
        body,
        ::before,
        ::after {
            padding: 0;
            box-sizing: border-box
        }
        
        aside {
            position: fixed;
            left: 0px;
            top: 0rem;
            max-height: 100vh;
            overflow-y: scroll;
            background-color: white;
            overflow-x: hidden;
            width: 380px;
            height:100vh;
        }
        
        aside>nav {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        aside>nav>a {
            padding: .5rem 0;
            text-decoration: none;
            color: #333;
            font-weight: 900;
        }
        
        aside>nav>a:hover {
            transition: .5s;
            transform: scale(1.1);
            transform-origin: 50% 50%;
        }
        
        body {
            width: 100vw;
            word-wrap: break-word;
            position: absolute;
            padding: 2rem;
            margin: 0;
            /* left: 400px; */
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        table {
            font-family: Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }
        
        table td,
        table th {
            border: 1px solid #ddd;
            padding: 8px;
        }
        
        table tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        
        table tr:hover {
            background-color: #ddd;
        }
        
        table th {
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
            background-color: #04AA6D;
            color: white;
        }
        
        .pagination-nav {
            display: flex;
            width: 100%;
            justify-content: space-evenly;
        }
        
        .pagination-nav>a {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            border: black solid 2px;
            border-radius: 1rem;
            padding: .5rem;
            text-decoration: none;
            color: #333;
            font-weight: 900;
        }
        
        .pagination-nav>a:hover {
            transition: .5s;
            transform: scale(1.1);
            transform-origin: 50% 50%;
        }
        
        .theme-code-block {
            border: #333 solid 1px;
        }
        
        iframe {
            width: 100vw;
            /* max-width: calc(100vw - 400px); */
        
            height: 100vh;
            position: absolute;
            left: 0px;
            padding: 0 0 0 400px;
            margin: 0;
            top: 0;
            z-index: -1;
        
        }`
      );
      fs.writeFileSync(
        "./puppeteerDocuments/index.html",
        `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="./htmlFiles/style.css">
        <title>puppeteer</title>
    </head>
    <body>
    <aside>
    ${navHTML.replace("<nav>", ' <nav id="navBar">')}
    </aside>
    <iframe src="./htmlFiles${package[0].link}" id="iframe"></iframe>
    <script src="./htmlFiles/script.js"></script>
    </body>
    </html>`
      );
    }
  : () => null)();

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
// react-strap scraoer
(false
  ? async () => {
      let browser = null;
      let internet;
      if (fs.existsSync("../../../../Program Files/Google")) {
        browser = await puppeteer.launch({
          headless: false,
          executablePath:
            "../../../../Program Files/Google/Chrome/Application/chrome.exe",
        });
        internet = false;
      } else {
        browser = await puppeteer.launch({
          headless: false,
          executablePath:
            "../../../../Program Files (x86)/Google/Chrome/Application/chrome.exe",
        });
        internet = true;
      }
      internet = true;
      fs.existsSync("./reactStrapDocuments")
        ? null
        : fs.mkdirSync("./reactStrapDocuments");
      let page = await browser.newPage();

      page.goto(
        internet
          ? "https://reactstrap.github.io/?path=/docs/components-accordion--accordion"
          : "http://127.0.0.1:5502/reactStrap-openAccord.html",
        {
          waitUntil: "networkidle0",
        }
      );
      await new Promise((r) => setTimeout(r, 1000));
      let buttons = await page.$$("button[aria-expanded=false]");
      let openAccordRecurve = async (i = 0) => {
        if (i >= buttons.length) {
          return "done";
        }
        let el = buttons[i];
        el.hover();
        await new Promise((r) => setTimeout(r, 100));
        await el.click();
        await new Promise((r) => setTimeout(r, 100));
        return openAccordRecurve(i + 1);
      };
      await openAccordRecurve();
      await new Promise((r) => setTimeout(r, 200));
      let pages = await page.$$eval("a[data-parent-id]", (arr) =>
        arr.map((e) =>
          e.getAttribute("data-parent-id").includes("components")
            ? `${e.href.replace("story", "docs")}`
            : false
        )
      );
      pages = pages
        .filter((e) => e)
        .reduce((a, b) => {
          return {
            ...a,
            [b.slice(b.indexOf("/components-") + 12, b.indexOf("--"))]: a[
              b.slice(b.indexOf("/components-") + 12, b.indexOf("--"))
            ]
              ? [
                  ...a[
                    b.slice(b.indexOf("/components-") + 12, b.indexOf("--"))
                  ],
                  `${b.slice(b.indexOf("/docs") + 5)}`,
                ]
              : [`https://reactstrap.github.io${b.slice(b.indexOf("/?"))}`],
          };
        }, {});
      const categoryRecurve = async (i = 0) => {
        let arr = Object.keys(pages);
        if (i >= arr.length) {
          return "done";
        }
        let newTab = await browser.newPage().catch((e) => e);
        let cssFiles = [];
        newTab.on("response", async (response) => {
          if (response.request().resourceType() === "stylesheet") {
            let css = await response.text();
            cssFiles.push(css.replaceAll(/\}\;/g, (e) => `${e}\n`));
          }
        });
        await newTab
          .goto(pages[arr[i]][0], {
            waitUntil: "networkidle0",
          })
          .catch((e) => e);
        await newTab
          .waitForSelector("iframe[data-is-loaded=true]")
          .catch((e) => e);
        let iframeContent = await newTab.$eval(
          "iframe[data-is-loaded=true]",
          (e) =>
            e.contentWindow.document.getElementsByTagName("body")[0].outerHTML
        );
        fs.writeFileSync(
          `./reactStrapDocuments/${arr[i]}.html`,
          `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel='stylesheet' href='./bootstrap5.css'>
    <style>${cssFiles.join("")}</style>
    <title>Document</title>
</head>
${iframeContent}
<script src='./bootstrap5.js'></script>
<script src='.popper.js'></script>
</html>
        `
        );

        pages[arr[i]][0] = pages[arr[i]][0].slice(
          pages[arr[i]][0].indexOf("/docs") + 5
        );

        newTab.close();
        return await categoryRecurve(i + 1);
      };
      await categoryRecurve();
      console.log(pages);

      browser.close();
    }
  : () => null)();

//test
(false
  ? async () => {
      let browser = null;
      let internet;
      if (fs.existsSync("../../../../Program Files/Google")) {
        browser = await puppeteer.launch({
          headless: false,
          executablePath:
            "../../../../Program Files/Google/Chrome/Application/chrome.exe",
        });
        internet = false;
      } else {
        browser = await puppeteer.launch({
          headless: false,
          executablePath:
            "../../../../Program Files (x86)/Google/Chrome/Application/chrome.exe",
        });
        internet = true;
      }
      let page = await browser.newPage();

      let html = await page.$eval("html", (e) => e.outerHTML);
      fs.writeFileSync(
        `./w3.html`,
        `
            <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
        ${cssFiles.join("")}
        </style>
        <title>Document</title>
    </head>
    ${html}
    </html>
    `
      );
      browser.close();
    }
  : () => null)();

//each button has an id, each child has data-parent-id attribute referencing them
