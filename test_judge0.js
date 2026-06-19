import axios from 'axios';
axios.post('https://ce.judge0.com/submissions?wait=true', {
  language_id: 82,
  source_code: ".headers on\n.mode list\n.separator '|_|_|'\n.nullvalue '___NULL___'\nCREATE TABLE T (a INT, b TEXT);\nINSERT INTO T VALUES(1, NULL);\nINSERT INTO T VALUES(2, 'A|B');\nSELECT * FROM T;"
}).then(r => console.log(r.data)).catch(console.error);
