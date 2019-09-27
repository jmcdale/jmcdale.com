import hljs from 'highlight.js'
import multiFence from '../markdown-it-multi-fence/dist'

let multi = 0;
let multiLangs = {};

const customFence = function (md, options) {
    return multiFence(md, 'customFence', {
        render: function (tokens, idx, _options, env, self) {
            multi++;
            let token = tokens[idx];
            let tokenText = token.content;

            let block = md.render(tokenText);
            let tabs = '<div class="multi"><div class="tab">';
            let curLangs = multiLangs[multi];
            for (let i = 0; i < curLangs.length; i++) {
                let langClassName = 'lang-' + curLangs[i];
                let active = '';
                if (i === 0) {
                    active = 'active';
                }

                tabs = tabs + '<button class="tablinks ' + langClassName + ' ' + active + '" onclick="openTab(event, \'' + langClassName + '\' )">' + curLangs[i] + '</button>'
            }

            tabs += '</div>';
            tabs += block;
            tabs += "</div>";
            delete multiLangs[multi];
            multi--;
            return tabs;
        },
        validate: function (params) {
            return params === 'multi';
        }
    })
};

const md = require('markdown-it')({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                if (multi > 0) {
                    let curLangSet = multiLangs[multi];
                    let isFirstInMulti = false;
                    if (curLangSet === undefined) {
                        multiLangs[multi] = [];
                        curLangSet = multiLangs[multi];
                        isFirstInMulti = true
                    }
                    curLangSet.push(lang);

                    let hide = 'style="display: none;"';
                    if (isFirstInMulti) {
                        hide = '';
                    }

                    let result = '<pre class="hljs tabcontent lang-' + lang + '" ' + hide + '><code>' +
                        hljs.highlight(lang, str, true).value +
                        '</code></pre>';
                    return result;
                } else {
                    return '<pre class="hljs"><code>' +
                        hljs.highlight(lang, str, true).value +
                        '</code></pre>';
                }
            } catch (__) {
            }
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    },
    linkify: true
}).use(customFence);

export default md