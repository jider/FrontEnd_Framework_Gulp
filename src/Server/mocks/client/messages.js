'use strict';


var fs = require('fs');

var docContext = require('../../config').context.docContext,
    codeFile = fs.readFileSync('src/Server/mocks/data/code.txt', 'utf8');


// --------------------------------------------------


module.exports = {
    "context": docContext,
    "title": "Messages Module",
    "doc": {
        "title": "Messages Module",
        "intro_title": "Use",
        "intro_text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur cupiditate debitis, dicta enim eos, et explicabo fugiat iste magni molestiae praesentium quaerat quibusdam repellendus sint sit tempora tenetur veritatis?",
        "code": {
            "lang": "Javascript",
            "content": codeFile
        },
        "messages": {
            "default": [
                {"class":"msg"},
                {"class":"msg -valid"},
                {"class":"msg -error"},
                {"class":"msg -warning"},
                {"class":"msg -info"}
            ],
            "small": [
                {"class":"msg -small"},
                {"class":"msg -small -valid"},
                {"class":"msg -small -error"},
                {"class":"msg -small -warning"},
                {"class":"msg -small -info"}
            ],
            "large": [
                {"class":"msg -large"},
                {"class":"msg -large -valid"},
                {"class":"msg -large -error"},
                {"class":"msg-error"},
                {"class":"msg -large -warning"},
                {"class":"msg -large -info"}
            ],
            "xlarge": [
                {"class":"msg -xlarge"},
                {"class":"msg -xlarge -valid"},
                {"class":"msg -xlarge -error"},
                {"class":"msg -xlarge -warning"},
                {"class":"msg -xlarge -info"}
            ]
        }
    }
};