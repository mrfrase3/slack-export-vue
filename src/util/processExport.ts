import { Archive } from 'libarchive.js/main.js';
import { Ref } from 'vue';
import sortBy from 'lodash/sortBy';

Archive.init({
    workerUrl: 'libarchive.js/worker-bundle.js'
});

const extractJson = async (dir: any, path: string) => {
    // const file = await dir[path].extract();
    const text = await dir[path].text();
    return JSON.parse(text);
};

export default async (status : Ref) => {
  status.value = 'Downloading...';
  const res = await fetch('/export.zip');
  status.value = 'Extracting...';
  const file = new File([await res.arrayBuffer()], 'export.zip');
  const archive = await Archive.open(file);
  
  const dir = await archive.extractFiles() as any;

  status.value = 'Processing Channels...';

  const allChannels = await extractJson(dir, 'channels.json') as any[];
  const allUsers = await extractJson(dir, 'users.json');
  const users = {} as any;
  allUsers.forEach((user: any) => { users[user.id] = user; });
  const channels = allChannels.filter((c : any) => !c.is_archived);

  await channels.reduce(async (promise: typeof Promise, c : any, i: number) => {
    await promise;
    status.value = `Processing Messages for #${c.name} (${i + 1}/${channels.length})`;
    const messages: any[] = [];
    await Promise.all(Object.keys(dir[c.name]).map(async path => {
      const dateMessages = await extractJson(dir[c.name], path);
      messages.push(...dateMessages.filter((m: any) => m.subtype !== 'channel_join'));
    }));
    messages.forEach(m => {
      if (m.replies?.length) {
        m.replies = messages.filter((mr) => m.replies.some((r : any) => r.ts === mr.ts));
      }
    });
    c.messages = sortBy(messages, 'ts');
    c.rootMessages = c.messages.filter((m : any) => !m.parent_user_id);
  }, Promise.resolve());
  status.value = 'Done';
  return { channels, users };
};
