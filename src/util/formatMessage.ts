import emoji from './emoji';

const count = (str: string, split: RegExp) => str.split(split)[0].length;

const escapeChars = {
  '*': '---escape-star---',
  '_': '---escape-underscore---',
  '~': '---escape-tilde---',
  ':': '---escape-colon---',
} as any;

const escapeText = (text: string) => {
  return Object.keys(escapeChars).reduce((acc, key) => acc.replaceAll(key, escapeChars[key]), text);
};

const unescapeText = (text: string) => {
  return Object.keys(escapeChars).reduce((acc, key) => acc.replaceAll(escapeChars[key], key), text);
};

const ulSplitRegExp = /(-|\* |•|◦|▪︎)/;
const olSplitRegExp = /(\d+\.)/;

const parseText = (text: string, users: any, channels: any[]) => {
  // console.log(text);
  return unescapeText(text.trim()
    .replace(/((\n|^)\s*(-|\* |•|◦|▪︎)[^\n]+)+/g, (match: string) => {
      const lines = match.split('\n').filter(Boolean);
      return lines.map((line: string, i: number) => {
        let html = '';
        const aboveLine = lines[i - 1];
        // const belowLine = lines[i + 1];
        const isFirstLine = i === 0;
        const isLastLine = i === lines.length - 1;
        if (aboveLine && count(aboveLine, ulSplitRegExp) !== count(line, ulSplitRegExp)) html += '</ul>';
        if (isFirstLine || count(aboveLine, ulSplitRegExp) !== count(line, ulSplitRegExp)) {
          html += `<ul class="formatter-ul" data-indent="${Math.round(count(line, ulSplitRegExp) / 4)}">`;
        }
        html += `<li>${line.split(ulSplitRegExp)[2].trim()}</li>`;
        if (isLastLine) {
          html += '</ul>';
        }
        return html;
      }).join('');
    })
    .replace(/((\n|^)\s*(\d+\.)[^\n]+)+/g, (match: string) => {
      const lines = match.split('\n').filter(Boolean);
      return lines.map((line: string, i: number) => {
        let html = '';
        const aboveLine = lines[i - 1];
        // const belowLine = lines[i + 1];
        const isFirstLine = i === 0;
        const isLastLine = i === lines.length - 1;
        if (aboveLine && count(aboveLine, olSplitRegExp) !== count(line, olSplitRegExp)) html += '</ul>';
        if (isFirstLine || count(aboveLine, olSplitRegExp) !== count(line, olSplitRegExp)) {
          html += `<ul class="formatter-ol" data-indent="${Math.round(count(line, olSplitRegExp) / 4)}">`;
        }
        html += `<li data-num="${`${line}`.match(/(\d+\.)/)?.[0] ?? `${i + 1}.`}">${line.split(olSplitRegExp)[2].trim()}</li>`;
        if (isLastLine) {
          html += '</ul>';
        }
        return html;
      }).join('');
    })
    .replace(/((\n|^)(>)[^\n]+)+\n?/g, (match: string) => {
      return `<blockquote class="formatter-bq">${match.replace(/(\n|^)(>)/g, '\n').trim()}</blockquote>`;
    })
    .replace(/<@(U[\w]+)\|?([^>]+)?>/g, (match: string, userId: string, alt: string) => {
      const user = users[userId];
      const name = user.profile?.display_name || user.profile?.real_name || user.name;
      return escapeText(user ? `<span class="formatter-mention">@${alt || name}</span>` : match);
    })
    .replace(/<!([\w\^]+\|?([^>]+)?)>/g, (match: string, mention: string, alt: string) => {
      return escapeText(`<span class="formatter-mention">@${alt || mention}</span>`);
    })
    .replace(/<#(C[\w\^]+)\|?([^>]+)?>/g, (match: string, channelId: string, alt: string) => {
      const channel = channels.find((c: any) => channelId.startsWith(c.id));
      return escapeText(channel ? `<a class="formatter-mention" href="/channel/${channel.id}">#${alt || channel.name}</a>` : match);
    })
    .replace(/<((https?:\/\/|mailto:|tel:)[^<|>]+)\|?([^<>]+)?>/g, (match: string, href: string, proto: string, alt: string) => {
      return escapeText(`<a class="formatter-link" href="${href}" target="_blank">${alt || href}</a>`);
    })
    .replace(/(:[^: ]+:)/gm, (match: string) => {
      const emojiHtml = emoji.replace_colons(match);
      return emojiHtml.includes('<span') ? escapeText(emojiHtml) : emojiHtml;
    })
    .replace(/\*([^\*]+)\*/gm, (match: string, text: string) => `<strong>${text}</strong>`)
    .replace(/\_([^\_]+)\_/gm, (match: string, text: string) => `<em>${text}</em>`)
    .replace(/\~([^\~]+)\~/gm, (match: string, text: string) => `<del>${text}</del>`)
    .replace(/\n/g, '<br>'));
};

export default (text: string, users: any, channels: any[]) => {
  return text.split('```').map((block: string, i: number) => {
    if (i % 2 === 0) {
      const inlines = [] as string[];
      const escaped = block.replace(/(`[^`]+`)/g, (match: string) => {
        inlines.push(`<code class="formatter-code inline">${match.replace(/(^`)|(`$)/g, '')}</code>`);
        return `---inline-code-${inlines.length - 1}---`;
      });
      const parsed = parseText(escaped, users, channels);
      return inlines.reduce((acc, inline, i) => acc.replace(`---inline-code-${i}---`, inline), parsed);
    }
    return `<pre class="formatter-code block"><code>${block}</code></pre>`;
  }).join('');
};
