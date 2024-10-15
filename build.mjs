import * as esbuild from 'esbuild'
import katex from 'katex'
import fs from 'fs'

const togaMarkdown = {
  name: 'TogaMarkdown',
  setup(build) {
    build.onResolve({ filter: /\.md$/ }, ({ path }) => ({
      path: path,
      namespace: 'toga',
    }))
    build.onLoad({ filter: /.*/, namespace: 'toga' }, async ({ path }) => {
      // 入力を読む．
      let input = fs.readFileSync(path, 'utf8')
      const output = { '': { h: '', c: [] } }
      let parents = ['']

      function consume(regexResult) {
        input = input.substring(regexResult.indices[0][1])
      }

      let num_blanks = 0

      consume(/\p{Zs}*/du.exec(input))
      let hash = /^#+/d.exec(input)
      for (;;) {
        consume(hash)
        const whitespaceAfterHash = /^\p{Zs}+/du.exec(input)
        if (whitespaceAfterHash) {
          consume(whitespaceAfterHash)
        } else {
          throw `# の後に空白が無い`
        }
        const titleWithTrailingWhitespace = /^[^\n]+/d.exec(input)
        if (titleWithTrailingWhitespace) {
          consume(titleWithTrailingWhitespace)
        } else {
          throw `# の後にタイトルが無い`
        }
        const title = /(.*?)\p{Zs}*$/u.exec(titleWithTrailingWhitespace)[1]

        const level = hash[0].length

        if (parents[level - 1] === undefined) {
          throw `「${title}」の親が無い`
        }
        output[parents[level - 1]].c.push(title)
        if (output[title] === undefined) {
          output[title] = { h: '', c: []}
        }

        parents = parents.slice(0, level)
        parents.push(title)

        for (;;) {
          const leadingWhitespace = /^\p{Zs}*/du.exec(input)
          consume(leadingWhitespace)
          if (input === '') {
            return {
              contents: JSON.stringify(output),
              loader: 'json',
            }
          }
          if (hash = /^#+/d.exec(input)) {
            break
          }
          const blankLine = /^\n/d.exec(input)
          if (blankLine) {
            consume(blankLine)
            continue
          }

          output[title].h += '<p>'
          let type = null
          for (;; consume(/^\p{Zs}*\n?\p{Zs}*/du.exec(input))) {
            const blank = /^{(.*?)}/d.exec(input)
            if (blank) {
              consume(blank)
              output[title].h += ` (<span id='空欄${num_blanks}' style='opacity:0;' onclick="空欄${num_blanks}.style.opacity=1">${blank[1]}</span>) `
              num_blanks++
              continue
            }
            const math = /^\$(.*?)\$/d.exec(input)
            if (math) {
              consume(math)
              if (type === '欧') {
                output[title].h += ' '
              } else if (type === '和') {
                output[title].h += '\u2005'
              }
              output[title].h += katex.renderToString(math[1])
              type = '欧'
              continue
            }
            const english = /^[-\d\w,.()]+/d.exec(input)
            if (english) {
              consume(english)
              if (type === '欧') {
                output[title].h += ' '
              } else if (type === '和') {
                output[title].h += '\u2005'
              }
              output[title].h += english[0]
              type = '欧'
              continue
            }
            const japanese = /^[^-${}#\d\w()\n\p{Zs}]+/du.exec(input)
            if (japanese) {
              consume(japanese)
              if (type === '欧') {
                output[title].h += '\u2005'
              }
              output[title].h += japanese[0]
              type = '和'
              continue
            }
            output[title].h += '</p>'
            break
          }
        }
      }
    })
  }
}

await esbuild.build({
  entryPoints: ['index.js'],
  bundle: true,
  minify: true,
  plugins: [togaMarkdown],
  outfile: 'public/main.js',
})
