import EmojiConverter from 'emoji-js';

const emoji = new EmojiConverter();

const set = 'google';

emoji.img_set = set;
emoji.img_sets[set].path = `https://cdn.jsdelivr.net/npm/emoji-datasource-${set}@7.0.2/img/${set}/64/`;
emoji.img_sets[set].sheet = `https://cdn.jsdelivr.net/npm/emoji-datasource-${set}@7.0.2/img/${set}/sheets/64.png`;

export default emoji;
