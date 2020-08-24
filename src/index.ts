import { bufferSplit, parseHead } from './utils';
export const parseMultipart = (req) => {
  if (!req.headers || !req.headers['content-type'] || !Buffer.isBuffer(req.body)) {
    return req;
  }
  const contentType: string = req.headers['content-type'];
  if (!contentType.startsWith('multipart/form-data;')) {
    return req;
  }
  const boundaryMatch = /boundary=(.*)(;|\s|$)/.exec(contentType);
  if (!boundaryMatch || !boundaryMatch[1]) {
    return req;
  }

  const boundary = boundaryMatch[1];
  const bufferSeparator = Buffer.from('\r\n--' + boundary);
  const headSeparator = Buffer.from('\r\n\r\n');
  const field = {};
  const files = [];
  bufferSplit(req.body, bufferSeparator)
    .forEach(buf => {
      const [ headerBuf, data ] = bufferSplit(buf, headSeparator, 2);
      const head = parseHead(headerBuf);
      if (!head['content-disposition']) {
        return;
      }
      if (!head['content-disposition'].filename) {
        if (head['content-disposition'].name) {
          field[head['content-disposition'].name] = data.toString();
        }
        return;
      }
      files.push({
        filename: head['content-disposition'].filename,
        data,
        type: head['content-type']
      });
    });

  req.files = files;
  req.body = field;
  return req;
}