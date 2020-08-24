// search buffer index
export const bufferIndexOf = (buffer: Buffer, search: Buffer, offset?: number) => {
  offset = offset || 0;

  if (search.length + offset > buffer.length) {
    return -1;
  }

  let x = 0;
  let f = -1;

  for (; offset < buffer.length; offset++) {
    if (buffer[offset] === search[x]) {
      if (!~f) {
        f = offset;
      }
      if (++x === search.length) {
        break;
      }
    } else {
      f = -1;
      x = 0;
    }
  }

  return f;
};

// split buffer to buffer list
export const bufferSplit = (buffer: Buffer, separator: Buffer, limit?: number) => {
  let index: number = 0;
  const result: Buffer[] = [];
  let find: number = bufferIndexOf(buffer, separator, index);

  while (find !== -1) {
    result.push(buffer.slice(index, find));
    index = find + separator.length;
    if (limit && (result.length + 1) === limit) {
      break;
    }
    find = bufferIndexOf(buffer, separator, index);
  }

  result.push(buffer.slice(index));
  return result;
};

const headReg = /^([^:]+):[ \t]?([\x00-\xFF]+)?$/;
export const parseHead = (headBuf: Buffer) => {
  const head = {};
  const headStrList = headBuf.toString().split('\r\n');
  for (const headStr of headStrList) {
    const matched = headReg.exec(headStr);
    if (!matched) {
      continue;
    }
    const name = matched[1].toLowerCase();
    if (name === 'content-disposition') {
      const headCol = {};
      matched[2].split(/;\s*/).forEach((kv: string) => {
        const [ k, v ] = kv.split('=');
        headCol[k] = v ? v.replace(/^"/, '').replace(/"$/, '') : (v ?? true);
      });
      head[name] = headCol;
    } else {
      head[name] = matched[2];
    }
  }
  return head;
};
