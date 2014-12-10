var inspect = require('util').inspect
    fs = require('fs-extra'),
    xml2js = require('xml2js'),
    moment = require('moment'),
    toMarkdown = require('to-markdown').toMarkdown;

var file = process.argv[2] || "example.xml"; //your wordpress export file
var parser = new xml2js.Parser();

fs.readFile(__dirname + '/' + file, function(err, data) {
    parser.parseString(data, function (err, result) {
        parseFile(result);
        console.log('Done!');
    });
});

function parseFile(result){

    var items = result.rss.channel[0].item;
    for (i in items){
        var obj = {};
        obj.titleInput = items[i].title[0];
        obj.slugInput = items[i]['wp:post_name'][0];
        obj.dateInput = items[i]['wp:post_date'][0];
        obj.content = toMarkdown(items[i]['content:encoded'][0]);
        try {
            var cat = items[i].category;
            var tag = [];
            for (c in cat){
                if (cat[c].$.domain == 'category'){
                    category = cat[c]._;
                } else {
                    tag.push(cat[c]._);
                }
            }
            obj.categoryInput = category || '';
            obj.tagInput = tag.join(', ') || '';
        } catch(e){}
        savePost(obj);
    }
}

function savePost(post) {
    console.log('Saving %s...', post.slugInput)
    var content = '---\n';
    content += 'title: ' + post.titleInput + '\n';
    content += 'date: ' + moment(post.dateInput).format('hh:mm MM/DD/YYYY') + '\n';
    content += 'taxonomy:\n';
    content += '    category: ' + post.categoryInput + '\n';
    content += '    tag: [' + post.tagInput + ']\n';
    content += '---\n';
    content += '\n';
    content += post.content;
    try {
        fs.outputFileSync(process.cwd() + '/posts/' + post.slugInput + '/item.md', content);
        return true;
    } catch (e) {
        return false;
    }
}